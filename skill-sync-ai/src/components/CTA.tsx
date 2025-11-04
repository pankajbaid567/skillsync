import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-10"></div>
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary animate-glow" />
            <span className="text-sm font-medium text-primary">Join 10,000+ Active Learners</span>
          </div>

          <h2 className="font-display text-4xl font-bold mb-6 md:text-5xl lg:text-6xl">
            Ready to Start Your{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Skill Exchange Journey?
            </span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Your next mentor might be one message away. Join SkillSync today and unlock unlimited learning potential through peer-to-peer collaboration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto group">
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Community
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free forever • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
