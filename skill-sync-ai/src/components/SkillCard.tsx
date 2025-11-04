import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

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
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/40"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-3">
        <Avatar className="h-12 w-12 ring-2 ring-primary/10">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-base text-foreground">{name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="text-sm text-foreground font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/20"
            >
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="text-muted-foreground">
              +{skills.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
