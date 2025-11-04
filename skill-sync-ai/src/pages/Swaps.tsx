import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingModal } from "@/components/RatingModal";
import { 
  Search, 
  Bell, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Swap {
  id: number;
  partnerName: string;
  partnerAvatar?: string;
  skillOffered: string;
  skillWanted: string;
  stage: "pending" | "accepted" | "in-progress" | "completed" | "rejected";
  progress: number;
  requestedDate: string;
  lastActivity: string;
}

const Swaps = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<Swap | null>(null);

  // Mock data for swaps
  const swaps: Swap[] = [
    {
      id: 1,
      partnerName: "Alice Johnson",
      skillOffered: "React Development",
      skillWanted: "UI/UX Design",
      stage: "in-progress",
      progress: 65,
      requestedDate: "2024-01-15",
      lastActivity: "2 hours ago",
    },
    {
      id: 2,
      partnerName: "Bob Smith",
      skillOffered: "Python",
      skillWanted: "JavaScript",
      stage: "accepted",
      progress: 30,
      requestedDate: "2024-01-18",
      lastActivity: "1 day ago",
    },
    {
      id: 3,
      partnerName: "Carol White",
      skillOffered: "GraphQL",
      skillWanted: "TypeScript",
      stage: "pending",
      progress: 0,
      requestedDate: "2024-01-20",
      lastActivity: "Just now",
    },
    {
      id: 4,
      partnerName: "David Lee",
      skillOffered: "AWS",
      skillWanted: "Docker",
      stage: "completed",
      progress: 100,
      requestedDate: "2023-12-10",
      lastActivity: "3 weeks ago",
    },
    {
      id: 5,
      partnerName: "Emma Wilson",
      skillOffered: "Node.js",
      skillWanted: "MongoDB",
      stage: "rejected",
      progress: 0,
      requestedDate: "2024-01-10",
      lastActivity: "5 days ago",
    },
  ];

  const getStageColor = (stage: Swap["stage"]) => {
    switch (stage) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "accepted":
        return "bg-primary/10 text-primary border-primary/20";
      case "in-progress":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "";
    }
  };

  const getStageIcon = (stage: Swap["stage"]) => {
    switch (stage) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "accepted":
        return <CheckCircle className="h-3 w-3" />;
      case "in-progress":
        return <AlertCircle className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "rejected":
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStageLabel = (stage: Swap["stage"]) => {
    return stage.charAt(0).toUpperCase() + stage.slice(1).replace("-", " ");
  };

  const filteredSwaps = activeTab === "all" 
    ? swaps 
    : swaps.filter(swap => {
        if (activeTab === "active") return swap.stage === "in-progress" || swap.stage === "accepted";
        if (activeTab === "pending") return swap.stage === "pending";
        if (activeTab === "completed") return swap.stage === "completed";
        return true;
      });

  const handleComplete = (swap: Swap) => {
    setSelectedSwap(swap);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    console.log("Rating submitted:", { rating, comment, swap: selectedSwap });
    setShowRatingModal(false);
  };

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
              <div>
                <h1 className="text-3xl font-bold font-display">Skill Swaps</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your ongoing and completed skill exchanges
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {swaps.filter(s => s.stage === "pending").length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
                    <AlertCircle className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {swaps.filter(s => s.stage === "in-progress" || s.stage === "accepted").length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {swaps.filter(s => s.stage === "completed").length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{swaps.length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Swaps List with Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-muted/50 p-1 rounded-2xl">
                  <TabsTrigger value="all" className="rounded-xl">All Swaps</TabsTrigger>
                  <TabsTrigger value="active" className="rounded-xl">Active</TabsTrigger>
                  <TabsTrigger value="pending" className="rounded-xl">Pending</TabsTrigger>
                  <TabsTrigger value="completed" className="rounded-xl">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {filteredSwaps.map((swap) => (
                    <Card key={swap.id} className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                              <AvatarImage src={swap.partnerAvatar} alt={swap.partnerName} />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                                {swap.partnerName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <CardTitle className="text-base">{swap.partnerName}</CardTitle>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span>Last activity: {swap.lastActivity}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStageColor(swap.stage)}>
                              {getStageIcon(swap.stage)}
                              <span className="ml-1">{getStageLabel(swap.stage)}</span>
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Message
                                </DropdownMenuItem>
                                {swap.stage === "pending" && (
                                  <>
                                    <DropdownMenuItem className="text-success">Accept</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Reject</DropdownMenuItem>
                                  </>
                                )}
                                {(swap.stage === "in-progress" || swap.stage === "accepted") && (
                                  <DropdownMenuItem onClick={() => handleComplete(swap)}>
                                    Mark Complete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm text-muted-foreground">Teaching:</span>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {swap.skillOffered}
                          </Badge>
                          <span className="text-sm text-muted-foreground">→</span>
                          <span className="text-sm text-muted-foreground">Learning:</span>
                          <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                            {swap.skillWanted}
                          </Badge>
                        </div>

                        {swap.stage !== "pending" && swap.stage !== "rejected" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Completion Progress</span>
                              <span className="font-medium">{swap.progress}%</span>
                            </div>
                            <Progress value={swap.progress} className="h-2" />
                          </div>
                        )}

                        {swap.stage === "pending" && (
                          <div className="flex gap-2">
                            <Button variant="default" size="sm" className="flex-1 rounded-xl">
                              Accept
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                              Reject
                            </Button>
                          </div>
                        )}

                        {(swap.stage === "in-progress" || swap.stage === "accepted") && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                            <Button variant="default" size="sm" className="flex-1 rounded-xl" onClick={() => handleComplete(swap)}>
                              Complete
                            </Button>
                          </div>
                        )}

                        {swap.stage === "completed" && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                              View Details
                            </Button>
                            <Button variant="default" size="sm" className="flex-1 rounded-xl">
                              Leave Review
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      {/* Rating Modal */}
      {selectedSwap && (
        <RatingModal
          open={showRatingModal}
          onOpenChange={setShowRatingModal}
          partnerName={selectedSwap.partnerName}
          partnerAvatar={selectedSwap.partnerAvatar}
          onSubmit={handleRatingSubmit}
        />
      )}
    </SidebarProvider>
  );
};

export default Swaps;
