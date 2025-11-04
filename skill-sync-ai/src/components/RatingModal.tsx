import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerName: string;
  partnerAvatar?: string;
  onSubmit?: (rating: number, comment: string) => void;
}

export const RatingModal = ({
  open,
  onOpenChange,
  partnerName,
  partnerAvatar,
  onSubmit,
}: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsLoading(true);
    await onSubmit?.(rating, comment);
    setIsLoading(false);
    onOpenChange(false);
    // Reset form
    setRating(0);
    setComment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <DialogDescription>
            Share your feedback about {partnerName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4 space-y-6">
          <Avatar className="h-16 w-16 ring-4 ring-primary/10">
            <AvatarImage src={partnerAvatar} alt={partnerName} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-lg">
              {partnerName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-center gap-3 w-full">
            <Label className="text-sm font-medium">How was your skill swap?</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-warning text-warning"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full space-y-2">
            <Label htmlFor="comment" className="text-sm">
              Share your thoughts (optional)
            </Label>
            <Textarea
              id="comment"
              placeholder="What did you learn? How was the experience?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/500
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Skip
          </Button>
          <Button 
            variant="gradient" 
            onClick={handleSubmit} 
            disabled={rating === 0 || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
