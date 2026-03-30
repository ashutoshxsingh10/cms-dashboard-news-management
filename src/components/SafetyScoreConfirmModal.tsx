import { HugeiconsIcon } from '@hugeicons/react';
import { Shield01Icon } from '@hugeicons/core-free-icons';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { getSafetyTierInfo } from '../utils/safetyScore';

interface SafetyScoreConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newScore: number;
  originalScore: number;
}

export function SafetyScoreConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  newScore,
  originalScore
}: SafetyScoreConfirmModalProps) {

  const newTierInfo = getSafetyTierInfo(newScore);
  const originalTierInfo = getSafetyTierInfo(originalScore);
  const IconComponent = newTierInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Shield01Icon} className="h-5 w-5 text-primary" />
            Update Content Safety Rating
          </DialogTitle>
          <DialogDescription className="text-left">
            You are about to change the content safety rating for this article.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* New Rating Display */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-sm font-medium">New Safety Rating:</span>
            <div 
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${newTierInfo.textColor}`}
              style={{ 
                borderColor: newTierInfo.borderColor,
                backgroundColor: newTierInfo.backgroundColor
              }}
            >
              <HugeiconsIcon icon={IconComponent} className="h-4 w-4" />
              <span className="text-sm font-medium">{newTierInfo.name}</span>
            </div>
          </div>

          {/* Information */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              • The original auto-generated rating was <strong>{originalTierInfo.name}</strong>
            </p>
            <p>
              • You can change this rating again anytime by clicking on the safety rating tag
            </p>
            <p>
              • This change will be reflected in both the article details and the news card
            </p>
            <p className="text-xs italic pt-2 border-t">
              <strong>{newTierInfo.name}:</strong> {newTierInfo.description}
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Update Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}