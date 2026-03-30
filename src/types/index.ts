// Shared type definitions for the CMS Dashboard

export interface NewsArticle {
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
  status: ArticleStatus;
  publishStatus?: PublishStatus;
  tags: string[];
  publishDate?: string;
}

export type ArticleStatus = 'pending' | 'review' | 'rejected' | 'published';
export type PublishStatus = 'live' | 'paused' | 'expired';
export type RoundupStatus = 'live' | 'paused' | 'expired' | 'archived';
export type StoryStatus = 'live' | 'expired' | 'paused' | 'archived';

export type TabType = 'news-publishing' | 'news-stories' | 'news-roundup';
export type SubTabType = 'pending' | 'review' | 'rejected' | 'published' | 'live' | 'paused' | 'expired' | 'archive';

export type SafetyTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface SafetyTierInfo {
  name: string;
  textColor: string;
  borderColor: string;
  backgroundColor: string;
}

// Re-export data types from mock data files
export type { NewsRoundup } from '../data/mockRoundups';
export type { NewsStory } from '../data/mockNewsStories';

// Publish settings shared between story and roundup modals
export interface PublishSettings {
  startTimeMode: 'now' | 'custom';
  customDate?: Date;
  customTime?: string;
  durationValue: number;
  durationType: 'hours' | 'days';
  contentTypes: string[];
  notifySubscribers: boolean;
}
