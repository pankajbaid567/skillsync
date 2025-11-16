import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIMatchCard } from "@/components/AIMatchCard";
import { EmptyState } from "@/components/EmptyState";
import { quickCelebrate } from "@/lib/celebrations";
import { Sparkles, Search, Bell, Filter, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Matches = () => {
  const [filter, setFilter] = useState("all");

  const handleConnect = (matchName: string) => {
    // Trigger match celebration
    quickCelebrate.match();
    console.log("Connect with", matchName);
    // Here you would typically send a swap request
  };

  // Mock data for AI matches
  const aiMatches = [
    {
      name: "Emma Wilson",
      avatar: "",
      skillOffered: "GraphQL",
      skillWanted: "TypeScript",
      compatibility: 95,
      matchReason: "Perfect match! Emma's GraphQL expertise aligns with your learning goals.",
    },
    {
      name: "Michael Brown",
      avatar: "",
      skillOffered: "Node.js",
      skillWanted: "React",
      compatibility: 88,
      matchReason: "Great fit! You both want to learn each other's expertise.",
    },
    {
      name: "Sarah Davis",
      avatar: "",
      skillOffered: "AWS",
      skillWanted: "Docker",
      compatibility: 82,
      matchReason: "High compatibility based on your skill preferences.",
    },
    {
      name: "Tom Harris",
      avatar: "",
      skillOffered: "Python",
      skillWanted: "JavaScript",
      compatibility: 79,
      matchReason: "Good match for your Python learning goals.",
    },
    {
      name: "Lisa Chen",
      avatar: "",
      skillOffered: "UI/UX Design",
      skillWanted: "React",
      compatibility: 76,
      matchReason: "Your React skills match Lisa's learning needs.",
    },
    {
      name: "David Kumar",
      avatar: "",
      skillOffered: "Machine Learning",
      skillWanted: "Web Development",
      compatibility: 73,
      matchReason: "Aligned interests in technology and learning.",
    },
  ];

  const filteredMatches = filter === "all" 
    ? aiMatches 
    : aiMatches.filter(match => {
        if (filter === "high") return match.compatibility >= 80;
        if (filter === "medium") return match.compatibility >= 70 && match.compatibility < 80;
        return true;
      });

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1 flex items-center gap-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search skills or mentors..."
                    className="pl-10 h-10 bg-muted/50 border-border/40 rounded-2xl"
                  />
                </div>
              </div>
              <Button variant="ghost" size="icon" className="relative rounded-2xl">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              <Avatar className="h-9 w-9 ring-2 ring-primary/10 cursor-pointer">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                  JD
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-muted/30">
            <div className="container mx-auto p-6 space-y-6">
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20">
                      <Sparkles className="h-6 w-6 text-accent animate-glow" />
                    </div>
                    Your Ideal Skill Matches
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    AI-powered recommendations based on your skills and learning goals
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px] rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter matches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Matches</SelectItem>
                      <SelectItem value="high">High (80%+)</SelectItem>
                      <SelectItem value="medium">Medium (70-79%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* AI Insight Card */}
              <Card className="border-accent/20 shadow-glow rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5" />
                <CardContent className="relative py-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-primary shadow-md">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">AI Matching Active</h3>
                      <p className="text-sm text-muted-foreground">
                        We've found <span className="font-semibold text-foreground">{aiMatches.length} potential matches</span> for you this week. 
                        Connect with highly compatible partners to accelerate your learning journey!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Match Statistics */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Matches</CardTitle>
                    <Sparkles className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{aiMatches.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">+3 new this week</p>
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">High Compatibility</CardTitle>
                    <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0">
                      80%+
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {aiMatches.filter(m => m.compatibility >= 80).length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Highly recommended</p>
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Average Match</CardTitle>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(aiMatches.reduce((sum, m) => sum + m.compatibility, 0) / aiMatches.length)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Quality connections</p>
                  </CardContent>
                </Card>
              </div>

              {/* Matches Grid */}
              {filteredMatches.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMatches.map((match, index) => (
                    <div key={index} className="group relative">
                      <AIMatchCard
                        name={match.name}
                        avatar={match.avatar}
                        skillOffered={match.skillOffered}
                        skillWanted={match.skillWanted}
                        compatibility={match.compatibility}
                        onConnect={() => handleConnect(match.name)}
                      />
                      {/* Purple glow animation for AI section */}
                      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No matches found"
                  description="Try adjusting your filters to see more potential matches"
                  actionLabel="Reset Filters"
                  onAction={() => setFilter("all")}
                />
              )}

              {/* Tip Card */}
              <Card className="border-primary/20 bg-primary/5 rounded-2xl">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Pro Tip</h4>
                      <p className="text-sm text-muted-foreground">
                        Higher compatibility matches are based on skill alignment, learning styles, and mutual goals. 
                        Connect with 80%+ matches for the best learning experience!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Matches;
