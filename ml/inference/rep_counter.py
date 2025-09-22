#!/usr/bin/env python3
"""
Sportify Rep Counter - Exercise Repetition Counting using Pose Detection

This module implements exercise-specific repetition counting algorithms
using MediaPipe pose landmarks and angle calculations.

Supported exercises:
- Squats
- Push-ups  
- Jumping Jacks
- Pull-ups (when upper body visible)

Usage:
from rep_counter import RepCounter

counter = RepCounter(exercise_type='squat')
for frame in video_frames:
    landmarks = pose_detector.detect(frame)
    rep_count, phase = counter.update(landmarks)
"""

import numpy as np
import math
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

class ExerciseType(Enum):
    SQUAT = "squat"
    PUSHUP = "pushup"
    JUMP = "jump"
    PULLUP = "pullup"

class ExercisePhase(Enum):
    NEUTRAL = "neutral"
    DOWN = "down"
    UP = "up"
    EXTENDED = "extended"

@dataclass
class PoseLandmark:
    """Represents a pose landmark with x, y coordinates and visibility"""
    x: float
    y: float
    visibility: float = 1.0

class AngleCalculator:
    """Utility class for calculating angles between pose landmarks"""
    
    @staticmethod
    def calculate_angle(point1: PoseLandmark, point2: PoseLandmark, point3: PoseLandmark) -> float:
        """
        Calculate angle between three points
        
        Args:
            point1: First point
            point2: Vertex point
            point3: Third point
            
        Returns:
            Angle in degrees
        """
        # Convert to numpy arrays
        a = np.array([point1.x, point1.y])
        b = np.array([point2.x, point2.y])
        c = np.array([point3.x, point3.y])
        
        # Calculate vectors
        ba = a - b
        bc = c - b
        
        # Calculate angle
        cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
        angle = np.arccos(np.clip(cosine_angle, -1.0, 1.0))
        
        return np.degrees(angle)
    
    @staticmethod
    def calculate_distance(point1: PoseLandmark, point2: PoseLandmark) -> float:
        """Calculate Euclidean distance between two points"""
        return math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2)

class PostureAnalyzer:
    """Analyzes posture quality for different exercises"""
    
    def __init__(self, exercise_type: ExerciseType):
        self.exercise_type = exercise_type
    
    def analyze_squat_posture(self, landmarks: Dict[str, PoseLandmark]) -> Dict[str, any]:
        """Analyze squat posture quality"""
        errors = []
        score = 100
        
        # Check if required landmarks are visible
        required_landmarks = ['left_hip', 'left_knee', 'left_ankle', 'left_shoulder']
        if not all(landmarks.get(lm) and landmarks[lm].visibility > 0.5 for lm in required_landmarks):
            return {'score': 0, 'errors': ['Pose not clearly visible']}
        
        # Calculate knee angle
        knee_angle = AngleCalculator.calculate_angle(
            landmarks['left_hip'],
            landmarks['left_knee'], 
            landmarks['left_ankle']
        )
        
        # Check knee alignment
        if knee_angle < 70:  # Too deep
            errors.append("Squat too deep")
            score -= 10
        elif knee_angle > 160:  # Not deep enough
            errors.append("Squat not deep enough")
            score -= 15
        
        # Check back straightness (simplified)
        back_angle = AngleCalculator.calculate_angle(
            landmarks['left_shoulder'],
            landmarks['left_hip'],
            landmarks['left_knee']
        )
        
        if back_angle < 160:  # Back too bent
            errors.append("Back bent forward")
            score -= 20
        
        return {
            'score': max(0, score),
            'errors': errors,
            'knee_angle': knee_angle,
            'back_angle': back_angle
        }
    
    def analyze_pushup_posture(self, landmarks: Dict[str, PoseLandmark]) -> Dict[str, any]:
        """Analyze push-up posture quality"""
        errors = []
        score = 100
        
        required_landmarks = ['left_shoulder', 'left_elbow', 'left_wrist', 'left_hip']
        if not all(landmarks.get(lm) and landmarks[lm].visibility > 0.5 for lm in required_landmarks):
            return {'score': 0, 'errors': ['Pose not clearly visible']}
        
        # Calculate elbow angle
        elbow_angle = AngleCalculator.calculate_angle(
            landmarks['left_shoulder'],
            landmarks['left_elbow'],
            landmarks['left_wrist']
        )
        
        # Check elbow position
        if elbow_angle > 170:  # Arms too straight (not lowered enough)
            errors.append("Lower chest closer to ground")
            score -= 15
        elif elbow_angle < 45:  # Too low
            errors.append("Chest too close to ground")
            score -= 10
        
        # Check body alignment
        body_angle = AngleCalculator.calculate_angle(
            landmarks['left_shoulder'],
            landmarks['left_hip'],
            landmarks['left_knee'] if 'left_knee' in landmarks else landmarks['left_hip']
        )
        
        if body_angle < 160:  # Body not straight
            errors.append("Keep body in straight line")
            score -= 20
        
        return {
            'score': max(0, score),
            'errors': errors,
            'elbow_angle': elbow_angle,
            'body_angle': body_angle
        }

