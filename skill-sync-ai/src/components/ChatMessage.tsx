import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  timestamp: string;
  isOwn: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export const ChatMessage = ({ 
  message, 
  timestamp, 
  isOwn, 
  senderName = "User",
  senderAvatar 
}: ChatMessageProps) => {
  return (
    <div className={cn("flex gap-3 mb-4 animate-fade-in", isOwn && "flex-row-reverse")}>
      {!isOwn && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
            {senderName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("flex flex-col max-w-[70%]", isOwn && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 shadow-sm",
            isOwn
              ? "bg-gradient-to-r from-primary to-secondary text-white"
              : "bg-muted text-foreground"
          )}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-2">{timestamp}</span>
      </div>
    </div>
  );
};
