import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { NewsCard } from './NewsCard';
import { NewsDetail } from './NewsDetail';
import { StoryActionModal } from './StoryActionModal';
import { ScrollArea } from './ui/scroll-area';

import { NewsStory } from '../data/mockNewsStories';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  source: string;
  sourceIcon: string;
  ingestionTime: string;
  contentType: 'article' | 'video';
  safetyScore: number;
  originalSafetyScore?: number;
  newsType: string;
  subType: string[];
  imageUrl: string;
  status: 'pending' | 'review' | 'rejected' | 'published';
  publishStatus?: 'live' | 'paused' | 'expired';
  tags: string[];
  publishDate?: string;
  isBreaking?: boolean;
}

interface NewsStoryDetailProps {
  story: NewsStory;
  allArticles: NewsArticle[];
  selectedArticle: NewsArticle | null;
  onArticleSelect: (article: NewsArticle) => void;
  onBack: () => void;
  onArticleUpdate: (articleId: string, updates: Partial<NewsArticle>) => void;
  onStatusChange: (articleId: string, status: NewsArticle['status']) => void;
  onStoryStatusChange?: (storyId: string, status: NewsStory['status']) => void;
}

// Utility function to format date for group headers
function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if it's today
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  // Check if it's yesterday
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // For other dates, format as "Mon, 22 Jan"
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

// Utility function to group articles by date
function groupArticlesByDate(articles: NewsArticle[]): Record<string, NewsArticle[]> {
  return articles.reduce((acc, article) => {
    const dateHeader = formatDateHeader(article.ingestionTime);
    if (!acc[dateHeader]) {
      acc[dateHeader] = [];
    }
    acc[dateHeader].push(article);
    return acc;
  }, {} as Record<string, NewsArticle[]>);
}

const statusConfig = {
  live: {
    label: 'Live',
    dotColor: 'bg-green-500',
    pillClass: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200'
  },
  expired: {
    label: 'Expired',
    dotColor: 'bg-red-500',
    pillClass: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200'
  },
  paused: {
    label: 'Paused',
    dotColor: 'bg-amber-500',
    pillClass: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200'
  },
  archived: {
    label: 'Archived',
    dotColor: 'bg-slate-500',
    pillClass: 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200'
  }
};

export function NewsStoryDetail({
  story,
  allArticles,
  selectedArticle,
  onArticleSelect,
  onBack,
  onArticleUpdate,
  onStatusChange,
  onStoryStatusChange
}: NewsStoryDetailProps) {
  // Modal state
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'pause' | 'end' | 'resume' | 'archive' | 'extend' | 'restore' | null>(null);
  
  // Get articles that belong to this story
  const storyArticles = useMemo(() => {
    // Handle cases where articleIds might be undefined or empty
    if (!story.articleIds || !Array.isArray(story.articleIds)) {
      return [];
    }
    
    return allArticles.filter(article => 
      story.articleIds.includes(article.id) && 
      article.status === 'published'
    );
  }, [allArticles, story.articleIds]);

  // Group articles by date
  const articlesByDate = useMemo(() => {
    return groupArticlesByDate(storyArticles);
  }, [storyArticles]);

  const statusInfo = statusConfig[story.status];

  // Handle action button clicks
  const handleActionClick = (action: 'pause' | 'end' | 'resume' | 'archive' | 'extend' | 'restore') => {
    setPendingAction(action);
    setIsActionModalOpen(true);
  };

  // Handle action confirmation
  const handleActionConfirm = () => {
    if (pendingAction && onStoryStatusChange) {
      let newStatus: 'live' | 'paused' | 'expired' | 'archived';
      
      switch (pendingAction) {
        case 'pause':
          newStatus = 'paused';
          break;
        case 'end':
          newStatus = 'expired';
          break;
        case 'resume':
          newStatus = 'live';
          break;
        case 'archive':
          newStatus = 'archived';
          break;
        case 'extend':
          newStatus = 'live';
          break;
        case 'restore':
          newStatus = 'paused'; // Restore to paused state initially
          break;
        default:
          return;
      }
      
      onStoryStatusChange(story.id, newStatus);
      
      // Show success toast
      const actionMessages = {
        pause: { title: "Story paused successfully!", description: "The story is no longer visible to users." },
        end: { title: "Story ended successfully!", description: "The story has been moved to expired status." },
        resume: { title: "Story resumed successfully!", description: "The story is now live and visible to users." },
        archive: { title: "Story archived successfully!", description: "The story has been moved to archive." },
        extend: { title: "Story extended successfully!", description: "The story is now live with extended expiry." },
        restore: { title: "Story restored successfully!", description: "The story has been restored from archive." }
      };
      
      const message = actionMessages[pendingAction];
      if (message) {
        import('sonner@2.0.3').then(({ toast }) => {
          toast.success(message.title, {
            description: message.description,
            duration: 3000,
          });
        });
      }
    }
    setIsActionModalOpen(false);
    setPendingAction(null);
  };

  // Handle action cancellation
  const handleActionCancel = () => {
    setIsActionModalOpen(false);
    setPendingAction(null);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 border-b bg-white">
        <div className="px-6 pt-6">
          {/* Back Button and Title Row */}
          <div className="flex items-start gap-4 mb-4">
            <Button
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="mt-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold truncate">{story.title}</h1>
                <div className={`rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1 ${statusInfo.pillClass}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                  {statusInfo.label}
                </div>
              </div>
              <p className="text-muted-foreground text-sm mt-1">{story.subtitle}</p>
            </div>
          </div>

          {/* Story Metadata - Aligned with headline */}
          <div className="ml-12">
            <div className="flex items-center gap-8 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Published:</span>
                <span className="font-medium">
                  {story.publishedTime} {story.publishedTimezone} • {story.publishedDate}
                </span>
              </div>
              {story.expiresDate && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium">
                    {story.expiresTime} {story.expiresTimezone} • {story.expiresDate}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Events:</span>
                <span className="font-medium">{storyArticles.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Article List Column */}
        <div className="w-[35vw] min-w-[400px] max-w-[600px] border-r border-border flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 h-full">
            <div className="relative w-full">
              {/* Articles without date grouping */}
              <div className="space-y-1 w-full pt-4">
                {storyArticles.map((article) => (
                  <div key={article.id} className="w-full overflow-hidden">
                    <NewsCard
                      article={article}
                      isSelected={selectedArticle?.id === article.id}
                      onClick={() => onArticleSelect(article)}
                      hideStatusBadges={true}
                    />
                  </div>
                ))}
              </div>
              
              {/* No articles message */}
              {storyArticles.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No events found in this story</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Article Detail Column */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <NewsDetail 
            article={selectedArticle} 
            onArticleUpdate={onArticleUpdate}
            onStatusChange={onStatusChange}
            selectedArticleIds={[]}
            isBulkMode={false}
            onBulkStatusChange={() => {}}
            onCancelSelection={() => {}}
            activeSubTab="published"
            isRoundupDetail={true}
            roundupStatus={story.status}
            isReadOnly={true}
            onRoundupActionClick={handleActionClick}
          />
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {pendingAction && (
        <StoryActionModal
          isOpen={isActionModalOpen}
          onClose={handleActionCancel}
          onConfirm={handleActionConfirm}
          action={pendingAction}
          storyTitle={story.title}
          eventsCount={storyArticles.length}
        />
      )}
    </div>
  );
}