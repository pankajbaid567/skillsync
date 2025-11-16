import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ReviewCard } from "@/components/ReviewCard";
import { SwapRequestModal } from "@/components/SwapRequestModal";
import { EmptyState } from "@/components/EmptyState";
import { CelebrationSettings } from "@/components/CelebrationSettings";
import { Star, MapPin, Calendar, Edit, Repeat, Mail, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const [showSwapModal, setShowSwapModal] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  // Format join date
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Show loading state
  if (authLoading || !user) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const profileData = {
    name: user.name || "User",
    avatar: user.avatar || "",
    bio: user.bio || "No bio provided yet. Edit your profile to add a bio.",
    location: user.location || "Location not set",
    joinedDate: user.createdAt ? formatJoinDate(user.createdAt) : "Recently",
    rating: user.rating || 0,
    reviewCount: user.totalReviews || 0,
    completedSwaps: 0, // This should come from swaps count
    skillsOffered: user.skillsOffered || [],
    skillsWanted: user.skillsWanted || [],
  };

  const userInitials = getUserInitials(profileData.name);

  // TODO: Fetch real reviews from backend
  const reviews: any[] = [];

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
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-muted/30">
            <div className="container mx-auto p-6 max-w-5xl space-y-6">
              {/* Profile Header Card */}
              <Card className="border-border/40 shadow-lg rounded-2xl overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary via-secondary to-accent"></div>
                <CardContent className="pt-0 px-6 pb-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16">
                    <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl">
                      <AvatarImage src={profileData.avatar} alt={profileData.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-3xl">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <h1 className="text-2xl font-bold font-display">{profileData.name}</h1>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {profileData.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Joined {profileData.joinedDate}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-xl">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                          <Button variant="gradient" size="sm" className="rounded-xl" onClick={() => setShowSwapModal(true)}>
                            <Repeat className="h-4 w-4 mr-2" />
                            Request Swap
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl">
                          <Star className="h-5 w-5 fill-warning text-warning" />
                          <div>
                            <p className="text-sm font-bold">{profileData.rating}</p>
                            <p className="text-xs text-muted-foreground">{profileData.reviewCount} reviews</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl">
                          <Repeat className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-bold">{profileData.completedSwaps}</p>
                            <p className="text-xs text-muted-foreground">Completed swaps</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Bio</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {profileData.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Skills Offered */}
                <Card className="border-border/40 shadow-md rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Skills Offered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profileData.skillsOffered.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profileData.skillsOffered.map((skill, index) => (
                          <Badge 
                            key={index}
                            className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors rounded-xl px-3 py-1.5"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No skills offered yet. Edit your profile to add skills you can teach.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Skills Wanted */}
                <Card className="border-border/40 shadow-md rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-secondary" />
                      Skills Wanted
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profileData.skillsWanted.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profileData.skillsWanted.map((skill, index) => (
                          <Badge 
                            key={index}
                            className="bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20 transition-colors rounded-xl px-3 py-1.5"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No skills wanted yet. Edit your profile to add skills you want to learn.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Reviews Section */}
              <Card className="border-border/40 shadow-md rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Reviews ({profileData.reviewCount})</CardTitle>
                  {profileData.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-warning text-warning" />
                      <span className="font-semibold">{profileData.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">/ 5.0</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <ReviewCard
                        key={index}
                        reviewerName={review.reviewerName}
                        rating={review.rating}
                        comment={review.comment}
                        date={review.date}
                      />
                    ))
                  ) : (
                    <EmptyState
                      title="No reviews yet"
                      description="Complete skill swaps to start receiving reviews from other users."
                    />
                  )}
                </CardContent>
              </Card>

              {/* Celebration Settings */}
              <CelebrationSettings />

              {/* Contact Section */}
              <Card className="border-border/40 shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="default" className="w-full md:w-auto rounded-xl">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Swap Request Modal */}
      <SwapRequestModal
        open={showSwapModal}
        onOpenChange={setShowSwapModal}
        partnerName={profileData.name}
        partnerAvatar={profileData.avatar}
        skillOffered="React Development"
        skillWanted="Python"
        onConfirm={() => console.log("Swap request sent")}
      />
    </SidebarProvider>
  );
};

export default Profile;
