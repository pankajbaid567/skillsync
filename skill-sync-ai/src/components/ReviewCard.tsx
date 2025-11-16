import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlassCard } from "@/components/GlassCard";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface ReviewCardProps {
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export const ReviewCard = ({ 
  reviewerName, 
  reviewerAvatar, 
  rating, 
  comment, 
  date 
}: ReviewCardProps) => {
  return (
    <GlassCard className="overflow-hidden" glowColor="blue">
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={reviewerAvatar} alt={reviewerName} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
              {reviewerName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-foreground">{reviewerName}</h4>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: star * 0.05, type: "spring" }}
                >
                  <Star
                    className={`h-3 w-3 ${
                      star <= rating
                        ? "fill-warning text-warning"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </div>
      </div>
      <motion.p 
        className="text-sm text-muted-foreground leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {comment}
      </motion.p>
    </GlassCard>
  );
};
