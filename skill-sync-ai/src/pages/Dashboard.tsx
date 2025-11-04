import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SkillCard } from "@/components/SkillCard";
import { AIMatchCard } from "@/components/AIMatchCard";
import { ReviewCard } from "@/components/ReviewCard";
import { EmptyState } from "@/components/EmptyState";
import { Sparkles, Bell, TrendingUp, Users, CheckCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("swaps");
  const { user } = useAuth();
  
  // Get user initials from actual user data
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const userInitials = user ? getUserInitials(user.name) : 'U';
  const firstName = user?.name.split(' ')[0] || 'User';

  // Mock data for demonstration
  const activeSwaps = [
    {
      id: 1,
      partnerName: "Alice Johnson",
      skillOffered: "React Development",
      skillWanted: "UI/UX Design",
      progress: 65,
      stage: "in-progress",
    },
    {
      id: 2,
      partnerName: "Bob Smith",
      skillOffered: "Python",
      skillWanted: "JavaScript",
      progress: 30,
      stage: "accepted",
    },
  ];

  const aiMatches = [
    {
      name: "Emma Wilson",
      skillOffered: "GraphQL",
      skillWanted: "TypeScript",
      compatibility: 95,
    },
    {
      name: "Michael Brown",
      skillOffered: "Node.js",
      skillWanted: "React",
      compatibility: 88,
    },
    {
      name: "Sarah Davis",
      skillOffered: "AWS",
      skillWanted: "Docker",
      compatibility: 82,
    },
  ];

  const recentReviews = [
    {
      reviewerName: "John Doe",
      rating: 5,
      comment: "Excellent mentor! Learned so much about React hooks and patterns.",
      date: "2 days ago",
    },
    {
      reviewerName: "Jane Smith",
      rating: 4,
      comment: "Great experience. Very patient and knowledgeable.",
      date: "1 week ago",
    },
  ];

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
                <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-muted/30">
            <div className="container mx-auto p-6 space-y-6">
              {/* Welcome Section */}
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-display">Welcome back, {firstName}! 👋</h1>
                <p className="text-muted-foreground">Here's what's happening with your skill swaps today.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Swaps</CardTitle>
                    <Sparkles className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground mt-1">In progress</p>
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground mt-1">+2 this month</p>
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Rating</CardTitle>
                    <TrendingUp className="h-4 w-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.8</div>
                    <p className="text-xs text-muted-foreground mt-1">From 15 reviews</p>
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">AI Matches</CardTitle>
                    <Users className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground mt-1">New this week</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-muted/50 p-1 rounded-2xl">
                  <TabsTrigger value="swaps" className="rounded-xl">Active Swaps</TabsTrigger>
                  <TabsTrigger value="matches" className="rounded-xl">AI Matches</TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-xl">Reviews</TabsTrigger>
                </TabsList>

                {/* Active Swaps Tab */}
                <TabsContent value="swaps" className="space-y-4">
                  {activeSwaps.map((swap) => (
                    <Card key={swap.id} className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                                {swap.partnerName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{swap.partnerName}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                  Teaching: {swap.skillOffered}
                                </Badge>
                                <Badge variant="secondary" className="text-xs bg-secondary/10 text-secondary border-secondary/20">
                                  Learning: {swap.skillWanted}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Badge className={swap.stage === "in-progress" ? "bg-warning/10 text-warning border-warning/20" : "bg-success/10 text-success border-success/20"}>
                            {swap.stage === "in-progress" ? <Clock className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                            {swap.stage === "in-progress" ? "In Progress" : "Accepted"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{swap.progress}%</span>
                          </div>
                          <Progress value={swap.progress} className="h-2" />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                            View Details
                          </Button>
                          <Button variant="default" size="sm" className="flex-1 rounded-xl">
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* AI Matches Tab */}
                <TabsContent value="matches" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {aiMatches.map((match, index) => (
                      <AIMatchCard
                        key={index}
                        name={match.name}
                        skillOffered={match.skillOffered}
                        skillWanted={match.skillWanted}
                        compatibility={match.compatibility}
                        onConnect={() => console.log("Connect with", match.name)}
                      />
                    ))}
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-4">
                  {recentReviews.map((review, index) => (
                    <ReviewCard
                      key={index}
                      reviewerName={review.reviewerName}
                      rating={review.rating}
                      comment={review.comment}
                      date={review.date}
                    />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>

        {/* Right Sidebar - AI Recommendations */}
        <aside className="hidden xl:flex w-80 border-l border-border/40 bg-background/95">
          <div className="flex-1 overflow-auto p-6 space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10">
                <Sparkles className="h-5 w-5 text-accent animate-glow" />
              </div>
              <h2 className="font-semibold">AI Recommendations</h2>
            </div>
            
            <Card className="border-accent/20 shadow-glow rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-50" />
              <CardHeader className="relative">
                <CardTitle className="text-sm">Perfect Match Found!</CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-accent/20">
                    <AvatarFallback className="bg-gradient-to-br from-accent to-primary text-white">
                      EW
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Emma Wilson</p>
                    <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 text-xs mt-1">
                      95% Match
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Emma wants to learn TypeScript and offers GraphQL expertise - perfect for your goals!
                </p>
                <Button variant="ai" size="sm" className="w-full rounded-xl">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Connect Now
                </Button>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">More Suggestions</h3>
              <div className="space-y-2">
                {["Michael B.", "Sarah D.", "Tom H."].map((name, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                        {name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{name}</p>
                      <p className="text-xs text-muted-foreground">{85 - i * 3}% match</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
