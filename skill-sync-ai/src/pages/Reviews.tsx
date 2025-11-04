import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReviewCard } from "@/components/ReviewCard";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Bell, Star, TrendingUp } from "lucide-react";
import { useState } from "react";

const Reviews = () => {
  const [activeTab, setActiveTab] = useState("received");

  // Mock data for reviews
  const receivedReviews = [
    {
      reviewerName: "John Doe",
      reviewerAvatar: "",
      rating: 5,
      comment: "Excellent mentor! Jane's teaching style is clear and patient. Learned so much about React hooks and state management. Highly recommend!",
      date: "2 days ago",
      skillTaught: "React Development",
    },
    {
      reviewerName: "Alice Johnson",
      reviewerAvatar: "",
      rating: 5,
      comment: "Amazing experience! Jane really knows her stuff and makes complex topics easy to understand.",
      date: "1 week ago",
      skillTaught: "TypeScript",
    },
    {
      reviewerName: "Bob Smith",
      reviewerAvatar: "",
      rating: 4,
      comment: "Great teacher with deep knowledge of TypeScript. Very responsive to questions.",
      date: "2 weeks ago",
      skillTaught: "TypeScript",
    },
    {
      reviewerName: "Carol White",
      reviewerAvatar: "",
      rating: 5,
      comment: "Patient and knowledgeable. Made learning GraphQL enjoyable and practical.",
      date: "3 weeks ago",
      skillTaught: "GraphQL",
    },
    {
      reviewerName: "David Lee",
      reviewerAvatar: "",
      rating: 4,
      comment: "Very helpful sessions. Good at explaining complex concepts in simple terms.",
      date: "1 month ago",
      skillTaught: "Node.js",
    },
  ];

  const givenReviews = [
    {
      reviewerName: "Emma Wilson",
      reviewerAvatar: "",
      rating: 5,
      comment: "Emma is an exceptional UI/UX designer. Her feedback was incredibly valuable and helped me improve my design skills significantly.",
      date: "1 week ago",
      skillLearned: "UI/UX Design",
    },
    {
      reviewerName: "Michael Brown",
      reviewerAvatar: "",
      rating: 5,
      comment: "Great Python mentor! Michael's explanations are clear and his real-world examples made learning much easier.",
      date: "2 weeks ago",
      skillLearned: "Python",
    },
    {
      reviewerName: "Sarah Davis",
      reviewerAvatar: "",
      rating: 4,
      comment: "Very knowledgeable about AWS. The hands-on approach to teaching was really helpful.",
      date: "3 weeks ago",
      skillLearned: "AWS",
    },
  ];

  // Calculate rating distribution
  const allReviews = receivedReviews;
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
    allReviews.filter(r => r.rating === rating).length
  );
  const totalReviews = allReviews.length;
  const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

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
                    placeholder="Search reviews..."
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
            <div className="container mx-auto p-6 max-w-5xl space-y-6">
              {/* Page Header */}
              <div>
                <h1 className="text-3xl font-bold font-display">Reviews & Ratings</h1>
                <p className="text-muted-foreground mt-2">
                  See what others say about your teaching and share your feedback
                </p>
              </div>

              {/* Rating Overview */}
              <Card className="border-border/40 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle>Your Rating Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Average Rating */}
                    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-warning/5 to-warning/10 rounded-2xl">
                      <div className="text-6xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 ${
                              star <= Math.round(averageRating)
                                ? "fill-warning text-warning"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating, index) => (
                        <div key={rating} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-12">
                            <span className="text-sm font-medium">{rating}</span>
                            <Star className="h-3 w-3 fill-warning text-warning" />
                          </div>
                          <Progress 
                            value={(ratingCounts[index] / totalReviews) * 100} 
                            className="h-2 flex-1" 
                          />
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {ratingCounts[index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
                    <Star className="h-4 w-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalReviews}</div>
                    <p className="text-xs text-muted-foreground mt-1">Received reviews</p>
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">5-Star Reviews</CardTitle>
                    <TrendingUp className="h-4 w-4 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{ratingCounts[0]}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((ratingCounts[0] / totalReviews) * 100).toFixed(0)}% of total
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Given Reviews</CardTitle>
                    <Star className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{givenReviews.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Reviews written</p>
                  </CardContent>
                </Card>
              </div>

              {/* Reviews Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-muted/50 p-1 rounded-2xl">
                  <TabsTrigger value="received" className="rounded-xl">
                    Received ({receivedReviews.length})
                  </TabsTrigger>
                  <TabsTrigger value="given" className="rounded-xl">
                    Given ({givenReviews.length})
                  </TabsTrigger>
                </TabsList>

                {/* Received Reviews Tab */}
                <TabsContent value="received" className="space-y-4">
                  {receivedReviews.map((review, index) => (
                    <Card key={index} className="border-border/40 shadow-md rounded-2xl overflow-hidden">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                                {review.reviewerName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-sm">{review.reviewerName}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${
                                        star <= review.rating
                                          ? "fill-warning text-warning"
                                          : "text-muted-foreground/30"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {review.skillTaught}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Given Reviews Tab */}
                <TabsContent value="given" className="space-y-4">
                  {givenReviews.map((review, index) => (
                    <Card key={index} className="border-border/40 shadow-md rounded-2xl overflow-hidden">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                                {review.reviewerName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-sm">{review.reviewerName}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${
                                        star <= review.rating
                                          ? "fill-warning text-warning"
                                          : "text-muted-foreground/30"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                            {review.skillLearned}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Reviews;
