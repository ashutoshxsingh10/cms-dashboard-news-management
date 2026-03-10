// Mock data for news stories
export interface NewsStory {
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
  eventCount: number; // Number of news events in this story
  tags: string[];
  type: string;
  createdAt: string;
  updatedAt: string;
  articleIds: string[]; // News events/articles in this story
  lastEventDate: string; // When the last news event was added
}

export const mockNewsStories: NewsStory[] = [
  {
    id: 'story-1',
    title: 'Russia-Ukraine Conflict Updates',
    subtitle: 'Ongoing developments in the Russia-Ukraine war with latest diplomatic and military updates',
    status: 'live',
    imageUrl: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=1400&auto=format&fit=crop',
    publishedTime: '09:30',
    publishedTimezone: 'IST',
    publishedDate: 'Mon, 18 Aug',
    expiresTime: '18:00',
    expiresTimezone: 'IST',
    expiresDate: 'Fri, 22 Aug',
    eventCount: 8,
    tags: ['International', 'War', 'Politics'],
    type: 'Breaking News Series',
    createdAt: '2024-08-18T09:30:00Z',
    updatedAt: '2024-08-19T14:22:00Z',
    articleIds: ['world-live-1', 'world-live-2', 'world-live-3', 'world-live-4', 'world-live-5', 'world-live-6', 'world-live-7', 'world-live-8'],
    lastEventDate: '2024-08-19T14:22:00Z'
  },
  {
    id: 'story-2',
    title: 'Indian Space Mission Progress',
    subtitle: 'ISRO\'s latest space missions and achievements in lunar and solar exploration',
    status: 'live',
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=1400&auto=format&fit=crop',
    publishedTime: '11:15',
    publishedTimezone: 'IST',
    publishedDate: 'Sun, 17 Aug',
    expiresTime: '23:59',
    expiresTimezone: 'IST',
    expiresDate: 'Wed, 28 Aug',
    eventCount: 5,
    tags: ['Science', 'ISRO', 'Technology'],
    type: 'Science Updates',
    createdAt: '2024-08-17T11:15:00Z',
    updatedAt: '2024-08-19T10:45:00Z',
    articleIds: ['tech-live-1', 'tech-live-2', 'tech-live-3', 'tech-live-4', 'tech-live-5'],
    lastEventDate: '2024-08-19T10:45:00Z'
  },
  {
    id: 'story-3',
    title: 'Climate Change Summit 2024',
    subtitle: 'Global climate action discussions and commitments from world leaders',
    status: 'paused',
    imageUrl: 'https://images.unsplash.com/photo-1593558220789-ca52d3b5c1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIwY2hhbmdlJTIwZW52aXJvbm1lbnQlMjBzdW1taXR8ZW58MXx8fHwxNzU1NzA1OTYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    publishedTime: '14:45',
    publishedTimezone: 'IST',
    publishedDate: 'Sat, 16 Aug',
    expiresTime: '20:00',
    expiresTimezone: 'IST',
    expiresDate: 'Sun, 25 Aug',
    eventCount: 5,
    tags: ['Environment', 'Global', 'Climate'],
    type: 'Conference Coverage',
    createdAt: '2024-08-16T14:45:00Z',
    updatedAt: '2024-08-18T16:30:00Z',
    articleIds: ['health-live-1', 'health-live-2', 'health-live-3', 'health-live-4', 'health-live-5'],
    lastEventDate: '2024-08-18T16:30:00Z'
  },
  {
    id: 'story-4',
    title: 'Indian Premier League 2024',
    subtitle: 'Complete coverage of IPL matches, player transfers, and tournament updates',
    status: 'expired',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1400&auto=format&fit=crop',
    publishedTime: '19:30',
    publishedTimezone: 'IST',
    publishedDate: 'Fri, 15 Aug',
    expiresTime: '23:59',
    expiresTimezone: 'IST',
    expiresDate: 'Mon, 19 Aug',
    eventCount: 5,
    tags: ['Sports', 'Cricket', 'IPL'],
    type: 'Sports Tournament',
    createdAt: '2024-08-15T19:30:00Z',
    updatedAt: '2024-08-19T08:15:00Z',
    articleIds: ['sports-live-1', 'sports-live-2', 'sports-live-3', 'sports-live-4', 'sports-live-5'],
    lastEventDate: '2024-08-19T08:15:00Z'
  },
  {
    id: 'story-5',
    title: 'Monsoon Updates 2024',
    subtitle: 'Real-time updates on monsoon progress, rainfall data, and weather forecasts across India',
    status: 'live',
    imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=1400&auto=format&fit=crop',
    publishedTime: '06:00',
    publishedTimezone: 'IST',
    publishedDate: 'Thu, 14 Aug',
    expiresTime: '18:00',
    expiresTimezone: 'IST',
    expiresDate: 'Sat, 31 Aug',
    eventCount: 5,
    tags: ['Weather', 'Monsoon', 'Agriculture'],
    type: 'Weather Updates',
    createdAt: '2024-08-14T06:00:00Z',
    updatedAt: '2024-08-19T12:30:00Z',
    articleIds: ['entertainment-live-1', 'entertainment-live-2', 'entertainment-live-3', 'entertainment-live-4', 'entertainment-live-5'],
    lastEventDate: '2024-08-19T12:30:00Z'
  },
  {
    id: 'story-6',
    title: 'US Presidential Election 2024',
    subtitle: 'Campaign updates, debates, and election developments from the United States',
    status: 'archived',
    imageUrl: 'https://images.unsplash.com/photo-1650984661525-7e6b1b874e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwZGlnaXRhbCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU1NzA3NjkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    publishedTime: '22:00',
    publishedTimezone: 'IST',
    publishedDate: 'Wed, 13 Aug',
    expiresTime: '12:00',
    expiresTimezone: 'IST',
    expiresDate: 'Thu, 15 Aug',
    eventCount: 5,
    tags: ['Politics', 'USA', 'Elections'],
    type: 'Political Coverage',
    createdAt: '2024-08-13T22:00:00Z',
    updatedAt: '2024-08-15T12:00:00Z',
    articleIds: ['business-live-1', 'business-live-2', 'business-live-3', 'business-live-4', 'business-live-5'],
    lastEventDate: '2024-08-15T11:45:00Z'
  }
];