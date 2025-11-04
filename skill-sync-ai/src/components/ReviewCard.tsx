import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

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
    <Card className="transition-all duration-300 hover:shadow-md border-border/40">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={reviewerAvatar} alt={reviewerName} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
            {reviewerName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-foreground">{reviewerName}</h4>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= rating
                      ? "fill-warning text-warning"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">{comment}</p>
      </CardContent>
    </Card>
  );
};
