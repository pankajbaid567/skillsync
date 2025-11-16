import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AIMatchCardProps {
  name: string;
  avatar?: string;
  skillOffered: string;
  skillWanted: string;
  compatibility: number;
  onConnect?: () => void;
}

export const AIMatchCard = ({ 
  name, 
  avatar, 
  skillOffered, 
  skillWanted, 
  compatibility, 
  onConnect 
}: AIMatchCardProps) => {
  return (
    <GlassCard hover3D glowColor="accent" className="group relative overflow-hidden">
      {/* AI Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Avatar className="h-12 w-12 ring-2 ring-accent/20">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="bg-gradient-to-br from-accent to-primary text-white font-semibold">
                  {name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div>
              <h3 className="font-semibold text-base text-foreground">{name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Sparkles className="h-3 w-3 text-accent animate-pulse" />
                <span className="text-xs font-medium text-accent">AI Match</span>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 shadow-lg">
              {compatibility}% Match
            </Badge>
          </motion.div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Offers:</span>
            <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
              {skillOffered}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Wants:</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {skillWanted}
            </Badge>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="ai" 
            className="w-full" 
            size="sm"
            onClick={onConnect}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Connect Now
          </Button>
        </motion.div>
      </div>
    </GlassCard>
  );
};
