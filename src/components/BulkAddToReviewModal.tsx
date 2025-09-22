import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useState } from 'react';
import { Eye } from 'lucide-react';

interface BulkAddToReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  articleCount: number;
}

export function BulkAddToReviewModal({
  isOpen,
  onClose,
  onConfirm,
  articleCount
}: BulkAddToReviewModalProps) {
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(notes.trim() || undefined);
    setNotes('');
  };

  const handleClose = () => {
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 gap-0 bg-white">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-medium">Add to Review</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Moving {articleCount} article{articleCount > 1 ? 's' : ''} to review queue for editorial assessment.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Review notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add notes for the review team..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t">
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-[#5767F2] hover:bg-[#2533B0] text-white"
          >
            Add {articleCount} to Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}