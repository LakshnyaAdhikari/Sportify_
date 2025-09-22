import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Filter, 
  Download, 
  Star, 
  Calendar,
  BarChart3,
  Trophy,
  Target,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface AthleteProfile {
  id: string;
  name: string;
  age: number;
  district: string;
  state: string;
  bestScore: number;
  sport: string;
  lastActive: string;
  status: "active" | "flagged" | "shortlisted";
  videoUrl?: string;
}

interface DistrictStats {
  district: string;
  state: string;
  activeAthletes: number;
  avgScore: number;
  topPerformers: number;
  lat: number;
  lng: number;
}

const AdminDashboard = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"heatmap" | "list">("heatmap");

  // Mock data for demonstration
  const districtStats: DistrictStats[] = [
    { district: "Prayagraj", state: "UP", activeAthletes: 1247, avgScore: 78.5, topPerformers: 45, lat: 25.4358, lng: 81.8463 },
    { district: "Pune", state: "MH", activeAthletes: 2156, avgScore: 82.3, topPerformers: 67, lat: 18.5204, lng: 73.8567 },
    { district: "Jaipur", state: "RJ", activeAthletes: 1834, avgScore: 75.2, topPerformers: 52, lat: 26.9124, lng: 75.7873 },
    { district: "Bangalore", state: "KA", activeAthletes: 2943, avgScore: 85.1, topPerformers: 89, lat: 12.9716, lng: 77.5946 },
    { district: "Chennai", state: "TN", activeAthletes: 2387, avgScore: 79.8, topPerformers: 73, lat: 13.0827, lng: 80.2707 },
  ];

  const shortlistedAthletes: AthleteProfile[] = [
    {
      id: "ATH001",
      name: "Priya Sharma",
      age: 16,
      district: "Jaipur",
      state: "Rajasthan",
      bestScore: 95.2,
      sport: "Athletics",
      lastActive: "2 hours ago",
      status: "shortlisted"
    },
    {
      id: "ATH002", 
      name: "Arjun Singh",
      age: 17,
      district: "Prayagraj",
      state: "UP",
      bestScore: 92.8,
      sport: "Gymnastics",
      lastActive: "1 day ago",
      status: "flagged"
    },
    {
      id: "ATH003",
      name: "Kavya Patel",
      age: 15,
      district: "Pune",
      state: "Maharashtra",
      bestScore: 94.5,
      sport: "Athletics",
      lastActive: "3 hours ago",
      status: "shortlisted"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-india-green text-white";
      case "flagged": return "bg-saffron text-white";
      case "shortlisted": return "bg-india-blue text-white";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalStats = {
    totalAthletes: districtStats.reduce((sum, d) => sum + d.activeAthletes, 0),
    avgScore: districtStats.reduce((sum, d) => sum + d.avgScore, 0) / districtStats.length,
    totalShortlisted: shortlistedAthletes.filter(a => a.status === "shortlisted").length,
    totalFlagged: shortlistedAthletes.filter(a => a.status === "flagged").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/5 via-white to-india-green/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-saffron/20 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-saffron" />
              <div>
                <h1 className="text-lg font-bold text-saffron">Sportify Admin</h1>
                <p className="text-xs text-muted-foreground">SAI Talent Discovery Dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline-athletic" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="floating" size="icon">
              <Users className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-saffron/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6 text-saffron" />
              </div>
              <p className="text-2xl font-bold text-neutral-dark">{totalStats.totalAthletes.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Athletes</p>
            </CardContent>
          </Card>

          <Card className="border-india-green/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-india-green/10 flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="h-6 w-6 text-india-green" />
              </div>
              <p className="text-2xl font-bold text-neutral-dark">{totalStats.avgScore.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Avg Performance</p>
            </CardContent>
          </Card>

          <Card className="border-india-blue/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-india-blue/10 flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-india-blue" />
              </div>
              <p className="text-2xl font-bold text-neutral-dark">{totalStats.totalShortlisted}</p>
              <p className="text-xs text-muted-foreground">Shortlisted</p>
            </CardContent>
          </Card>

          <Card className="border-saffron/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-2">
                <AlertCircle className="h-6 w-6 text-saffron" />
              </div>
              <p className="text-2xl font-bold text-neutral-dark">{totalStats.totalFlagged}</p>
              <p className="text-xs text-muted-foreground">Flagged</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-saffron/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-dark">
              <Filter className="h-5 w-5 text-saffron" />
              Talent Discovery Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-dark">State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UP">Uttar Pradesh</SelectItem>
                    <SelectItem value="MH">Maharashtra</SelectItem>
                    <SelectItem value="RJ">Rajasthan</SelectItem>
                    <SelectItem value="KA">Karnataka</SelectItem>
                    <SelectItem value="TN">Tamil Nadu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-dark">Sport</label>
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="athletics">Athletics</SelectItem>
                    <SelectItem value="gymnastics">Gymnastics</SelectItem>
                    <SelectItem value="wrestling">Wrestling</SelectItem>
                    <SelectItem value="boxing">Boxing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-dark">Search</label>
                <Input
                  placeholder="Search athletes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-dark">View</label>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "heatmap" ? "hero" : "outline-athletic"}
                    size="sm"
                    onClick={() => setViewMode("heatmap")}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Map
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "hero" : "outline-athletic"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    List
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Heatmap/Districts */}
          <div className="lg:col-span-2">
            <Card className="border-saffron/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-neutral-dark">
                  <MapPin className="h-5 w-5 text-saffron" />
                  Talent Hotspots by District
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === "heatmap" ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-gradient-to-br from-saffron/10 to-india-green/10 rounded-lg border-2 border-dashed border-saffron/20 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-saffron mx-auto mb-2" />
                        <p className="text-neutral-dark font-medium">Interactive Heatmap</p>
                        <p className="text-sm text-muted-foreground">District-wise talent density visualization</p>
                        <p className="text-xs text-saffron mt-2">Integration with Mapbox/Leaflet pending</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {districtStats.map((district) => (
                      <div 
                        key={`${district.district}-${district.state}`}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-gray hover:bg-saffron/5 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-saffron" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-dark">{district.district}</h3>
                            <p className="text-sm text-muted-foreground">{district.state}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-4 mb-1">
                            <div className="text-center">
                              <p className="text-lg font-bold text-neutral-dark">{district.activeAthletes}</p>
                              <p className="text-xs text-muted-foreground">Athletes</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-india-green">{district.avgScore}</p>
                              <p className="text-xs text-muted-foreground">Avg Score</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-saffron">{district.topPerformers}</p>
                              <p className="text-xs text-muted-foreground">Top 10%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Shortlisted Athletes */}
          <div>
            <Card className="border-india-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-neutral-dark">
                  <Star className="h-5 w-5 text-india-blue" />
                  Priority Athletes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shortlistedAthletes.map((athlete) => (
                    <div 
                      key={athlete.id}
                      className="p-4 rounded-lg border border-neutral-gray hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-neutral-dark">{athlete.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {athlete.age} years • {athlete.district}, {athlete.state}
                          </p>
                        </div>
                        <Badge className={getStatusColor(athlete.status)}>
                          {athlete.status === "shortlisted" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {athlete.status === "flagged" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {athlete.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-saffron" />
                          <span className="text-sm font-medium text-neutral-dark">{athlete.bestScore}</span>
                          <span className="text-xs text-muted-foreground">• {athlete.sport}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{athlete.lastActive}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline-athletic" size="sm" className="text-xs flex-1">
                          <Target className="h-3 w-3 mr-1" />
                          View Profile
                        </Button>
                        <Button variant="champion" size="sm" className="text-xs">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline-athletic" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    View All Shortlisted
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;