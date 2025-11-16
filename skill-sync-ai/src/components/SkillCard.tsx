import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/GlassCard";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface SkillCardProps {
  name: string;
  avatar?: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  onClick?: () => void;
}

export const SkillCard = ({ name, avatar, skills, rating, reviewCount, onClick }: SkillCardProps) => {
  return (
    <GlassCard 
      hover3D
      glowColor="primary"
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-1">
            <h3 className="font-semibold text-base text-foreground">{name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span className="text-sm text-foreground font-medium">{rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Badge 
                variant="secondary"
                className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/20"
              >
                {skill}
              </Badge>
            </motion.div>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="text-muted-foreground">
              +{skills.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
