import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getMySwaps, updateSwapStatus } from "@/services/swap.service";
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
import { quickCelebrate } from "@/lib/celebrations";
import { toast } from "sonner";
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

import { SkillSwap, SwapStatus } from "@/types";

const Swaps = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<SkillSwap | null>(null);
  const queryClient = useQueryClient();

  const { user } = useAuth();

  // Fetch real swap data
  const { data: swapsData, isLoading } = useQuery({
    queryKey: ['mySwaps'],
    queryFn: getMySwaps,
    enabled: !!user,
  });

  const swaps = swapsData || [];

  const handleSwapStatus = async (swapId: number, status: SwapStatus) => {
    try {
      await updateSwapStatus(swapId, status);
      toast.success(`Swap request ${status.toLowerCase()} successfully`);
      queryClient.invalidateQueries({ queryKey: ['mySwaps'] });

      if (status === SwapStatus.ACCEPTED) {
        quickCelebrate.swapAccepted();
      }
    } catch (error) {
      console.error(`Failed to ${status.toLowerCase()} swap:`, error);
      toast.error(`Failed to ${status.toLowerCase()} swap request`);
    }
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case SwapStatus.PENDING:
        return "bg-warning/10 text-warning border-warning/20";
      case SwapStatus.ACCEPTED:
        return "bg-primary/10 text-primary border-primary/20";
      case SwapStatus.IN_PROGRESS:
        return "bg-secondary/10 text-secondary border-secondary/20";
      case SwapStatus.COMPLETED:
        return "bg-success/10 text-success border-success/20";
      case SwapStatus.REJECTED:
        return "bg-destructive/10 text-destructive border-destructive/20";
      case SwapStatus.CANCELLED:
        return "bg-muted text-muted-foreground border-border";
      default:
        return "";
    }
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case SwapStatus.PENDING:
        return <Clock className="h-3 w-3" />;
      case SwapStatus.ACCEPTED:
        return <CheckCircle className="h-3 w-3" />;
      case SwapStatus.IN_PROGRESS:
        return <AlertCircle className="h-3 w-3" />;
      case SwapStatus.COMPLETED:
        return <CheckCircle className="h-3 w-3" />;
      case SwapStatus.REJECTED:
      case SwapStatus.CANCELLED:
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStageLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace("_", " ");
  };

  const filteredSwaps = activeTab === "all"
    ? swaps
    : swaps.filter(swap => {
      if (activeTab === "active") return swap.status === SwapStatus.IN_PROGRESS || swap.status === SwapStatus.ACCEPTED;
      if (activeTab === "pending") return swap.status === SwapStatus.PENDING;
      if (activeTab === "completed") return swap.status === SwapStatus.COMPLETED;
      return true;
    });

  const handleComplete = (swap: SkillSwap) => {
    // Trigger celebration for completing swap
    quickCelebrate.swapCompleted();

    setSelectedSwap(swap);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    console.log("Rating submitted:", { rating, comment, swap: selectedSwap });

    // Trigger celebration if 5-star review
    if (rating === 5) {
      setTimeout(() => {
        quickCelebrate.reviewReceived();
      }, 500);
    }

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
                      {swaps.filter(s => s.status === SwapStatus.PENDING).length}
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
                      {swaps.filter(s => s.status === SwapStatus.IN_PROGRESS || s.status === SwapStatus.ACCEPTED).length}
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
                      {swaps.filter(s => s.status === SwapStatus.COMPLETED).length}
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
                  {filteredSwaps.map((swap) => {
                    const isRequester = swap.requesterId === user?.id;
                    const partner = isRequester ? swap.receiver : swap.requester;
                    const partnerName = partner?.name || 'Unknown User';
                    const partnerInitials = partnerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    const partnerAvatar = partner?.avatar;
                    const lastActivity = new Date(swap.updatedAt).toLocaleDateString();

                    return (
                      <Card key={swap.id} className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                                <AvatarImage src={partnerAvatar} alt={partnerName} />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                                  {partnerInitials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <CardTitle className="text-base">{partnerName}</CardTitle>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                  <span>Last activity: {lastActivity}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStageColor(swap.status)}>
                                {getStageIcon(swap.status)}
                                <span className="ml-1">{getStageLabel(swap.status)}</span>
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
                                  {swap.status === SwapStatus.PENDING && !isRequester && (
                                    <>
                                      <DropdownMenuItem
                                        className="text-success"
                                        onClick={() => handleSwapStatus(swap.id, SwapStatus.ACCEPTED)}
                                      >
                                        Accept
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => handleSwapStatus(swap.id, SwapStatus.REJECTED)}
                                      >
                                        Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {(swap.status === SwapStatus.IN_PROGRESS || swap.status === SwapStatus.ACCEPTED) && (
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
                              {swap.skillRequested}
                            </Badge>
                          </div>

                          {swap.status !== SwapStatus.PENDING && swap.status !== SwapStatus.REJECTED && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <span className="font-medium">{getStageLabel(swap.status)}</span>
                              </div>
                              <Progress value={swap.status === SwapStatus.COMPLETED ? 100 : 50} className="h-2" />
                            </div>
                          )}

                          {swap.status === SwapStatus.PENDING && !isRequester && (
                            <div className="flex gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                className="flex-1 rounded-xl"
                                onClick={() => handleSwapStatus(swap.id, SwapStatus.ACCEPTED)}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 rounded-xl"
                                onClick={() => handleSwapStatus(swap.id, SwapStatus.REJECTED)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}

                          {swap.status === SwapStatus.PENDING && isRequester && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 rounded-xl"
                                onClick={() => handleSwapStatus(swap.id, SwapStatus.CANCELLED)}
                              >
                                Cancel Request
                              </Button>
                            </div>
                          )}

                          {(swap.status === SwapStatus.IN_PROGRESS || swap.status === SwapStatus.ACCEPTED) && (
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

                          {swap.status === SwapStatus.COMPLETED && (
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
                    );
                  })}
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
          partnerName={selectedSwap.receiverId === user?.id ? selectedSwap.requester?.name || 'Partner' : selectedSwap.receiver?.name || 'Partner'}
          partnerAvatar={selectedSwap.receiverId === user?.id ? selectedSwap.requester?.avatar : selectedSwap.receiver?.avatar}
          onSubmit={handleRatingSubmit}
        />
      )}
    </SidebarProvider>
  );
};

export default Swaps;
