import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Zap, Target } from "lucide-react";
import { SkillConnectionVisualizer } from "@/components/SkillConnectionVisualizer";
import { ParallaxSection, ScrollReveal } from "@/components/ParallaxSection";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
          <ParallaxSection speed={0.3} className="order-2 lg:order-1">
            <div className="relative">
              {/* Animated Skill Connection Visualizer */}
              <SkillConnectionVisualizer />
            </div>
          </ParallaxSection>

          <div className="flex flex-col gap-6 order-1 lg:order-2">
            <ScrollReveal>
              <Badge className="w-fit bg-accent/10 text-accent border-accent/20">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <h2 className="font-display text-4xl font-bold md:text-5xl">
                Your Perfect Skill Match is{" "}
                <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                  One Click Away
                </span>
              </h2>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <p className="text-lg text-muted-foreground">
                Our advanced AI analyzes your skills, learning goals, and preferences to connect you with the most compatible partners. No more endless searching—just perfect matches.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-2 hover:border-accent/50 transition-colors">
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
                  </motion.div>
                );
              })}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <Link to="/signup" className="pt-4">
                <Button variant="ai" size="lg" className="group">
                  Try AI Matching Now
                  <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                </Button>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeature;
