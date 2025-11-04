import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Sparkles, MessageSquare, Star } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Share your skills and what you want to learn. Build a profile that showcases your expertise.",
    gradient: "from-primary to-primary-glow",
  },
  {
    icon: Sparkles,
    title: "AI Finds Your Match",
    description: "Our intelligent algorithm connects you with the perfect skill exchange partners based on compatibility.",
    gradient: "from-accent to-primary",
  },
  {
    icon: MessageSquare,
    title: "Start Collaborating",
    description: "Connect, chat, and schedule sessions with your matched partners to exchange knowledge.",
    gradient: "from-secondary to-primary",
  },
  {
    icon: Star,
    title: "Grow Together",
    description: "Complete swaps, leave reviews, and build your reputation while learning valuable new skills.",
    gradient: "from-primary to-secondary",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl font-bold mb-4 md:text-5xl">
            How It <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to start your skill exchange journey
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index} 
                className="relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted/5 font-display">
                    {index + 1}
                  </div>
                  
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-md group-hover:shadow-glow transition-shadow`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="font-display text-xl font-semibold">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