class RepCounter:
    """Main repetition counter class"""
    
    def __init__(self, exercise_type: str, confidence_threshold: float = 0.7):
        self.exercise_type = ExerciseType(exercise_type)
        self.confidence_threshold = confidence_threshold
        self.rep_count = 0
        self.current_phase = ExercisePhase.NEUTRAL
        self.phase_history = []
        self.posture_analyzer = PostureAnalyzer(self.exercise_type)
        
        # Exercise-specific thresholds
        self.thresholds = self._get_exercise_thresholds()
        
    def _get_exercise_thresholds(self) -> Dict[str, any]:
        """Get exercise-specific angle thresholds"""
        thresholds = {
            ExerciseType.SQUAT: {
                'down_threshold': 110,    # Knee angle for down phase
                'up_threshold': 160,      # Knee angle for up phase
                'min_hold_frames': 3      # Minimum frames to hold position
            },
            ExerciseType.PUSHUP: {
                'down_threshold': 90,     # Elbow angle for down phase
                'up_threshold': 160,      # Elbow angle for up phase
                'min_hold_frames': 2
            },
            ExerciseType.JUMP: {
                'up_threshold': 0.1,      # Vertical displacement threshold
                'down_threshold': -0.05,  # Landing threshold
                'min_hold_frames': 2
            }
        }
        return thresholds.get(self.exercise_type, {})
    
    def _mediapipe_to_landmarks(self, mp_landmarks) -> Dict[str, PoseLandmark]:
        """Convert MediaPipe landmarks to our format"""
        landmark_names = [
            'nose', 'left_eye_inner', 'left_eye', 'left_eye_outer',
            'right_eye_inner', 'right_eye', 'right_eye_outer',
            'left_ear', 'right_ear', 'mouth_left', 'mouth_right',
            'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
            'left_wrist', 'right_wrist', 'left_pinky', 'right_pinky',
            'left_index', 'right_index', 'left_thumb', 'right_thumb',
            'left_hip', 'right_hip', 'left_knee', 'right_knee',
            'left_ankle', 'right_ankle', 'left_heel', 'right_heel',
            'left_foot_index', 'right_foot_index'
        ]
        
        landmarks = {}
        if mp_landmarks and mp_landmarks.landmark:
            for i, landmark in enumerate(mp_landmarks.landmark):
                if i < len(landmark_names):
                    landmarks[landmark_names[i]] = PoseLandmark(
                        x=landmark.x,
                        y=landmark.y,
                        visibility=landmark.visibility
                    )
        
        return landmarks
    
    def update(self, mp_landmarks) -> Tuple[int, str, Dict[str, any]]:
        """
        Update rep counter with new pose landmarks
        
        Args:
            mp_landmarks: MediaPipe pose landmarks
            
        Returns:
            Tuple of (rep_count, current_phase, analysis_results)
        """
        landmarks = self._mediapipe_to_landmarks(mp_landmarks)
        
        if not landmarks:
            return self.rep_count, self.current_phase.value, {}
        
        # Exercise-specific rep counting
        if self.exercise_type == ExerciseType.SQUAT:
            return self._count_squats(landmarks)
        elif self.exercise_type == ExerciseType.PUSHUP:
            return self._count_pushups(landmarks)
        elif self.exercise_type == ExerciseType.JUMP:
            return self._count_jumps(landmarks)
        else:
            return self.rep_count, self.current_phase.value, {}
    
    def _count_squats(self, landmarks: Dict[str, PoseLandmark]) -> Tuple[int, str, Dict[str, any]]:
        """Count squat repetitions"""
        analysis = self.posture_analyzer.analyze_squat_posture(landmarks)
        
        if 'knee_angle' not in analysis:
            return self.rep_count, self.current_phase.value, analysis
        
        knee_angle = analysis['knee_angle']
        
        # State machine for squat counting
        if self.current_phase == ExercisePhase.NEUTRAL:
            if knee_angle < self.thresholds['down_threshold']:
                self.current_phase = ExercisePhase.DOWN
                
        elif self.current_phase == ExercisePhase.DOWN:
            if knee_angle > self.thresholds['up_threshold']:
                self.current_phase = ExercisePhase.UP
                self.rep_count += 1
                
        elif self.current_phase == ExercisePhase.UP:
            if knee_angle > self.thresholds['up_threshold']:
                self.current_phase = ExercisePhase.NEUTRAL
        
        analysis['rep_count'] = self.rep_count
        analysis['phase'] = self.current_phase.value
        
        return self.rep_count, self.current_phase.value, analysis
    
    def _count_pushups(self, landmarks: Dict[str, PoseLandmark]) -> Tuple[int, str, Dict[str, any]]:
        """Count push-up repetitions"""
        analysis = self.posture_analyzer.analyze_pushup_posture(landmarks)
        
        if 'elbow_angle' not in analysis:
            return self.rep_count, self.current_phase.value, analysis
        
        elbow_angle = analysis['elbow_angle']
        
        # State machine for push-up counting
        if self.current_phase == ExercisePhase.NEUTRAL:
            if elbow_angle < self.thresholds['down_threshold']:
                self.current_phase = ExercisePhase.DOWN
                
        elif self.current_phase == ExercisePhase.DOWN:
            if elbow_angle > self.thresholds['up_threshold']:
                self.current_phase = ExercisePhase.UP
                self.rep_count += 1
                
        elif self.current_phase == ExercisePhase.UP:
            if elbow_angle > self.thresholds['up_threshold']:
                self.current_phase = ExercisePhase.NEUTRAL
        
        analysis['rep_count'] = self.rep_count
        analysis['phase'] = self.current_phase.value
        
        return self.rep_count, self.current_phase.value, analysis
    
    def _count_jumps(self, landmarks: Dict[str, PoseLandmark]) -> Tuple[int, str, Dict[str, any]]:
        """Count jumping repetitions"""
        analysis = {'score': 100, 'errors': []}
        
        if 'left_ankle' not in landmarks or 'right_ankle' not in landmarks:
            return self.rep_count, self.current_phase.value, analysis
        
        # Calculate average ankle height (simplified jump detection)
        avg_ankle_y = (landmarks['left_ankle'].y + landmarks['right_ankle'].y) / 2
        
        # Track vertical movement (simplified)
        if not hasattr(self, 'baseline_y'):
            self.baseline_y = avg_ankle_y
        
        displacement = self.baseline_y - avg_ankle_y  # Positive when jumping up
        
        # State machine for jump counting
        if self.current_phase == ExercisePhase.NEUTRAL:
            if displacement > self.thresholds['up_threshold']:
                self.current_phase = ExercisePhase.UP
                
        elif self.current_phase == ExercisePhase.UP:
            if displacement < self.thresholds['down_threshold']:
                self.current_phase = ExercisePhase.DOWN
                self.rep_count += 1
                
        elif self.current_phase == ExercisePhase.DOWN:
            if abs(displacement) < 0.02:  # Back to neutral
                self.current_phase = ExercisePhase.NEUTRAL
        
        analysis['rep_count'] = self.rep_count
        analysis['phase'] = self.current_phase.value
        analysis['displacement'] = displacement
        
        return self.rep_count, self.current_phase.value, analysis
    
    def reset(self):
        """Reset the rep counter"""
        self.rep_count = 0
        self.current_phase = ExercisePhase.NEUTRAL
        self.phase_history = []
        if hasattr(self, 'baseline_y'):
            delattr(self, 'baseline_y')
    
    def get_statistics(self) -> Dict[str, any]:
        """Get detailed statistics about the exercise session"""
        return {
            'total_reps': self.rep_count,
            'current_phase': self.current_phase.value,
            'exercise_type': self.exercise_type.value,
            'phase_history': self.phase_history
        }

# Example usage and testing
if __name__ == "__main__":
    # Example usage
    print("Sportify Rep Counter - Example Usage")
    
    # Initialize counter for squats
    counter = RepCounter('squat')
    
    # Simulate some pose landmarks (replace with actual MediaPipe output)
    print(f"Initial state: {counter.rep_count} reps, phase: {counter.current_phase.value}")
    
    # Reset counter
    counter.reset()
    print("Counter reset successfully")
    
    print("Rep counter ready for integration with MediaPipe pose detection!")