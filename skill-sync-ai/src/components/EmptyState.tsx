import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState = ({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10">
        {icon || <Sparkles className="h-8 w-8 text-primary" />}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="ai" onClick={onAction}>
          <Sparkles className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
