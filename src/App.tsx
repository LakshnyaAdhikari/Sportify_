import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AthleteOnboarding from "./components/AthleteOnboarding";
import AthleteDashboard from "./components/AthleteDashboard";
import AdminDashboard from "./components/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface AthleteData {
  name: string;
  dob: string;
  gender: string;
  district: string;
  state: string;
  school: string;
}

const App = () => {
  const [currentView, setCurrentView] = useState<"onboarding" | "athlete" | "admin">("onboarding");
  const [athleteData, setAthleteData] = useState<AthleteData | null>(null);

  const handleOnboardingComplete = (data: AthleteData) => {
    setAthleteData(data);
    setCurrentView("athlete");
  };

  const mockAthleteData = {
    name: athleteData?.name || "राज कुमार",
    district: athleteData?.district || "जयपुर",
    state: athleteData?.state || "राजस्थान",
    totalTests: 12,
    bestScore: 87,
    weeklyProgress: 15,
    rank: {
      district: 3,
      national: 147
    },
    badges: ["First Steps", "Consistency Star"],
    recentActivities: [
      { test: "Squat Test", score: 87, date: "Today", improvement: 8 },
      { test: "Push-up Challenge", score: 82, date: "Yesterday", improvement: 5 },
    ]
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "onboarding":
        return <AthleteOnboarding onComplete={handleOnboardingComplete} />;
      case "athlete":
        return (
          <AthleteDashboard
            athlete={mockAthleteData}
            onStartTest={() => console.log("Starting test...")}
            onViewProgress={() => console.log("Viewing progress...")}
            onViewLeaderboard={() => console.log("Viewing leaderboard...")}
          />
        );
      case "admin":
        return <AdminDashboard />;
      default:
        return <AthleteOnboarding onComplete={handleOnboardingComplete} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={renderCurrentView()} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        
        {/* Demo Navigation - Remove in production */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          <button
            onClick={() => setCurrentView("onboarding")}
            className="px-3 py-1 bg-saffron text-white rounded-full text-xs font-medium shadow-lg hover:bg-saffron-dark transition-colors"
          >
            Demo: Onboarding
          </button>
          <button
            onClick={() => setCurrentView("athlete")}
            className="px-3 py-1 bg-india-green text-white rounded-full text-xs font-medium shadow-lg hover:bg-india-green-dark transition-colors"
          >
            Demo: Athlete
          </button>
          <button
            onClick={() => setCurrentView("admin")}
            className="px-3 py-1 bg-india-blue text-white rounded-full text-xs font-medium shadow-lg hover:bg-india-blue-light transition-colors"
          >
            Demo: Admin
          </button>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
