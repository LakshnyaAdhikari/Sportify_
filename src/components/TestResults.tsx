import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  Share2, 
  RotateCcw, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Star,
  Timer,
  Zap,
  Award,
  BarChart3
} from "lucide-react";

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

interface TestResultsProps {
  results: TestResults;
  testType: "squat" | "pushup" | "jump";
  onRetry: () => void;
  onShare: () => void;
  onNext: () => void;
}

const TestResults = ({ results, testType, onRetry, onShare, onNext }: TestResultsProps) => {
  const testConfig = {
    squat: {
      name: "स्क्वाट टेस्ट",
      targetReps: 20,
      maxScore: 100,
      icon: "🏋️"
    },
    pushup: {
      name: "पुश-अप चुनौती", 
      targetReps: 15,
      maxScore: 100,
      icon: "💪"
    },
    jump: {
      name: "जंप पावर टेस्ट",
      targetReps: 10,
      maxScore: 100,
      icon: "🚀"
    }
  };

  const currentTest = testConfig[testType];
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-india-green";
    if (score >= 70) return "text-saffron";
    return "text-destructive";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return { message: "Outstanding Performance! 🏆", subtitle: "आपका प्रदर्शन शानदार है!" };
    if (score >= 80) return { message: "Excellent Work! ⭐", subtitle: "बहुत बढ़िया काम!" };
    if (score >= 70) return { message: "Good Job! 👍", subtitle: "अच्छा काम!" };
    if (score >= 60) return { message: "Keep Practicing! 💪", subtitle: "अभ्यास जारी रखें!" };
    return { message: "Room for Improvement", subtitle: "सुधार की गुंजाइश है" };
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: "Elite", color: "bg-india-green", icon: Trophy };
    if (score >= 80) return { level: "Advanced", color: "bg-saffron", icon: Star };
    if (score >= 70) return { level: "Intermediate", color: "bg-india-blue", icon: Target };
    return { level: "Beginner", color: "bg-gray-400", icon: Zap };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scoreMessage = getScoreMessage(results.score);
  const performanceLevel = getPerformanceLevel(results.score);
  const PerformanceIcon = performanceLevel.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/10 via-white to-india-green/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-athletic">{currentTest.icon}</div>
          <h1 className="text-athletic-lg text-neutral-dark mb-2">
            {currentTest.name} Results
          </h1>
          <p className="text-saffron font-medium">AI Performance Analysis Complete</p>
        </div>

        {/* Main Score Card */}
        <Card className="border-saffron/20 shadow-[var(--shadow-athletic)] mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className={`text-8xl font-bold mb-4 ${getScoreColor(results.score)} animate-pulse-glow`}>
                {results.score}
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <PerformanceIcon className="h-6 w-6 text-neutral-dark" />
                <Badge className={`${performanceLevel.color} text-white text-lg px-4 py-2`}>
                  {performanceLevel.level} Level
                </Badge>
              </div>
              <h2 className="text-athletic-md text-neutral-dark mb-2">
                {scoreMessage.message}
              </h2>
              <p className="text-lg text-saffron font-medium">
                {scoreMessage.subtitle}
              </p>
            </div>

            {/* Performance Breakdown */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-3">
                  <Target className="h-8 w-8 text-saffron" />
                </div>
                <div className="text-3xl font-bold text-neutral-dark mb-1">{results.repCount}</div>
                <p className="text-sm text-muted-foreground mb-2">Reps Completed</p>
                <Progress 
                  value={(results.repCount / currentTest.targetReps) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {currentTest.targetReps}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-india-green/10 flex items-center justify-center mx-auto mb-3">
                  <Timer className="h-8 w-8 text-india-green" />
                </div>
                <div className="text-3xl font-bold text-neutral-dark mb-1">{formatTime(results.duration)}</div>
                <p className="text-sm text-muted-foreground mb-2">Duration</p>
                <div className="text-xs text-muted-foreground">
                  Pace: {results.repCount > 0 ? Math.round(results.duration / results.repCount) : 0}s per rep
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-india-blue/10 flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-8 w-8 text-india-blue" />
                </div>
                <div className="text-3xl font-bold text-neutral-dark mb-1">
                  {100 - results.postureErrors.length * 5}%
                </div>
                <p className="text-sm text-muted-foreground mb-2">Form Accuracy</p>
                <div className="text-xs text-muted-foreground">
                  {results.postureErrors.length} corrections needed
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" onClick={onShare} className="gap-2">
                <Share2 className="h-5 w-5" />
                Share Achievement
              </Button>
              <Button variant="outline-athletic" size="xl" onClick={onRetry} className="gap-2">
                <RotateCcw className="h-5 w-5" />
                Try Again
              </Button>
              <Button variant="athletic" size="xl" onClick={onNext} className="gap-2">
                <Trophy className="h-5 w-5" />
                Next Challenge
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Detailed Analysis */}
          <Card className="border-india-green/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-neutral-dark">
                <BarChart3 className="h-5 w-5 text-india-green" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rep Accuracy</span>
                  <span className="font-medium text-neutral-dark">
                    {Math.round((results.repCount / currentTest.targetReps) * 100)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Form Quality</span>
                  <span className="font-medium text-neutral-dark">
                    {100 - results.postureErrors.length * 5}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Consistency</span>
                  <span className="font-medium text-neutral-dark">
                    {results.repCount > 5 ? "Good" : "Needs Work"}
                  </span>
                </div>

                <div className="pt-4 border-t border-neutral-gray">
                  <h4 className="font-medium text-neutral-dark mb-3">Strengths</h4>
                  <div className="space-y-2">
                    {results.score >= 80 && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-india-green" />
                        <span>Excellent rep count</span>
                      </div>
                    )}
                    {results.postureErrors.length <= 2 && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-india-green" />
                        <span>Good form maintenance</span>
                      </div>
                    )}
                    {results.cheatFlags.length === 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-india-green" />
                        <span>Authentic performance</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card className="border-saffron/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-neutral-dark">
                <TrendingUp className="h-5 w-5 text-saffron" />
                Improvement Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.postureErrors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-neutral-dark mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-saffron" />
                      Form Corrections
                    </h4>
                    <div className="space-y-2">
                      {results.postureErrors.slice(0, 3).map((error, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-saffron/5 rounded-lg">
                          <span className="text-sm text-neutral-dark">{error.type}</span>
                          <Badge 
                            variant={error.severity === "high" ? "destructive" : error.severity === "medium" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {error.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.cheatFlags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-neutral-dark mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Flagged Issues
                    </h4>
                    <div className="space-y-2">
                      {results.cheatFlags.map((flag, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Training Tips */}
                <div className="pt-4 border-t border-neutral-gray">
                  <h4 className="font-medium text-neutral-dark mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-india-blue" />
                    Training Tips
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {testType === "squat" && (
                      <>
                        <p>• Keep your chest up and core engaged</p>
                        <p>• Lower until thighs are parallel to ground</p>
                        <p>• Drive through heels on the way up</p>
                      </>
                    )}
                    {testType === "pushup" && (
                      <>
                        <p>• Maintain straight line from head to heels</p>
                        <p>• Lower chest to just above ground</p>
                        <p>• Keep elbows at 45-degree angle</p>
                      </>
                    )}
                    {testType === "jump" && (
                      <>
                        <p>• Use arms to generate upward momentum</p>
                        <p>• Land softly on balls of feet</p>
                        <p>• Focus on explosive power</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestResults;