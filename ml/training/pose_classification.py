#!/usr/bin/env python3
"""
Sportify Pose Classification Model Training Script

This script trains a CNN model to classify exercise postures (correct/incorrect)
using MediaPipe pose landmarks as input features.

Requirements:
- TensorFlow 2.x
- MediaPipe
- OpenCV
- NumPy
- Matplotlib (for visualization)

Usage:
python pose_classification.py --dataset ./data --output ./models --epochs 50
"""

import argparse
import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import json

class PoseClassificationModel:
    def __init__(self, input_shape=(33, 2), num_classes=2):
        """
        Initialize pose classification model
        
        Args:
            input_shape: Shape of pose landmarks (33 keypoints x 2 coordinates)
            num_classes: Number of classes (2 for correct/incorrect)
        """
        self.input_shape = input_shape
        self.num_classes = num_classes
        self.model = None
        self.scaler = StandardScaler()
        
    def create_model(self):
        """Create CNN model for pose classification"""
        model = keras.Sequential([
            keras.layers.Input(shape=self.input_shape),
            keras.layers.Flatten(),
            
            # Feature extraction layers
            keras.layers.Dense(256, activation='relu'),
            keras.layers.BatchNormalization(),
            keras.layers.Dropout(0.3),
            
            keras.layers.Dense(128, activation='relu'),
            keras.layers.BatchNormalization(),
            keras.layers.Dropout(0.3),
            
            keras.layers.Dense(64, activation='relu'),
            keras.layers.BatchNormalization(),
            keras.layers.Dropout(0.2),
            
            # Classification layer
            keras.layers.Dense(self.num_classes, activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy', 'precision', 'recall']
        )
        
        self.model = model
        return model
    
    def preprocess_data(self, landmarks_list, labels_list):
        """
        Preprocess pose landmarks data
        
        Args:
            landmarks_list: List of pose landmarks arrays
            labels_list: List of corresponding labels
        """
        # Convert to numpy arrays
        X = np.array(landmarks_list)
        y = np.array(labels_list)
        
        # Normalize pose landmarks
        X_flattened = X.reshape(X.shape[0], -1)
        X_normalized = self.scaler.fit_transform(X_flattened)
        X = X_normalized.reshape(X.shape)
        
        return X, y
    
    def train(self, X_train, y_train, X_val, y_val, epochs=50, batch_size=32):
        """Train the pose classification model"""
        if self.model is None:
            self.create_model()
        
        # Callbacks
        callbacks = [
            keras.callbacks.EarlyStopping(
                monitor='val_accuracy',
                patience=10,
                restore_best_weights=True
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.2,
                patience=5,
                min_lr=1e-7
            ),
            keras.callbacks.ModelCheckpoint(
                'best_pose_model.h5',
                monitor='val_accuracy',
                save_best_only=True
            )
        ]
        
        # Train model
        history = self.model.fit(
            X_train, y_train,
            batch_size=batch_size,
            epochs=epochs,
            validation_data=(X_val, y_val),
            callbacks=callbacks,
            verbose=1
        )
        
        return history
    
    def evaluate(self, X_test, y_test):
        """Evaluate model performance"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        
        loss, accuracy, precision, recall = self.model.evaluate(X_test, y_test, verbose=0)
        f1_score = 2 * (precision * recall) / (precision + recall)
        
        metrics = {
            'loss': loss,
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1_score
        }
        
        return metrics
    
    def convert_to_tflite(self, output_path):
        """Convert trained model to TensorFlow Lite format"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        
        # Convert to TensorFlow Lite
        converter = tf.lite.TFLiteConverter.from_keras_model(self.model)
        
        # Apply optimizations
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        
        # Enable quantization for mobile deployment
        converter.representative_dataset = self._representative_dataset
        converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
        converter.inference_input_type = tf.int8
        converter.inference_output_type = tf.int8
        
        tflite_model = converter.convert()
        
        # Save the model
        with open(output_path, 'wb') as f:
            f.write(tflite_model)
        
        print(f"TFLite model saved to {output_path}")
        return tflite_model
    
    def _representative_dataset(self):
        """Generate representative dataset for quantization"""
        # This should be replaced with actual representative data
        for _ in range(100):
            yield [np.random.random((1, 33, 2)).astype(np.float32)]

def load_pose_dataset(dataset_path):
    """
    Load pose dataset from directory structure:
    
    dataset_path/
    ├── correct/
    │   ├── pose_landmarks_1.json
    │   ├── pose_landmarks_2.json
    │   └── ...
    └── incorrect/
        ├── pose_landmarks_1.json
        ├── pose_landmarks_2.json
        └── ...
    """
    landmarks_list = []
    labels_list = []
    
    # Load correct postures (label 1)
    correct_path = os.path.join(dataset_path, 'correct')
    if os.path.exists(correct_path):
        for filename in os.listdir(correct_path):
            if filename.endswith('.json'):
                with open(os.path.join(correct_path, filename), 'r') as f:
                    landmarks = json.load(f)
                    landmarks_list.append(np.array(landmarks))
                    labels_list.append(1)
    
    # Load incorrect postures (label 0)
    incorrect_path = os.path.join(dataset_path, 'incorrect')
    if os.path.exists(incorrect_path):
        for filename in os.listdir(incorrect_path):
            if filename.endswith('.json'):
                with open(os.path.join(incorrect_path, filename), 'r') as f:
                    landmarks = json.load(f)
                    landmarks_list.append(np.array(landmarks))
                    labels_list.append(0)
    
    return landmarks_list, labels_list

def create_sample_dataset(output_path, num_samples_per_class=1000):
    """Create sample dataset for testing (replace with real data collection)"""
    os.makedirs(output_path, exist_ok=True)
    os.makedirs(os.path.join(output_path, 'correct'), exist_ok=True)
    os.makedirs(os.path.join(output_path, 'incorrect'), exist_ok=True)
    
    for i in range(num_samples_per_class):
        # Generate synthetic correct pose landmarks
        correct_landmarks = np.random.random((33, 2)) * 0.5 + 0.25  # Centered poses
        with open(os.path.join(output_path, 'correct', f'pose_{i}.json'), 'w') as f:
            json.dump(correct_landmarks.tolist(), f)
        
        # Generate synthetic incorrect pose landmarks (more variation)
        incorrect_landmarks = np.random.random((33, 2))  # More scattered poses
        with open(os.path.join(output_path, 'incorrect', f'pose_{i}.json'), 'w') as f:
            json.dump(incorrect_landmarks.tolist(), f)
    
    print(f"Sample dataset created at {output_path}")

def plot_training_history(history, output_path):
    """Plot training history"""
    fig, axes = plt.subplots(2, 2, figsize=(12, 8))
    
    # Accuracy
    axes[0, 0].plot(history.history['accuracy'], label='Training')
    axes[0, 0].plot(history.history['val_accuracy'], label='Validation')
    axes[0, 0].set_title('Model Accuracy')
    axes[0, 0].set_xlabel('Epoch')
    axes[0, 0].set_ylabel('Accuracy')
    axes[0, 0].legend()
    
    # Loss
    axes[0, 1].plot(history.history['loss'], label='Training')
    axes[0, 1].plot(history.history['val_loss'], label='Validation')
    axes[0, 1].set_title('Model Loss')
    axes[0, 1].set_xlabel('Epoch')
    axes[0, 1].set_ylabel('Loss')
    axes[0, 1].legend()
    
    # Precision
    axes[1, 0].plot(history.history['precision'], label='Training')
    axes[1, 0].plot(history.history['val_precision'], label='Validation')
    axes[1, 0].set_title('Model Precision')
    axes[1, 0].set_xlabel('Epoch')
    axes[1, 0].set_ylabel('Precision')
    axes[1, 0].legend()
    
    # Recall
    axes[1, 1].plot(history.history['recall'], label='Training')
    axes[1, 1].plot(history.history['val_recall'], label='Validation')
    axes[1, 1].set_title('Model Recall')
    axes[1, 1].set_xlabel('Epoch')
    axes[1, 1].set_ylabel('Recall')
    axes[1, 1].legend()
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_path, 'training_history.png'))
    plt.show()

