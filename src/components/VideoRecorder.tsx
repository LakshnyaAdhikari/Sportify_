import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Square, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  Target,
  Timer,
  Zap
} from "lucide-react";

interface VideoRecorderProps {
  testType: "squat" | "pushup" | "jump";
  onComplete: (results: TestResults) => void;
  onCancel: () => void;
}

interface TestResults {
  repCount: number;
  score: number;
  postureErrors: Array<{
    frame: number;
    type: string;
    severity: "low" | "medium" | "high";
  }>;
  cheatFlags: string[];
  duration: number;
  videoBlob?: Blob;
}

const VideoRecorder = ({ testType, onComplete, onCancel }: VideoRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [duration, setDuration] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"setup" | "countdown" | "recording" | "analyzing" | "results">("setup");
  
  // ML Analysis state
  const [repCount, setRepCount] = useState(0);
  const [currentPose, setCurrentPose] = useState<"neutral" | "down" | "up">("neutral");
  const [postureScore, setPostureScore] = useState(100);
  const [poseConfidence, setPoseConfidence] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const testConfig = {
    squat: {
      name: "स्क्वाट टेस्ट",
      duration: 120,
      targetReps: 20,
      instructions: "Stand with feet shoulder-width apart. Lower into squat position keeping back straight.",
      poseKeypoints: ["hip", "knee", "ankle"],
      icon: "🏋️"
    },
    pushup: {
      name: "पुश-अप चुनौती", 
      duration: 180,
      targetReps: 15,
      instructions: "Start in plank position. Lower chest to ground, push back up.",
      poseKeypoints: ["shoulder", "elbow", "wrist"],
      icon: "💪"
    },
    jump: {
      name: "जंप पावर टेस्ट",
      duration: 60,
      targetReps: 10,
      instructions: "Jump as high as possible with both feet leaving ground.",
      poseKeypoints: ["hip", "knee", "ankle"],
      icon: "🚀"
    }
  };

  const currentTest = testConfig[testType];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => {
          if (prev >= currentTest.duration) {
            handleStopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused, currentTest.duration]);

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showCountdown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setShowCountdown(false);
            startRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showCountdown, countdown]);

  // Mock pose detection - Replace with actual MediaPipe integration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        // Simulate pose detection
        const confidence = Math.random() * 100;
        setPoseConfidence(confidence);
        
        if (confidence > 70) {
          // Simulate rep counting logic
          const phases = ["neutral", "down", "up"] as const;
          const newPhase = phases[Math.floor(Math.random() * phases.length)];
          
          if (currentPose === "down" && newPhase === "up") {
            setRepCount(prev => prev + 1);
          }
          setCurrentPose(newPhase);
          
          // Simulate posture scoring
          const newScore = Math.max(60, confidence + Math.random() * 20);
          setPostureScore(Math.round(newScore));
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isRecording, currentPose]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setCurrentPhase("setup");
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    setShowCountdown(true);
    setCurrentPhase("countdown");
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.start();
    setIsRecording(true);
    setCurrentPhase("recording");
    setDuration(0);
    setRepCount(0);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setCurrentPhase("analyzing");
    
    // Simulate analysis delay
    setTimeout(() => {
      const results: TestResults = {
        repCount,
        score: Math.round((repCount / currentTest.targetReps) * postureScore),
        postureErrors: [
          { frame: 45, type: "Back Bent", severity: "medium" },
          { frame: 78, type: "Incomplete Range", severity: "low" }
        ],
        cheatFlags: repCount > currentTest.targetReps * 1.5 ? ["Suspicious Rep Count"] : [],
        duration,
        videoBlob: new Blob() // Mock blob
      };
      
      setCurrentPhase("results");
      onComplete(results);
    }, 2000);
  };

  const handleReset = () => {
    setIsRecording(false);
    setIsPaused(false);
    setDuration(0);
    setRepCount(0);
    setCurrentPhase("setup");
    setPostureScore(100);
  };

  useEffect(() => {
    initializeCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/10 via-white to-india-green/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{currentTest.icon}</div>
            <div>
              <h1 className="text-athletic-lg text-neutral-dark">{currentTest.name}</h1>
              <p className="text-saffron font-medium">AI-Powered Performance Analysis</p>
            </div>
          </div>
          
          <Button variant="outline-athletic" onClick={onCancel}>
            Cancel Test
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <Card className="border-saffron/20 overflow-hidden shadow-[var(--shadow-athletic)]">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-neutral-dark">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Pose Overlay Canvas */}
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />
                  
                  {/* Countdown Overlay */}
                  {showCountdown && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-8xl font-bold mb-4 animate-bounce-athletic">
                          {countdown}
                        </div>
                        <p className="text-xl">Get Ready!</p>
                      </div>
                    </div>
                  )}

                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                        REC {formatTime(duration)}
                      </span>
                    </div>
                  )}

                  {/* Pose Guide Overlay */}
                  {currentPhase === "recording" && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="h-4 w-4" />
                          Pose: {currentPose}
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Confidence: {Math.round(poseConfidence)}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Control Bar */}
                <div className="p-4 bg-white border-t border-saffron/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {currentPhase === "setup" && (
                        <Button variant="hero" size="lg" onClick={startCountdown}>
                          <Camera className="h-5 w-5 mr-2" />
                          Start Test
                        </Button>
                      )}
                      
                      {currentPhase === "recording" && (
                        <>
                          <Button variant="destructive" size="lg" onClick={handleStopRecording}>
                            <Square className="h-5 w-5 mr-2" />
                            Stop Recording
                          </Button>
                          <Button variant="outline-athletic" size="lg" onClick={() => setIsPaused(!isPaused)}>
                            <Play className="h-5 w-5 mr-2" />
                            {isPaused ? "Resume" : "Pause"}
                          </Button>
                        </>
                      )}
                      
                      <Button variant="outline-athletic" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>

                    {/* Progress */}
                    {isRecording && (
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-neutral-dark">
                            {formatTime(duration)} / {formatTime(currentTest.duration)}
                          </p>
                          <Progress 
                            value={(duration / currentTest.duration) * 100} 
                            className="w-32 h-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Instructions */}
          <div className="space-y-6">
            {/* Instructions */}
            <Card className="border-india-green/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-neutral-dark mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-india-green" />
                  Instructions
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {currentTest.instructions}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Target Reps:</span>
                    <span className="text-sm font-medium text-neutral-dark">{currentTest.targetReps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duration:</span>
                    <span className="text-sm font-medium text-neutral-dark">{formatTime(currentTest.duration)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Stats */}
            {isRecording && (
              <Card className="border-saffron/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-neutral-dark mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-saffron" />
                    Live Analysis
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-saffron mb-1">{repCount}</div>
                      <p className="text-sm text-muted-foreground">Reps Completed</p>
                      <Progress value={(repCount / currentTest.targetReps) * 100} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-india-green mb-1">{postureScore}%</div>
                        <p className="text-xs text-muted-foreground">Posture Score</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-india-blue mb-1">{Math.round(poseConfidence)}%</div>
                        <p className="text-xs text-muted-foreground">Detection</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      {poseConfidence > 70 ? (
                        <Badge className="bg-india-green text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Good Detection
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Adjust Position
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Status */}
            {currentPhase === "analyzing" && (
              <Card className="border-india-blue/20">
                <CardContent className="p-6 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-india-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-neutral-dark mb-2">Analyzing Performance...</h3>
                  <p className="text-sm text-muted-foreground">
                    AI is processing your movements and calculating results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;