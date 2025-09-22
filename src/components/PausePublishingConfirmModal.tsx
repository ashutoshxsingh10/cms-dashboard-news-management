import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { motion } from 'motion/react';

interface PausePublishingConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  articleTitle: string;
}

export function PausePublishingConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  articleTitle 
}: PausePublishingConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center pb-4">
          <motion.div 
            className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </motion.div>
          <DialogTitle className="text-lg">
            Pause Article Publishing?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground px-6">
            "{articleTitle.length > 50 ? `${articleTitle.substring(0, 50)}...` : articleTitle}" will be temporarily hidden from users but can be resumed later.
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
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              Pause Publishing
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}