import { Eye } from 'lucide-react';
import { BulkActionModal } from './BulkActionModal';

interface BulkAddToReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  articleCount: number;
}

export function BulkAddToReviewModal({ isOpen, onClose, onConfirm, articleCount }: BulkAddToReviewModalProps) {
  return (
    <BulkActionModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      articleCount={articleCount}
      icon={Eye}
      iconClassName="text-blue-600"
      iconBgClassName="bg-blue-50"
      title="Add to Review"
      description={`Moving ${articleCount} article${articleCount > 1 ? 's' : ''} to review queue for editorial assessment.`}
      textareaLabel="Review notes (optional)"
      textareaPlaceholder="Add notes for the review team..."
      confirmLabel={`Add ${articleCount} to Review`}
      confirmClassName="bg-[#5767F2] hover:bg-[#2533B0] text-white"
    />
  );
}
