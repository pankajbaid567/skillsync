import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Repeat, MessageSquare } from "lucide-react";

interface UserCardProps {
    userId: number;
    name: string;
    avatar?: string;
    bio?: string;
    location?: string;
    rating?: number;
    reviewCount?: number;
    skillsOffered?: string[];
    skillsWanted?: string[];
    completedSwaps?: number;
    onMessage?: () => void;
    onSwapRequest?: () => void;
    showActions?: boolean;
}

export const UserCard = ({
    userId,
    name,
    avatar,
    bio,
    location,
    rating = 0,
    reviewCount = 0,
    skillsOffered = [],
    skillsWanted = [],
    completedSwaps = 0,
    onMessage,
    onSwapRequest,
    showActions = true,
}: UserCardProps) => {
    const navigate = useNavigate();

    const userInitials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const handleViewProfile = () => {
        navigate(`/profile/${userId}`);
    };

    return (
        <Card className="border-border/40 shadow-md rounded-2xl hover:shadow-lg transition-all overflow-hidden group">
            <CardContent className="p-0">
                {/* Header with gradient */}
                <div className="h-20 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />

                <div className="px-6 pb-6">
                    {/* Avatar and basic info */}
                    <div className="flex items-start gap-4 -mt-10 mb-4">
                        <Avatar
                            className="h-20 w-20 ring-4 ring-background cursor-pointer hover:scale-105 transition-transform"
                            onClick={handleViewProfile}
                        >
                            <AvatarImage src={avatar} alt={name} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 mt-12">
                            <h3
                                className="font-semibold text-lg cursor-pointer hover:text-primary transition-colors"
                                onClick={handleViewProfile}
                            >
                                {name}
                            </h3>
                            {location && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3" />
                                    {location}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                        {rating > 0 && (
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-warning text-warning" />
                                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">({reviewCount})</span>
                            </div>
                        )}
                        {completedSwaps > 0 && (
                            <div className="flex items-center gap-1">
                                <Repeat className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">{completedSwaps}</span>
                                <span className="text-xs text-muted-foreground">swaps</span>
                            </div>
                        )}
                    </div>

                    {/* Bio */}
                    {bio && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {bio}
                        </p>
                    )}

                    {/* Skills */}
                    <div className="space-y-3 mb-4">
                        {skillsOffered.length > 0 && (
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1.5">Offers</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {skillsOffered.slice(0, 3).map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                    {skillsOffered.length > 3 && (
                                        <Badge
                                            variant="secondary"
                                            className="bg-muted text-muted-foreground text-xs px-2 py-0.5"
                                        >
                                            +{skillsOffered.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        {skillsWanted.length > 0 && (
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1.5">Wants</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {skillsWanted.slice(0, 3).map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-secondary/10 text-secondary border-secondary/20 text-xs px-2 py-0.5"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                    {skillsWanted.length > 3 && (
                                        <Badge
                                            variant="secondary"
                                            className="bg-muted text-muted-foreground text-xs px-2 py-0.5"
                                        >
                                            +{skillsWanted.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {showActions && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 rounded-xl"
                                onClick={onMessage}
                            >
                                <MessageSquare className="h-4 w-4 mr-1.5" />
                                Message
                            </Button>
                            <Button
                                variant="gradient"
                                size="sm"
                                className="flex-1 rounded-xl"
                                onClick={onSwapRequest}
                            >
                                <Repeat className="h-4 w-4 mr-1.5" />
                                Swap
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
