import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-collaboration.jpg";
import { FloatingSkillBubbles } from "@/components/FloatingSkillBubbles";
import { ParallaxSection } from "@/components/ParallaxSection";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { motion } from "framer-motion";

const Hero = () => {
  const skills = [
    'React', 'Python', 'UI/UX Design', 'Data Science', 
    'Machine Learning', 'JavaScript', 'Photography', 'Marketing',
    'Content Writing', 'Video Editing', 'Spanish', 'Public Speaking'
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 py-20 md:py-32">
      {/* Floating skill bubbles - behind content, non-interactive with text */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingSkillBubbles skills={skills} />
      </div>
      
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0"></div>
      
      <div className="container relative mx-auto px-4 z-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 w-fit backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">AI-Powered Skill Matching</span>
            </motion.div>
            
            <motion.h1 
              className="font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Swap Skills.{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                Grow Together.
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground md:text-xl max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Connect with mentors and peers worldwide. Exchange skills, collaborate, and unlock your potential with intelligent AI matching.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link to="/signup">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto group">
                  Join SkillSync
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/discover">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Mentors
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              className="flex items-center gap-8 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex flex-col">
                <span className="font-display text-3xl font-bold text-foreground">
                  <AnimatedCounter to={10} suffix="k+" />
                </span>
                <span className="text-sm text-muted-foreground">Active Users</span>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="font-display text-3xl font-bold text-foreground">
                  <AnimatedCounter to={50} suffix="k+" />
                </span>
                <span className="text-sm text-muted-foreground">Skills Swapped</span>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="font-display text-3xl font-bold text-foreground">
                  <AnimatedCounter to={95} suffix="%" />
                </span>
                <span className="text-sm text-muted-foreground">Satisfaction</span>
              </div>
            </motion.div>
          </motion.div>

          <ParallaxSection speed={0.3}>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div 
                className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              ></motion.div>
              <motion.img
                src={heroImage}
                alt="People collaborating and exchanging skills"
                className="relative rounded-3xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>
          </ParallaxSection>
        </div>
      </div>
    </section>
  );
};

export default Hero;
