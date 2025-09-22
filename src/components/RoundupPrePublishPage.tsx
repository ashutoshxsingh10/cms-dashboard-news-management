import { useState } from 'react';
import { Button } from "./ui/button";
import { NewsCard } from './NewsCard';
import { NewsDetail } from './NewsDetail';
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from './ui/separator';
import { ArrowLeft, Edit3, Archive, Send, Clock, Calendar, Tag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SafetyScoreTag } from './SafetyScoreTag';

interface RoundupPrePublishPageProps {
  roundupData: {
    name: string;
    description: string;
    type: string;
    tags: string[];
  };
  selectedArticles: Array<{
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
  }>;
  onBack: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onPublish: () => void;
}

export function RoundupPrePublishPage({
  roundupData,
  selectedArticles,
  onBack,
  onEdit,
  onArchive,
  onPublish
}: RoundupPrePublishPageProps) {
  const [selectedArticle, setSelectedArticle] = useState<typeof selectedArticles[0] | null>(
    selectedArticles.length > 0 ? selectedArticles[0] : null
  );

  // Handle roundup actions from NewsDetail component
  const handleRoundupAction = (action: 'pause' | 'end' | 'resume' | 'archive' | 'extend' | 'restore' | 'publish') => {
    switch (action) {
      case 'archive':
        onArchive();
        break;
      case 'publish':
        onPublish();
        break;
      // Add other actions if needed in future
      default:
        console.log(`Action ${action} not handled in pre-publish mode`);
    }
  };

  const typeLabels = {
    breaking: 'Breaking News',
    trending: 'Trending Stories', 
    daily: 'Daily Digest',
    weekly: 'Weekly Review',
    regional: 'Regional Update'
  };

  // Get main image from first article
  const mainImageUrl = selectedArticles[0]?.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1400&auto=format&fit=crop';





  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 border-b bg-white">
        <div className="px-6 pt-6">
          {/* Title Row with Back Button */}
          <div className="flex items-start gap-4 mb-4">
            <Button
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="mt-1 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-medium">{roundupData.name}</h1>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                  Pre-publish
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {typeLabels[roundupData.type as keyof typeof typeLabels]} • {selectedArticles.length} articles selected
              </p>
            </div>
          </div>
        </div>

        {/* Edit Action Button Row */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center">
            <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Selection
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Like News Publishing Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Column - Article List (35% width like News Publishing) */}
        <div className="w-[35vw] min-w-[400px] max-w-[600px] border-r border-border flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 h-full">
            <div className="relative w-full">
              {/* Articles List */}
              <div className="space-y-1 w-full pt-4 pb-4">
                {selectedArticles.map((article, index) => (
                  <div key={article.id} className="w-full overflow-hidden">
                    <NewsCard
                      article={article}
                      isSelected={selectedArticle?.id === article.id}
                      onClick={() => setSelectedArticle(article)}
                      showCheckbox={false}
                    />
                  </div>
                ))}
              </div>
              
              {/* No articles message */}
              {selectedArticles.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No articles found in this round-up</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Right Column - Article Details (Like News Publishing) */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <NewsDetail 
            article={selectedArticle} 
            onArticleUpdate={() => {}} // No-op for pre-publish view
            onStatusChange={() => {}} // No-op for pre-publish view
            selectedArticleIds={[]}
            isBulkMode={false}
            onBulkStatusChange={() => {}}
            onCancelSelection={() => {}}
            activeSubTab="published"
            isRoundupDetail={true}
            roundupStatus="live" // Use live to show read-only mode
            isReadOnly={true}
            onRoundupActionClick={handleRoundupAction}
          />
        </div>
      </div>


    </div>
  );
}