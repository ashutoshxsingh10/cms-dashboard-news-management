import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SafetyScoreTag } from "./SafetyScoreTag";
import { Clock, FileText, Video } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  source: string;
  sourceIcon: string;
  ingestionTime: string;
  isBreaking?: boolean;
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
}

interface NewsCardProps {
  article: NewsArticle;
  isSelected: boolean;
  isChecked?: boolean;
  showCheckbox?: boolean;
  onCheckboxChange?: (isChecked: boolean) => void;
  onClick: () => void;
  isRoundupCreation?: boolean;
  isNew?: boolean; // Whether this article is new and unviewed
  hideStatusBadges?: boolean; // Hide status badges (for story details)
}

// Source icon mapping
const getSourceIcon = (sourceIcon: string) => {
  const iconMap: Record<string, string> = {
    'reuters': 'R',
    'bbc': 'BBC',
    'cnn': 'CNN',
    'ap': 'AP',
    'bloomberg': 'B',
  };
  return iconMap[sourceIcon.toLowerCase()] || sourceIcon.charAt(0).toUpperCase();
};

export function NewsCard({ 
  article, 
  isSelected, 
  isChecked = false,
  showCheckbox = false,
  onCheckboxChange,
  onClick,
  isRoundupCreation = false,
  isNew = false,
  hideStatusBadges = false
}: NewsCardProps) {


  const ContentTypeIcon = article.contentType === 'video' ? Video : FileText;

  // Format exact timestamp - time only
  const formatExactTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card selection if clicking on checkbox
    if ((e.target as HTMLElement).closest('[role="checkbox"]')) {
      return;
    }
    onClick();
  };

  const handleCheckboxChange = (checked: boolean) => {
    onCheckboxChange?.(checked);
  };



  return (
    <div 
      className={`cursor-pointer transition-all hover:bg-gray-100 relative w-full group ${
        isRoundupCreation ? 'h-auto' : 'h-[120px]'
      } ${isSelected ? 'border-2' : ''}`}
      style={{
        backgroundColor: isSelected ? '#F0F1FC' : '#F4F6F7',
        borderColor: isSelected ? '#5767F2' : 'transparent',
        borderRadius: '8px'
      }}
      onClick={handleCardClick}
    >
      {/* New article indicator dot - top left corner - only for pending articles */}
      {isNew && !showCheckbox && article.status === 'pending' && (
        <div 
          className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full z-10"
          style={{ backgroundColor: '#5767F2' }}
        />
      )}

      {/* Checkbox for bulk selection - only visible on hover, except when selected */}
      {showCheckbox && (
        <div className={`absolute top-3 left-3 z-10 transition-opacity duration-200 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            className="bg-white border-2 border-gray-300 shadow-sm"
          />
        </div>
      )}

      <div className="h-full p-4 flex gap-4 min-w-0">
        {/* Left Column - Text Content with proper overflow handling */}
        <div className="flex-1 flex flex-col justify-between min-w-0 overflow-hidden">
          {/* Headline - Top Aligned with proper line clamping */}
          <h3 className="line-clamp-3 leading-tight text-sm font-semibold">{article.title}</h3>

          {/* Metadata Row - Bottom Aligned with overflow control */}
          <div className="flex items-center justify-between text-xs text-muted-foreground gap-2 min-w-0">
            {/* Left side metadata - responsive with overflow handling */}
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              {/* Source Icon - always visible */}
              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-medium flex-shrink-0">
                {getSourceIcon(article.sourceIcon)}
              </div>

              {/* Content Type Icon - always visible */}
              <ContentTypeIcon className="h-4 w-4 flex-shrink-0" />

              {/* Category Tag - always visible */}
              <Badge variant="secondary" className="text-xs px-2 py-0.5 flex-shrink-0 whitespace-nowrap">
                {article.newsType}
              </Badge>

              {/* Conditional badges with smart overflow handling */}
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                {/* Sub-category Tag - hide on smaller widths */}
                {article.subType.length > 0 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 flex-shrink-0 whitespace-nowrap hidden lg:inline-flex">
                    {article.subType[0]}
                  </Badge>
                )}

                {/* Published Status Badge - Only for published articles, prioritized over sub-category */}
                {!hideStatusBadges && article.status === 'published' && article.publishStatus && (
                  <Badge 
                    className={`text-xs px-2 py-0.5 border flex-shrink-0 whitespace-nowrap ${
                      article.publishStatus === 'live' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : article.publishStatus === 'paused'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    {article.publishStatus.charAt(0).toUpperCase() + article.publishStatus.slice(1)}
                  </Badge>
                )}
              </div>
            </div>

            {/* Right side metadata - fixed position with consistent spacing */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Ingestion Time */}
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="whitespace-nowrap">{formatExactTime(article.ingestionTime)}</span>
              </div>

              {/* Safety Score - Using reusable component with number-only variant for cards */}
              <SafetyScoreTag score={article.safetyScore} size="sm" variant="number-only" />
            </div>
          </div>
        </div>

        {/* Right Column - Thumbnail with consistent sizing */}
        <div className="flex-shrink-0">
          <div className="w-24 h-[88px] rounded-lg overflow-hidden">
            <ImageWithFallback
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}