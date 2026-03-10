import { ArchiveModal } from './ArchiveModal';

interface StoryData {
  headline: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
}

interface StoryArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  storyData: StoryData;
  articleCount: number;
}

export function StoryArchiveModal({
  isOpen,
  onClose,
  onConfirm,
  storyData,
  articleCount
}: StoryArchiveModalProps) {
  return (
    <ArchiveModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      entityType="story"
      entityName={storyData.headline}
      articleCount={articleCount}
      detailItems={[
        { label: 'Category', value: `${storyData.category} → ${storyData.subcategory}` },
      ]}
      tags={storyData.tags}
    />
  );
}
