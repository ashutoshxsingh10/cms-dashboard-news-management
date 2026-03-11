import { Alert02Icon } from '@hugeicons/core-free-icons';
import { BulkActionModal } from './BulkActionModal';

interface BulkRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  articleCount: number;
}

export function BulkRejectModal({ isOpen, onClose, onConfirm, articleCount }: BulkRejectModalProps) {
  return (
    <BulkActionModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      articleCount={articleCount}
      icon={Alert02Icon}
      iconClassName="text-red-600"
      iconBgClassName="bg-red-50"
      title="Reject Articles"
      description={`You're about to reject ${articleCount} article${articleCount > 1 ? 's' : ''}. This action cannot be undone.`}
      textareaLabel="Reason for rejection (optional)"
      textareaPlaceholder="Provide a reason for rejecting these articles..."
      confirmLabel={`Reject ${articleCount} Article${articleCount > 1 ? 's' : ''}`}
      confirmClassName="bg-red-600 hover:bg-red-700 text-white"
    />
  );
}
