import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertTriangle, Pause, X, Play, Archive, Clock, RotateCcw } from "lucide-react";

interface StoryActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'pause' | 'end' | 'resume' | 'archive' | 'extend' | 'restore';
  storyTitle: string;
  eventsCount: number;
}

export function StoryActionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  action, 
  storyTitle,
  eventsCount 
}: StoryActionModalProps) {
  const getActionConfig = () => {
    switch (action) {
      case 'end':
        return {
          title: "End Story",
          icon: <X className="h-5 w-5 text-destructive" />,
          description: "Are you sure you want to end this story? This action cannot be undone.",
          warning: "Once publishing ends, this story will not be visible to the users, and it will move to Expired sub tab. All associated events and performance data will be preserved for reporting purposes.",
          confirmText: "End Story",
          confirmVariant: "destructive" as const,
          cancelText: "Keep Live"
        };
        
      case 'pause':
        return {
          title: "Pause Story",
          icon: <Pause className="h-5 w-5 text-orange-500" />,
          description: "Are you sure you want to pause this story?",
          warning: "When paused, this story will not be visible to users until you resume it. You can resume it at any time from the paused status.",
          confirmText: "Pause Story",
          confirmVariant: "secondary" as const,
          cancelText: "Keep Live"
        };
        
      case 'resume':
        return {
          title: "Resume Story",
          icon: <Play className="h-5 w-5 text-green-600" />,
          description: "Are you sure you want to resume this story?",
          warning: "When resumed, this story will become live and visible to users. It will move back to the Live sub tab.",
          confirmText: "Resume Story",
          confirmVariant: "default" as const,
          cancelText: "Keep Paused"
        };
        
      case 'archive':
        return {
          title: "Archive Story",
          icon: <Archive className="h-5 w-5 text-gray-600" />,
          description: "Are you sure you want to archive this story?",
          warning: "Archived stories are moved to the archive section and are no longer active. You can restore them later if needed.",
          confirmText: "Archive Story",
          confirmVariant: "secondary" as const,
          cancelText: "Keep Active"
        };
        
      case 'extend':
        return {
          title: "Extend Story",
          icon: <Clock className="h-5 w-5 text-blue-600" />,
          description: "Are you sure you want to extend this story?",
          warning: "Extending the story will make it live again with a new expiry time. It will move back to the Live sub tab.",
          confirmText: "Extend Story",
          confirmVariant: "default" as const,
          cancelText: "Keep Expired"
        };
        
      case 'restore':
        return {
          title: "Restore Story",
          icon: <RotateCcw className="h-5 w-5 text-blue-600" />,
          description: "Are you sure you want to restore this story from archive?",
          warning: "Restored stories will be moved back to active status. You can choose to make them live or keep them paused.",
          confirmText: "Restore Story",
          confirmVariant: "default" as const,
          cancelText: "Keep Archived"
        };
        
      default:
        return {
          title: "Confirm Action",
          icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
          description: "Are you sure you want to perform this action?",
          warning: "Please confirm your action.",
          confirmText: "Confirm",
          confirmVariant: "default" as const,
          cancelText: "Cancel"
        };
    }
  };

  const config = getActionConfig();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            {config.icon}
            <DialogTitle className="text-xl">{config.title}</DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Story Info */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Story:</span>
              <span className="font-medium">{storyTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Events:</span>
              <span className="font-medium">{eventsCount} events</span>
            </div>
          </div>

          {/* Warning Message */}
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-800">Important</p>
              <p className="text-sm text-amber-700 leading-relaxed">
                {config.warning}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            {config.cancelText}
          </Button>
          <Button variant={config.confirmVariant} onClick={onConfirm}>
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}