import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

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
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-glow border-accent/20">
      {/* AI Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-accent/20">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-accent to-primary text-white font-semibold">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base text-foreground">{name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-xs font-medium text-accent">AI Match</span>
            </div>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 shadow-sm">
          {compatibility}% Match
        </Badge>
      </CardHeader>
      
      <CardContent className="relative pt-0 space-y-2">
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
      </CardContent>
      
      <CardFooter className="relative">
        <Button 
          variant="ai" 
          className="w-full" 
          size="sm"
          onClick={onConnect}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Connect Now
        </Button>
      </CardFooter>
    </Card>
  );
};
