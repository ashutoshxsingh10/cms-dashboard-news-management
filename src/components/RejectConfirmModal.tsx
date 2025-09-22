import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { motion } from 'motion/react';

interface RejectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  articleTitle: string;
}

export function RejectConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  articleTitle 
}: RejectConfirmModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
    setReason('');
    onClose();
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
            Reject Article?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground px-6">
            Are you sure you want to reject "{articleTitle.length > 50 ? `${articleTitle.substring(0, 50)}...` : articleTitle}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Reason for rejection (optional):
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a reason for rejecting this article..."
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
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Reject Article
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}