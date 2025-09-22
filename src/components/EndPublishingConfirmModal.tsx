import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { motion } from 'motion/react';

interface EndPublishingConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  articleTitle: string;
}

export function EndPublishingConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  articleTitle 
}: EndPublishingConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center pb-4">
          <motion.div 
            className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </motion.div>
          <DialogTitle className="text-lg">
            End Article Publishing?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground px-6">
            "{articleTitle.length > 50 ? `${articleTitle.substring(0, 50)}...` : articleTitle}" will be permanently removed from publication and cannot be resumed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
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
              className="bg-red-600 text-white hover:bg-red-700"
            >
              End Publishing
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}