import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUserById } from "@/services/user.service";
import { getUserReviews } from "@/services/review.service";
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
import { Star, MapPin, Calendar, Repeat, ArrowLeft, Sparkles, Loader2, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createSwap } from "@/services/swap.service";
import { NotificationBell } from "@/components/NotificationBell";
import { toast } from "sonner";
import { Search, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const UserProfile = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [showSwapModal, setShowSwapModal] = useState(false);

    // Fetch user profile
    const { data: user, isLoading: userLoading, error: userError } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUserById(Number(userId)),
        enabled: !!userId,
    });

    // Fetch user reviews
    const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
        queryKey: ['userReviews', userId],
        queryFn: () => getUserReviews(Number(userId)),
        enabled: !!userId,
    });

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

    if (userLoading) {
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

    if (userError || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-muted/30">
                <EmptyState
                    title="User not found"
                    description="The user you are looking for does not exist or has been removed."
                    actionLabel="Go Back"
                    onAction={() => navigate(-1)}
                />
            </div>
        );
    }

    const handleSwapRequest = async () => {
        if (!user || !currentUser) return;

        try {
            // Find matching skills (first match for now)
            const skillOffered = currentUser.skillsOffered.find(s => user.skillsWanted.includes(s)) || currentUser.skillsOffered[0];
            const skillRequested = user.skillsOffered.find(s => currentUser.skillsWanted.includes(s)) || user.skillsOffered[0];

            await createSwap({
                receiverId: user.id,
                skillOffered: skillOffered || "General Mentorship",
                skillRequested: skillRequested || "General Mentorship",
            });

            toast.success("Swap request sent successfully!");
            setShowSwapModal(false);
        } catch (error) {
            console.error("Failed to send swap request:", error);
            toast.error("Failed to send swap request. Please try again.");
        }
    };

    const isOwnProfile = currentUser?.id === user.id;

    // Determine skills for swap modal
    const defaultSkillOffered = currentUser?.skillsOffered.find(s => user.skillsWanted.includes(s)) || currentUser?.skillsOffered[0] || "General Mentorship";
    const defaultSkillRequested = user.skillsOffered.find(s => currentUser?.skillsWanted.includes(s)) || user.skillsOffered[0] || "General Mentorship";

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
                            <NotificationBell />
                            <Avatar className="h-9 w-9 ring-2 ring-primary/10 cursor-pointer">
                                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                                    {currentUser ? getUserInitials(currentUser.name) : 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto bg-muted/30">
                        <div className="container mx-auto p-6 space-y-6">
                            <Button
                                variant="ghost"
                                className="mb-2 pl-0 hover:bg-transparent hover:text-primary transition-colors"
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>

                            {/* Profile Header Card */}
                            <Card className="border-border/40 shadow-lg rounded-3xl overflow-hidden">
                                <div className="h-32 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 relative">
                                    <div className="absolute inset-0 bg-grid-white/10" />
                                </div>
                                <CardContent className="relative px-8 pb-8">
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        <div className="-mt-16 relative">
                                            <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-4xl">
                                                    {getUserInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-success ring-4 ring-background" />
                                        </div>

                                        <div className="flex-1 mt-2 space-y-4">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div>
                                                    <h1 className="text-3xl font-bold font-display">{user.name}</h1>
                                                    <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                                                        {user.location && (
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="h-4 w-4" />
                                                                <span>{user.location}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>Joined {formatJoinDate(user.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {!isOwnProfile && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-xl"
                                                            onClick={() => {
                                                                // Navigate to messages with userId parameter
                                                                navigate(`/messages?userId=${user.id}`);
                                                            }}
                                                        >
                                                            <MessageSquare className="h-4 w-4 mr-2" />
                                                            Send Message
                                                        </Button>
                                                        <Button
                                                            variant="gradient"
                                                            size="sm"
                                                            className="rounded-xl"
                                                            onClick={() => setShowSwapModal(true)}
                                                        >
                                                            <Repeat className="h-4 w-4 mr-2" />
                                                            Request Swap
                                                        </Button>
                                                    </div>
                                                )}

                                                {isOwnProfile && (
                                                    <Button variant="outline" className="rounded-xl">
                                                        Edit Profile
                                                    </Button>
                                                )}
                                            </div>

                                            {user.bio && (
                                                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                                                    {user.bio}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-6 pt-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 rounded-lg bg-warning/10 text-warning">
                                                        <Star className="h-5 w-5 fill-current" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{user.rating.toFixed(1)}</div>
                                                        <div className="text-xs text-muted-foreground">{user.totalReviews} reviews</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                        <Repeat className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{(user as any).swapsCompleted || 0}</div>
                                                        <div className="text-xs text-muted-foreground">Swaps completed</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Left Column - Skills */}
                                <div className="md:col-span-2 space-y-6">
                                    {/* Skills Offered */}
                                    <Card className="border-border/40 shadow-md rounded-2xl">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Sparkles className="h-5 w-5 text-primary" />
                                                Skills Offered
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {user.skillsOffered.map((skill, index) => (
                                                    <Badge
                                                        key={index}
                                                        className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-sm"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Skills Wanted */}
                                    <Card className="border-border/40 shadow-md rounded-2xl">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Repeat className="h-5 w-5 text-secondary" />
                                                Skills Wanted
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {user.skillsWanted.map((skill, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/20 text-sm"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Reviews Section */}
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold font-display">Reviews</h2>
                                        {reviews.length > 0 ? (
                                            <div className="space-y-4">
                                                {reviews.map((review) => (
                                                    <ReviewCard
                                                        key={review.id}
                                                        reviewerName={review.reviewer?.name || "Anonymous"}
                                                        rating={review.rating}
                                                        comment={review.comment || ""}
                                                        date={new Date(review.createdAt).toLocaleDateString()}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <EmptyState
                                                title="No reviews yet"
                                                description="This user hasn't received any reviews yet."
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Additional Info */}
                                <div className="space-y-6">
                                    <Card className="border-border/40 shadow-md rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5">
                                        <CardContent className="p-6">
                                            <h3 className="font-semibold mb-4">Availability</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Weekdays</span>
                                                    <span className="font-medium">Evenings</span>
                                                </div>
                                                <Separator />
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Weekends</span>
                                                    <span className="font-medium">Flexible</span>
                                                </div>
                                                <Separator />
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Timezone</span>
                                                    <span className="font-medium">UTC+5:30</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <SwapRequestModal
                open={showSwapModal}
                onOpenChange={setShowSwapModal}
                partnerName={user.name}
                partnerAvatar={user.avatar}
                skillOffered={defaultSkillOffered}
                skillWanted={defaultSkillRequested}
                onConfirm={handleSwapRequest}
            />
        </SidebarProvider>
    );
};

export default UserProfile;