def main():
    parser = argparse.ArgumentParser(description='Train Sportify pose classification model')
    parser.add_argument('--dataset', default='./data', help='Path to dataset directory')
    parser.add_argument('--output', default='./models', help='Output directory for models')
    parser.add_argument('--epochs', type=int, default=50, help='Number of training epochs')
    parser.add_argument('--batch-size', type=int, default=32, help='Batch size')
    parser.add_argument('--create-sample', action='store_true', help='Create sample dataset')
    
    args = parser.parse_args()
    
    # Create output directory
    os.makedirs(args.output, exist_ok=True)
    
    # Create sample dataset if requested
    if args.create_sample:
        create_sample_dataset(args.dataset)
        print("Sample dataset created. Replace with real pose data for production.")
    
    # Load dataset
    print("Loading dataset...")
    landmarks_list, labels_list = load_pose_dataset(args.dataset)
    
    if len(landmarks_list) == 0:
        print("No data found. Please check dataset path or use --create-sample flag.")
        return
    
    print(f"Loaded {len(landmarks_list)} samples")
    
    # Initialize model
    model = PoseClassificationModel()
    
    # Preprocess data
    print("Preprocessing data...")
    X, y = model.preprocess_data(landmarks_list, labels_list)
    
    # Split data
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
    
    print(f"Training samples: {len(X_train)}")
    print(f"Validation samples: {len(X_val)}")
    print(f"Test samples: {len(X_test)}")
    
    # Train model
    print("Training model...")
    history = model.train(X_train, y_train, X_val, y_val, epochs=args.epochs, batch_size=args.batch_size)
    
    # Evaluate model
    print("Evaluating model...")
    metrics = model.evaluate(X_test, y_test)
    print(f"Test Metrics: {metrics}")
    
    # Save model
    model_path = os.path.join(args.output, 'pose_classification_model.h5')
    model.model.save(model_path)
    print(f"Model saved to {model_path}")
    
    # Convert to TensorFlow Lite
    tflite_path = os.path.join(args.output, 'pose_classification_model.tflite')
    model.convert_to_tflite(tflite_path)
    
    # Save metrics
    metrics_path = os.path.join(args.output, 'metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=2)
    
    # Plot training history
    plot_training_history(history, args.output)
    
    print("Training completed successfully!")

if __name__ == "__main__":
    main()