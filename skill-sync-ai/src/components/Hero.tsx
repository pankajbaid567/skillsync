import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-collaboration.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container relative mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 w-fit">
              <Sparkles className="h-4 w-4 text-primary animate-glow" />
              <span className="text-sm font-medium text-primary">AI-Powered Skill Matching</span>
            </div>
            
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Swap Skills.{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Grow Together.
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground md:text-xl max-w-xl">
              Connect with mentors and peers worldwide. Exchange skills, collaborate, and unlock your potential with intelligent AI matching.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/signup">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto group">
                  Join SkillSync
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Mentors
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-6">
              <div className="flex flex-col">
                <span className="font-display text-3xl font-bold text-foreground">10k+</span>
                <span className="text-sm text-muted-foreground">Active Users</span>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="font-display text-3xl font-bold text-foreground">50k+</span>
                <span className="text-sm text-muted-foreground">Skills Swapped</span>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="font-display text-3xl font-bold text-foreground">95%</span>
                <span className="text-sm text-muted-foreground">Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl"></div>
            <img
              src={heroImage}
              alt="People collaborating and exchanging skills"
              className="relative rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
