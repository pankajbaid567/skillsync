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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Repeat } from "lucide-react";

interface SwapRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerName: string;
  partnerAvatar?: string;
  skillOffered: string;
  skillWanted: string;
  onConfirm?: () => void;
}

export const SwapRequestModal = ({
  open,
  onOpenChange,
  partnerName,
  partnerAvatar,
  skillOffered,
  skillWanted,
  onConfirm,
}: SwapRequestModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm?.();
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5 text-primary" />
            Request Skill Swap
          </DialogTitle>
          <DialogDescription>
            Confirm your skill swap with {partnerName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6 space-y-6">
          <Avatar className="h-20 w-20 ring-4 ring-primary/10">
            <AvatarImage src={partnerAvatar} alt={partnerName} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl">
              {partnerName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="w-full space-y-3 bg-muted/30 rounded-2xl p-4">
            <div>
              <Label className="text-xs text-muted-foreground">You'll teach</Label>
              <Badge className="mt-1 bg-primary/10 text-primary border-primary/20 text-sm">
                {skillOffered}
              </Badge>
            </div>
            
            <div className="flex justify-center">
              <Repeat className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">You'll learn</Label>
              <Badge className="mt-1 bg-secondary/10 text-secondary border-secondary/20 text-sm">
                {skillWanted}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            onClick={handleConfirm} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
