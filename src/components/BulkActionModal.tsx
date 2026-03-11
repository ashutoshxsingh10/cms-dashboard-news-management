import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconComponent } from '../lib/icons';

interface BulkActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (text?: string) => void;
  articleCount: number;
  icon: IconComponent;
  iconClassName: string;
  iconBgClassName: string;
  title: string;
  description: string;
  textareaLabel: string;
  textareaPlaceholder: string;
  confirmLabel: string;
  confirmClassName: string;
}

export function BulkActionModal({
  isOpen,
  onClose,
  onConfirm,
  articleCount,
  icon,
  iconClassName,
  iconBgClassName,
  title,
  description,
  textareaLabel,
  textareaPlaceholder,
  confirmLabel,
  confirmClassName,
}: BulkActionModalProps) {
  const [text, setText] = useState('');

  const handleConfirm = () => {
    onConfirm(text.trim() || undefined);
    setText('');
  };

  const handleClose = () => {
    setText('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 gap-0 bg-white">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgClassName}`}>
              <HugeiconsIcon icon={icon} className={`h-5 w-5 ${iconClassName}`} />
            </div>
            <div>
              <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulk-action-text" className="text-sm font-medium">
              {textareaLabel}
            </Label>
            <Textarea
              id="bulk-action-text"
              placeholder={textareaPlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className={confirmClassName}>
            {confirmLabel.replace('{count}', String(articleCount))}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
