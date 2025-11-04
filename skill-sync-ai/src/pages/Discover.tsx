import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Users, Star } from "lucide-react";

const Discover = () => {
  // Mock data for demonstration
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "",
      skills: ["React", "UI/UX Design", "Figma"],
      seeking: ["Python", "Data Science"],
      rating: 4.8,
      swaps: 12
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "",
      skills: ["Python", "Machine Learning", "AI"],
      seeking: ["React", "Frontend"],
      rating: 4.9,
      swaps: 18
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "",
      skills: ["Node.js", "MongoDB", "Backend"],
      seeking: ["UI Design", "Figma"],
      rating: 4.7,
      swaps: 15
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Discover Skill Partners
            </h1>
            <p className="text-muted-foreground mt-2">
              Connect with people who have skills you want to learn
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by skill, name, or expertise..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* User Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-lg">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{user.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">•</span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {user.swaps} swaps
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <CardDescription className="text-xs font-semibold mb-2">
                      Can teach
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <CardDescription className="text-xs font-semibold mb-2">
                      Wants to learn
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {user.seeking.map((skill, idx) => (
                        <Badge key={idx} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">View Profile</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Discover;
