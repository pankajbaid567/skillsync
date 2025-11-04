import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Zap, Target } from "lucide-react";
import aiMatchingImage from "@/assets/ai-matching.jpg";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Brain,
    title: "Smart Matching",
    description: "AI analyzes your profile to find ideal skill exchange partners",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get matched in seconds with our lightning-fast algorithm",
  },
  {
    icon: Target,
    title: "Perfect Fit",
    description: "95% compatibility score ensures successful collaborations",
  },
];

const AIFeature = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/5"></div>
      
      <div className="container relative mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-accent/30 via-primary/30 to-secondary/30 blur-3xl animate-glow"></div>
            <div className="relative rounded-3xl border-2 border-accent/20 bg-card p-8 shadow-2xl">
              <img
                src={aiMatchingImage}
                alt="AI matching visualization"
                className="rounded-2xl mb-6"
              />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent animate-glow" />
                  <span className="text-sm font-medium bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    AI Match Powered by SkillSync Intelligence
                  </span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: "Sarah Chen", skill: "UX Design", match: "98%" },
                    { name: "Marcus Kim", skill: "React Development", match: "95%" },
                    { name: "Emma Santos", skill: "Product Strategy", match: "92%" },
                  ].map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl border border-border bg-background/50 p-3 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.skill}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                        {user.match} Match
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 order-1 lg:order-2">
            <Badge className="w-fit bg-accent/10 text-accent border-accent/20">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            
            <h2 className="font-display text-4xl font-bold md:text-5xl">
              Your Perfect Skill Match is{" "}
              <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                One Click Away
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Our advanced AI analyzes your skills, learning goals, and preferences to connect you with the most compatible partners. No more endless searching—just perfect matches.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="border-2 hover:border-accent/50 transition-colors">
                    <CardContent className="p-4 flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Link to="/signup" className="pt-4">
              <Button variant="ai" size="lg" className="group">
                Try AI Matching Now
                <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeature;
