import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface NewsStoryCardProps {
  story: {
    id: string;
    title: string;
    subtitle: string;
    status: 'live' | 'expired' | 'paused' | 'archived';
    imageUrl: string;
    publishedTime: string;
    publishedTimezone: string;
    publishedDate: string;
    expiresTime?: string;
    expiresTimezone?: string;
    expiresDate?: string;
    eventCount: number;
    tags: string[];
    type: string;
    lastEventDate: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function NewsStoryCard({ story, isSelected, onClick }: NewsStoryCardProps) {
  // Status configuration
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'live':
        return {
          label: 'Live',
          pillClass: 'bg-green-100 text-green-800 border-green-200',
          dotColor: 'bg-green-500'
        };
      case 'paused':
        return {
          label: 'Paused',
          pillClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          dotColor: 'bg-yellow-500'
        };
      case 'expired':
        return {
          label: 'Expired',
          pillClass: 'bg-red-100 text-red-800 border-red-200',
          dotColor: 'bg-red-500'
        };
      case 'archived':
        return {
          label: 'Archived',
          pillClass: 'bg-gray-100 text-gray-800 border-gray-200',
          dotColor: 'bg-gray-500'
        };
      default:
        return {
          label: 'Unknown',
          pillClass: 'bg-gray-100 text-gray-800 border-gray-200',
          dotColor: 'bg-gray-500'
        };
    }
  };

  const statusInfo = getStatusInfo(story.status);

  // Create card data object matching the reference structure
  const cardData = {
    title: story.title,
    subtitle: story.subtitle,
    imageUrl: story.imageUrl,
    publishedTime: story.publishedTime,
    publishedTimezone: story.publishedTimezone,
    publishedDate: story.publishedDate,
    expiresTime: story.expiresTime || '--:--',
    expiresTimezone: story.expiresTimezone || 'IST',
    expiresDate: story.expiresDate || 'Not set'
  };

  return (
    <div 
      className="w-[430px] h-[286px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-[0_2px_12px_rgba(16,24,40,0.08)] hover:shadow-lg transition-shadow cursor-pointer"
      role="group"
      aria-label={cardData.title}
      onClick={onClick}
    >
      <Card className="border-0 shadow-none h-full gap-0 p-0">
        {/* Hero Image - 164px height */}
        <div className="relative h-[164px] w-full overflow-hidden leading-none">
          <ImageWithFallback
            src={cardData.imageUrl}
            alt={cardData.title}
            className="h-full w-full object-cover block"
          />
        </div>

        {/* Body - fixed 122px height */}
        <div className="h-[122px] px-4 pt-3 pb-3 flex flex-col">
          {/* Title Row with Status Pill */}
          <div className="flex items-start justify-between gap-3 mb-0.5">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate leading-tight">
                {cardData.title}
              </h3>
            </div>
            <div
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1 flex-shrink-0 ${statusInfo.pillClass}`}
            >
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
              {statusInfo.label}
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xs text-gray-500 mb-1.5 truncate">{cardData.subtitle}</p>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-2" />

          {/* Metadata Grid - flex-1 to fill remaining space */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* Published On */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs text-gray-500">Published on</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-gray-900 leading-none">
                  {cardData.publishedTime}
                </span>
                <span className="text-xs text-gray-700">{cardData.publishedTimezone}</span>
              </div>
              <div className="text-xs text-gray-700 mt-0.5">{cardData.publishedDate}</div>
            </div>

            {/* Expires On */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs text-gray-500">Expires on</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-gray-900 leading-none">
                  {cardData.expiresTime}
                </span>
                <span className="text-xs text-gray-700">{cardData.expiresTimezone}</span>
              </div>
              <div className="text-xs text-gray-700 mt-0.5">{cardData.expiresDate}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}