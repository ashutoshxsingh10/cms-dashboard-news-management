import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Archive, AlertTriangle } from "lucide-react";

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  entityType: 'story' | 'roundup';
  entityName: string;
  entityDescription?: string;
  articleCount: number;
  detailItems?: { label: string; value: string }[];
  tags?: string[];
}

export function ArchiveModal({
  isOpen,
  onClose,
  onConfirm,
  entityType,
  entityName,
  entityDescription,
  articleCount,
  detailItems = [],
  tags = [],
}: ArchiveModalProps) {
  const [reason, setReason] = useState('');

  const entityLabel = entityType === 'story' ? 'News Story' : 'Roundup';

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-orange-600" />
            Archive {entityLabel}
          </DialogTitle>
          <DialogDescription>
            This will archive "{entityName}" and remove it from active {entityType === 'story' ? 'stories' : 'roundups'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-orange-900">{entityLabel} will be archived</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• The {entityType} will be moved to archived status</li>
                  <li>• All {articleCount} selected articles will be unlinked</li>
                  <li>• The {entityType} can be restored from archives later</li>
                  <li>• No content will be permanently deleted</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Entity Details */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">{entityLabel} Details</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Title: "{entityName}"</li>
              {entityDescription && <li>• Description: {entityDescription}</li>}
              {detailItems.map((item, i) => (
                <li key={i}>• {item.label}: {item.value}</li>
              ))}
              <li>• Selected Articles: {articleCount}</li>
              {tags.length > 0 && (
                <li>• Tags: {tags.map(tag => `#${tag}`).join(', ')}</li>
              )}
            </ul>
          </div>

          {/* Archive Reason */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Archive Reason <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Why is this ${entityType} being archived? (e.g., content no longer relevant, superseded by newer ${entityType}, etc.)`}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Provide context for future reference</span>
              <span>{reason.length}/500</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="destructive"
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive {entityLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
