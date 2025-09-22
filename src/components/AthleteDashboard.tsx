import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Trophy, 
  Target, 
  Play, 
  Camera, 
  TrendingUp, 
  Award, 
  Users, 
  MapPin,
  Zap,
  Star,
  Clock,
  BarChart3,
  Activity,
  Calendar,
  Settings,
  Bell,
  ChevronRight,
  Flame,
  Gift
} from "lucide-react";
import SportifyHeader from "./SportifyHeader";
import VideoRecorder from "./VideoRecorder";
import TestResults from "./TestResults";

interface AthleteData {
  name: string;
  district: string;
  state: string;
  totalTests: number;
  bestScore: number;
  weeklyProgress: number;
  rank: {
    district: number;
    national: number;
  };
  badges: string[];
  recentActivities: Array<{
    test: string;
    score: number;
    date: string;
    improvement: number;
  }>;
}

interface AthleteDashboardProps {
  athlete: AthleteData;
  onStartTest: () => void;
  onViewProgress: () => void;
  onViewLeaderboard: () => void;
}

const AthleteDashboard = ({ athlete, onStartTest, onViewProgress, onViewLeaderboard }: AthleteDashboardProps) => {
  const [selectedSport, setSelectedSport] = useState("general");
  const [currentView, setCurrentView] = useState<"dashboard" | "test" | "results">("dashboard");
  const [selectedTest, setSelectedTest] = useState<"squat" | "pushup" | "jump" | null>(null);
  const [testResults, setTestResults] = useState(null);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(5);
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 3, target: 5 });
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New district leaderboard update!", time: "2 min ago", unread: true },
    { id: 2, message: "Achievement unlocked: Consistency Star!", time: "1 hour ago", unread: true },
  ]);

  // Enhanced test data with more details
  const recommendedTests = [
    {
      id: "squat",
      name: "स्क्वाट टेस्ट",
      description: "Lower body strength & endurance",
      difficulty: "beginner",
      duration: "2 min",
      points: 50,
      icon: "🏋️",
      targetReps: 20,
      lastScore: 78,
      improvement: "+12%",
      completed: true
    },
    {
      id: "pushup",
      name: "पुश-अप चुनौती",
      description: "Upper body strength assessment",
      difficulty: "intermediate", 
      duration: "3 min",
      points: 75,
      icon: "💪",
      targetReps: 15,
      lastScore: 82,
      improvement: "+8%",
      completed: true
    },
    {
      id: "jump",
      name: "जंप पावर टेस्ट",
      description: "Explosive power & agility",
      difficulty: "advanced",
      duration: "1 min", 
      points: 100,
      icon: "🚀",
      targetReps: 10,
      lastScore: null,
      improvement: null,
      completed: false
    }
  ];

  const todaysSuggestion = recommendedTests.find(test => !test.completed) || recommendedTests[0];

  const achievements = [
    { name: "First Steps", description: "पहला टेस्ट complete किया", earned: true, progress: 100 },
    { name: "Consistency Star", description: "7 दिन लगातार practice", earned: true, progress: 100 },
    { name: "District Champion", description: "District top 10 में जगह", earned: false, progress: 60 },
    { name: "Perfect Form", description: "100% posture accuracy", earned: false, progress: 25 },
    { name: "Speed Demon", description: "10 tests in one week", earned: false, progress: 70 }
  ];

  // Enhanced data with more realistic progression
  const enhancedAthlete = {
    ...athlete,
    thisWeekTests: 3,
    thisWeekImprovement: 18,
    currentStreak: dailyStreak,
    weeklyGoal: weeklyGoal,
    recentActivities: [
      { test: "Squat Test", score: 78, date: "Today", improvement: 12, reps: 18 },
      { test: "Push-up Challenge", score: 82, date: "Yesterday", improvement: 8, reps: 14 },
      { test: "Jump Power", score: 65, date: "2 days ago", improvement: -3, reps: 8 },
    ]
  };

  const handleStartTest = (testType: "squat" | "pushup" | "jump") => {
    setSelectedTest(testType);
    setCurrentView("test");
  };

  const handleTestComplete = (results: any) => {
    setTestResults(results);
    setCurrentView("results");
    // Update athlete stats here
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedTest(null);
    setTestResults(null);
  };

  // Render different views
  if (currentView === "test" && selectedTest) {
    return (
      <VideoRecorder
        testType={selectedTest}
        onComplete={handleTestComplete}
        onCancel={handleBackToDashboard}
      />
    );
  }

  if (currentView === "results" && testResults) {
    return (
      <TestResults
        results={testResults}
        testType={selectedTest!}
        onRetry={() => setCurrentView("test")}
        onShare={() => console.log("Sharing results...")}
        onNext={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/5 via-white to-india-green/5">
      <SportifyHeader 
        userName={athlete.name.split(' ')[0]} 
        showNotifications={true}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section with Today's Suggestion */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-saffron to-india-green p-8 text-white shadow-[var(--shadow-athletic)]">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-athletic-lg">
                    नमस्ते, {enhancedAthlete.name.split(' ')[0]}! 
                  </h1>
                  <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
                    <Flame className="h-4 w-4" />
                    {enhancedAthlete.currentStreak} day streak
                  </div>
                </div>
                <p className="text-white/90 mb-3">
                  Ready to crush today's challenge?
                </p>
                <div className="flex items-center gap-4 text-sm text-white/80 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {enhancedAthlete.district}, {enhancedAthlete.state}
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    District Rank #{enhancedAthlete.rank.district}
                  </div>
                </div>
                
                {/* Today's Suggestion */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{todaysSuggestion.icon}</div>
                      <div>
                        <p className="font-semibold">Today's Challenge</p>
                        <p className="text-sm text-white/80">{todaysSuggestion.name}</p>
                      </div>
                    </div>
                    <Button 
                      variant="floating" 
                      size="sm"
                      onClick={() => handleStartTest(todaysSuggestion.id as "squat" | "pushup" | "jump")}
                      className="gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:items-end gap-3">
                <Button 
                  variant="floating" 
                  size="lg" 
                  onClick={() => handleStartTest("squat")}
                  className="gap-2 animate-pulse-glow"
                >
                  <Camera className="h-5 w-5" />
                  Record New Test
                </Button>
                <div className="text-center md:text-right">
                  <p className="text-xs text-white/70">
                    AI powered pose analysis ready!
                  </p>
                  <div className="flex items-center gap-1 justify-center md:justify-end mt-1">
                    <Activity className="h-3 w-3" />
                    <span className="text-xs">MediaPipe AI Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <div className="flex h-full items-center justify-center">
              <div className="text-8xl animate-float">{todaysSuggestion.icon}</div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-saffron/20 hover:shadow-[var(--shadow-saffron)] transition-all cursor-pointer" onClick={() => setShowProgressModal(true)}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-2">
                <Target className="h-6 w-6 text-saffron" />
              </div>
              <p className="text-2xl font-bold text-neutral-dark">{enhancedAthlete.totalTests}</p>
              <p className="text-xs text-muted-foreground">Tests Completed</p>
              <div className="mt-1 text-xs text-saffron font-medium">
                +{enhancedAthlete.thisWeekTests} this week
              </div>
            </CardContent>
          </Card>

          <Card className="border-india-green/20 hover:shadow-[var(--shadow-green)] transition-all cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-india-green/10 flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-india-green" />
              </div>
              <p className="text-2xl font-bold text-neutral-dark">{enhancedAthlete.bestScore}</p>
              <p className="text-xs text-muted-foreground">Personal Best</p>
              <div className="mt-1 text-xs text-india-green font-medium">
                +{enhancedAthlete.thisWeekImprovement}% improvement
              </div>
            </CardContent>
          </Card>

          <Card className="border-india-blue/20 hover:shadow-[var(--shadow-athletic)] transition-all cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-india-blue/10 flex items-center justify-center mx-auto mb-2">
                <Flame className="h-6 w-6 text-india-blue" />
              </div>
              <p className="text-2xl font-bold text-neutral-dark">{enhancedAthlete.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
              <div className="mt-1 text-xs text-india-blue font-medium">
                Keep it going! 🔥
              </div>
            </CardContent>
          </Card>

          <Card className="border-saffron/20 hover:shadow-[var(--shadow-saffron)] transition-all cursor-pointer" onClick={() => setShowLeaderboardModal(true)}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6 text-saffron" />
              </div>
              <p className="text-2xl font-bold text-neutral-dark">#{enhancedAthlete.rank.national}</p>
              <p className="text-xs text-muted-foreground">National Rank</p>
              <div className="mt-1 text-xs text-saffron font-medium">
                #{enhancedAthlete.rank.district} in district
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recommended Tests */}
          <div className="lg:col-span-2">
            <Card className="border-saffron/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-neutral-dark">
                  <Zap className="h-5 w-5 text-saffron" />
                  आज के लिए Recommended Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedTests.map((test) => (
                  <div 
                    key={test.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-neutral-gray hover:bg-saffron/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <div className="text-2xl">{test.icon}</div>
                        {test.completed && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-india-green rounded-full flex items-center justify-center">
                            <Star className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-neutral-dark">{test.name}</h3>
                          {test.improvement && (
                            <span className="text-xs text-india-green font-medium bg-india-green/10 px-2 py-0.5 rounded-full">
                              {test.improvement}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={test.difficulty === 'beginner' ? 'secondary' : test.difficulty === 'intermediate' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {test.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {test.duration}
                          </span>
                          <span className="text-xs text-saffron font-medium">+{test.points} pts</span>
                          {test.lastScore && (
                            <span className="text-xs text-neutral-dark font-medium">
                              Last: {test.lastScore}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant={test.completed ? "athletic" : "hero"} 
                        size="sm" 
                        onClick={() => handleStartTest(test.id as "squat" | "pushup" | "jump")}
                        className="group-hover:scale-105 transition-transform"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        {test.completed ? "Retry" : "Start"}
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-saffron transition-colors" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Progress & Achievements */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <Card className="border-india-green/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-neutral-dark">
                  <BarChart3 className="h-5 w-5 text-india-green" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Overall</span>
                      <span className="text-sm font-medium text-india-green">+{athlete.weeklyProgress}%</span>
                    </div>
                    <Progress value={athlete.weeklyProgress} className="h-2" />
                  </div>
                  
                  <Button variant="athletic" size="sm" onClick={() => setShowProgressModal(true)} className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Detailed Progress
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-saffron/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-neutral-dark">
                  <Award className="h-5 w-5 text-saffron" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.slice(0, 4).map((achievement, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:scale-[1.02] ${
                        achievement.earned 
                          ? 'bg-saffron/10 border-saffron/20' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.earned ? 'bg-saffron text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {achievement.earned ? <Trophy className="h-5 w-5" /> : 
                         achievement.progress > 50 ? <Gift className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium ${
                            achievement.earned ? 'text-neutral-dark' : 'text-gray-600'
                          }`}>
                            {achievement.name}
                          </p>
                          {!achievement.earned && (
                            <span className="text-xs text-muted-foreground">{achievement.progress}%</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        {!achievement.earned && (
                          <Progress value={achievement.progress} className="h-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button variant="champion" size="lg" onClick={() => setShowLeaderboardModal(true)} className="w-full">
                <Users className="h-5 w-5 mr-2" />
                View Leaderboards
              </Button>
              <Button variant="outline-athletic" size="lg" className="w-full">
                <Target className="h-5 w-5 mr-2" />
                Training Tips
              </Button>
              <Button variant="outline-athletic" size="lg" className="w-full">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Session
              </Button>
            </div>
          </div>
        </div>

        {/* Leaderboard Modal */}
        <Dialog open={showLeaderboardModal} onOpenChange={setShowLeaderboardModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-saffron" />
                District Leaderboard
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {[
                { rank: 1, name: "Arjun Sharma", score: 95, district: "Jaipur" },
                { rank: 2, name: "Priya Patel", score: 92, district: "Jaipur" },
                { rank: 3, name: enhancedAthlete.name, score: enhancedAthlete.bestScore, district: enhancedAthlete.district, isUser: true },
                { rank: 4, name: "Rahul Singh", score: 85, district: "Jaipur" },
                { rank: 5, name: "Sneha Gupta", score: 83, district: "Jaipur" },
              ].map((entry) => (
                <div 
                  key={entry.rank} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.isUser ? 'bg-saffron/10 border border-saffron/20' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                      entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
                      entry.rank === 3 ? 'bg-orange-400 text-orange-900' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {entry.rank}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-dark">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">{entry.district}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-dark">{entry.score}</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Progress Modal */}
        <Dialog open={showProgressModal} onOpenChange={setShowProgressModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-india-green" />
                Your Progress
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Weekly Goal</span>
                  <span className="text-sm text-muted-foreground">
                    {enhancedAthlete.weeklyGoal.current}/{enhancedAthlete.weeklyGoal.target} tests
                  </span>
                </div>
                <Progress value={(enhancedAthlete.weeklyGoal.current / enhancedAthlete.weeklyGoal.target) * 100} />
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Recent Activities</h4>
                <div className="space-y-2">
                  {enhancedAthlete.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{activity.test}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{activity.score}</p>
                        <p className={`text-xs ${activity.improvement > 0 ? 'text-india-green' : 'text-destructive'}`}>
                          {activity.improvement > 0 ? '+' : ''}{activity.improvement}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AthleteDashboard;