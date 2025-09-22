import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Archive, AlertTriangle } from 'lucide-react';

interface RoundupArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  roundupData: {
    name: string;
    description: string;
    type: string;
    tags: string[];
  };
  articleCount: number;
}

export function RoundupArchiveModal({
  isOpen,
  onClose,
  onConfirm,
  roundupData,
  articleCount
}: RoundupArchiveModalProps) {
  const [reason, setReason] = useState('');
  const [isArchiving, setIsArchiving] = useState(false);

  const handleConfirm = async () => {
    setIsArchiving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onConfirm(reason);
    setIsArchiving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archive Roundup
          </DialogTitle>
          <DialogDescription>
            This will permanently archive the roundup and prevent it from being published. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning */}
          <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">This action cannot be undone</p>
              <p>The roundup will be moved to archives and won't be published.</p>
            </div>
          </div>

          {/* Roundup Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">{roundupData.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{roundupData.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{articleCount} articles selected</span>
              <span>•</span>
              <span className="capitalize">{roundupData.type.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <Label htmlFor="reason">Reason for archiving (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Content no longer relevant, duplicate content, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isArchiving}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isArchiving}
            variant="destructive"
          >
            {isArchiving ? 'Archiving...' : 'Archive Roundup'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}