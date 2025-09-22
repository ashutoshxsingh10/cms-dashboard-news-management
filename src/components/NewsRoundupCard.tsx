import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { NewsRoundup } from "../data/mockRoundups";

interface NewsRoundupCardProps {
  loading?: boolean;
  roundup?: NewsRoundup;
  onClick?: () => void;
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

export function NewsRoundupCard({ loading = false, roundup, onClick }: NewsRoundupCardProps) {
  if (loading) {
    return (
      <div className="w-[430px] h-[286px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-[0_2px_12px_rgba(16,24,40,0.08)]">
        <div className="h-[164px] bg-gray-200 animate-pulse" />
        <div className="h-[122px] p-4 space-y-3">
          <div className="h-4 bg-gray-200 animate-pulse rounded" />
          <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4" />
          <div className="border-t border-gray-200 my-2" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback if no roundup provided
  const defaultRoundup = {
    title: 'Default Round-up',
    subtitle: 'Default Subtitle',
    status: 'live' as const,
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-c1a0c74188a4?q=80&w=1400&auto=format&fit=crop',
    publishedTime: '07:51',
    publishedTimezone: 'IST',
    publishedDate: 'Today',
    expiresTime: '19:51',
    expiresTimezone: 'IST',
    expiresDate: 'Today'
  };

  const cardData = roundup || defaultRoundup;
  const statusInfo = statusConfig[cardData.status];

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
          <p className="text-xs text-gray-500 mb-1.5">{cardData.subtitle}</p>

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