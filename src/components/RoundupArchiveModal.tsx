import { ArchiveModal } from './ArchiveModal';

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
  return (
    <ArchiveModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      entityType="roundup"
      entityName={roundupData.name}
      entityDescription={roundupData.description}
      articleCount={articleCount}
      detailItems={[
        { label: 'Type', value: roundupData.type.replace('-', ' ') },
      ]}
      tags={roundupData.tags}
    />
  );
}
