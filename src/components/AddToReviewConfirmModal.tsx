import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { motion } from 'motion/react';

interface AddToReviewConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  articleTitle: string;
}

export function AddToReviewConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  articleTitle 
}: AddToReviewConfirmModalProps) {
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(notes.trim() || undefined);
    setNotes('');
    onClose();
  };

  const handleClose = () => {
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center pb-4">
          <motion.div 
            className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Eye className="h-6 w-6 text-amber-600" />
          </motion.div>
          <DialogTitle className="text-lg">
            Add to Review?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground px-6">
            Move "{articleTitle.length > 50 ? `${articleTitle.substring(0, 50)}...` : articleTitle}" to review queue?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Review notes (optional):
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about what needs to be reviewed..."
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="hover:bg-gray-50"
            >
              Cancel
            </Button>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleConfirm}
                className="bg-amber-600 text-white hover:bg-amber-700"
              >
                Add to Review
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}