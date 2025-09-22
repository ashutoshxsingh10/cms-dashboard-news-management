import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

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
  
  const getSafetyTierInfo = (tier: number) => {
    switch (tier) {
      case 5:
        return {
          name: 'Publish Ready',
          textColor: 'text-green-700',
          borderColor: '#16a34a',
          backgroundColor: 'rgba(220, 252, 231, 0.5)',
          icon: CheckCircle,
          description: 'Content is fully ready for immediate publication'
        };
      case 4:
        return {
          name: 'Good to Publish',
          textColor: 'text-green-600',
          borderColor: '#059669',
          backgroundColor: 'rgba(220, 252, 231, 0.3)',
          icon: CheckCircle,
          description: 'Content is suitable for publication with minimal concerns'
        };
      case 3:
        return {
          name: 'Review First',
          textColor: 'text-amber-700',
          borderColor: '#d97706',
          backgroundColor: 'rgba(254, 243, 199, 0.5)',
          icon: Shield,
          description: 'Content should be reviewed before publishing'
        };
      case 2:
        return {
          name: 'Needs Work',
          textColor: 'text-orange-700',
          borderColor: '#ea580c',
          backgroundColor: 'rgba(254, 215, 170, 0.5)',
          icon: AlertTriangle,
          description: 'Content requires significant editing before publication'
        };
      case 1:
      default:
        return {
          name: 'Not Suitable',
          textColor: 'text-red-700',
          borderColor: '#dc2626',
          backgroundColor: 'rgba(254, 202, 202, 0.5)',
          icon: AlertTriangle,
          description: 'Content is not suitable for publication'
        };
    }
  };

  const newTierInfo = getSafetyTierInfo(newScore);
  const originalTierInfo = getSafetyTierInfo(originalScore);
  const IconComponent = newTierInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
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
              className={`flex items-center gap-2 rounded-[8px] border px-3 py-2 ${newTierInfo.textColor}`}
              style={{ 
                borderColor: newTierInfo.borderColor,
                backgroundColor: newTierInfo.backgroundColor
              }}
            >
              <IconComponent className="h-4 w-4" />
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
            style={{
              backgroundColor: '#5767F2',
              borderColor: '#2533B0',
              color: 'white'
            }}
            className="border hover:opacity-90"
          >
            Update Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}