import { useMemo, useState } from 'react';
import { Header } from './Header';
import { NewsCard } from './NewsCard';
import { NewsDetail } from './NewsDetail';
import { NewsRoundupCard } from './NewsRoundupCard';
import { NewsRoundupDetail } from './NewsRoundupDetail';
import { NewsStoryCard } from './NewsStoryCard';
import { NewsStoryDetail } from './NewsStoryDetail';
import { DateFilters } from './DateFilters';
import { ScrollArea } from './ui/scroll-area';
import { SearchWithSuggestions } from './SearchWithSuggestions';
import { mockRoundups, NewsRoundup } from '../data/mockRoundups';
import { mockNewsStories, NewsStory } from '../data/mockNewsStories';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Lightbulb,
  CheckSquare,
  Trophy,
  Heart,
  Clapperboard,
  Briefcase,
  Globe,
  MapPin
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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

interface CMSContentProps {
  activeTab: string;
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
  selectedArticle: NewsArticle | null;
  onArticleSelect: (article: NewsArticle) => void;
  selectedRoundup: NewsRoundup | null;
  onRoundupSelect: (roundup: NewsRoundup) => void;
  onRoundupBack: () => void;
  selectedStory?: NewsStory | null;
  onStorySelect?: (story: NewsStory) => void;
  onStoryBack?: () => void;
  viewedArticleIds?: Set<string>;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterBy: string;
  onFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  articles: NewsArticle[];
  onArticleUpdate: (articleId: string, updates: Partial<NewsArticle>) => void;
  onStatusChange: (articleId: string, status: NewsArticle['status']) => void;
  selectedArticleIds: string[];
  isBulkMode: boolean;
  isSuggestMode: boolean;
  quickFilters: string[];
  onArticleSelection: (articleId: string, isSelected: boolean) => void;
  onBulkModeToggle: () => void;
  onSuggestBulkPublishing: () => void;
  onBulkStatusChange: (articleIds: string[], status: NewsArticle['status']) => void;
  onQuickFiltersChange: (filters: string[]) => void;
  onCancelSelection: () => void;
  onRoundupStatusChange?: (roundupId: string, status: NewsRoundup['status']) => void;
  onStoryStatusChange?: (storyId: string, status: NewsStory['status']) => void;
  onCreateRoundupClick?: () => void;
  onCreateStoryClick?: () => void;
  roundups: NewsRoundup[];
  newsStories?: NewsStory[];
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

export function CMSContent({
  activeTab,
  activeSubTab,
  onSubTabChange,
  selectedArticle,
  onArticleSelect,
  selectedRoundup,
  onRoundupSelect,
  onRoundupBack,
  selectedStory,
  onStorySelect,
  onStoryBack,
  viewedArticleIds,
  searchTerm,
  onSearchChange,
  filterBy,
  onFilterChange,
  sortBy,
  onSortChange,
  articles,
  onArticleUpdate,
  onStatusChange,
  selectedArticleIds,
  isBulkMode,
  isSuggestMode,
  quickFilters,
  onArticleSelection,
  onBulkModeToggle,
  onSuggestBulkPublishing,
  onBulkStatusChange,
  onQuickFiltersChange,
  onCancelSelection,
  onRoundupStatusChange,
  onStoryStatusChange,
  onCreateRoundupClick,
  onCreateStoryClick,
  roundups,
  newsStories = mockNewsStories
}: CMSContentProps) {
  // State for date filtering - default to today
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0]; // Today in YYYY-MM-DD format
  });

  // Calculate tab counts dynamically
  const tabCounts = useMemo(() => {
    return {
      pending: articles.filter(a => a.status === 'pending').length,
      review: articles.filter(a => a.status === 'review').length,
      rejected: articles.filter(a => a.status === 'rejected').length,
      published: articles.filter(a => a.status === 'published').length,
    };
  }, [articles]);

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;

    if (activeSubTab !== 'all') {
      filtered = filtered.filter(article => article.status === activeSubTab);
    }

    // Apply date filter - filter by selected date
    if (selectedDate && activeTab === 'news-publishing') {
      filtered = filtered.filter(article => {
        const articleDate = new Date(article.ingestionTime).toISOString().split('T')[0];
        return articleDate === selectedDate;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterBy !== 'all') {
      filtered = filtered.filter(article => article.source.toLowerCase().includes(filterBy.toLowerCase()));
    }

    // Apply quick filters
    if (quickFilters.length > 0) {
      filtered = filtered.filter(article => {
        if (activeSubTab === 'published') {
          // For published tab, filter by publishStatus
          return quickFilters.includes(article.publishStatus || '');
        } else {
          // For other tabs, filter by category/tags
          return quickFilters.some(filter => 
            article.newsType.toLowerCase().includes(filter.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())) ||
            article.subType.some(subType => subType.toLowerCase().includes(filter.toLowerCase()))
          );
        }
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ingestion-desc':
          return new Date(b.ingestionTime).getTime() - new Date(a.ingestionTime).getTime();
        case 'ingestion-asc':
          return new Date(a.ingestionTime).getTime() - new Date(b.ingestionTime).getTime();
        case 'safety-desc':
          return b.safetyScore - a.safetyScore;
        case 'safety-asc':
          return a.safetyScore - b.safetyScore;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [articles, activeSubTab, searchTerm, filterBy, sortBy, quickFilters, selectedDate, activeTab]);

  // Group articles by date
  const articlesByDate = useMemo(() => {
    return groupArticlesByDate(filteredAndSortedArticles);
  }, [filteredAndSortedArticles]);

  if (activeTab !== 'news-publishing') {
    // If we're in news-roundup and have a selected roundup, show detail view
    if (activeTab === 'news-roundup' && selectedRoundup) {
      return (
        <NewsRoundupDetail
          roundup={selectedRoundup}
          allArticles={articles}
          selectedArticle={selectedArticle}
          onArticleSelect={onArticleSelect}
          onBack={onRoundupBack}
          onArticleUpdate={onArticleUpdate}
          onStatusChange={onStatusChange}
          onRoundupStatusChange={onRoundupStatusChange}
        />
      );
    }

    // If we're in news-stories and have a selected story, show detail view
    if (activeTab === 'news-stories' && selectedStory) {
      return (
        <NewsStoryDetail
          story={selectedStory}
          allArticles={articles}
          selectedArticle={selectedArticle}
          onArticleSelect={onArticleSelect}
          onBack={onStoryBack!}
          onArticleUpdate={onArticleUpdate}
          onStatusChange={onStatusChange}
          onStoryStatusChange={onStoryStatusChange!}
        />
      );
    }

    return (
      <div className="h-full bg-white flex flex-col">
        {/* Header Rows Only - copied from News Publishing */}
        <div className="border-b bg-white">
          <div className="px-6 pt-6">
            {/* Header Title */}
            <div className="mb-2">
              <h1 style={{ fontSize: '20pt' }}>{activeTab === 'news-stories' ? 'News Stories' : 'News Round Up'}</h1>
              <p className="text-muted-foreground" style={{ fontSize: '8pt' }}>
                {activeTab === 'news-stories' 
                  ? 'Create and manage ongoing news stories from here.' 
                  : 'Compile and curate news roundups from here.'
                }
              </p>
            </div>

            {/* Sub-tabs and Search in same row */}
            <div className="flex justify-between items-center mb-2">
              {/* Sub Navigation with Underline Style */}
              <div className="flex space-x-8">
                {[
                  { 
                    id: 'live', 
                    label: 'Live', 
                    count: activeTab === 'news-stories' 
                      ? newsStories.filter(s => s.status === 'live').length 
                      : roundups.filter(r => r.status === 'live').length 
                  },
                  { 
                    id: 'paused', 
                    label: 'Paused', 
                    count: activeTab === 'news-stories' 
                      ? newsStories.filter(s => s.status === 'paused').length 
                      : roundups.filter(r => r.status === 'paused').length 
                  },
                  { 
                    id: 'expired', 
                    label: 'Expired', 
                    count: activeTab === 'news-stories' 
                      ? newsStories.filter(s => s.status === 'expired').length 
                      : roundups.filter(r => r.status === 'expired').length 
                  },
                  { 
                    id: 'archive', 
                    label: 'Archive', 
                    count: activeTab === 'news-stories' 
                      ? newsStories.filter(s => s.status === 'archived').length 
                      : roundups.filter(r => r.status === 'archived').length 
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onSubTabChange(tab.id)}
                    className={`relative px-1 py-2 text-sm transition-colors flex items-center gap-2 ${
                      activeSubTab === tab.id
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                    <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                      {tab.count}
                    </span>
                    {/* Active state underline */}
                    {activeSubTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Center-aligned Search Bar */}
              <div className="flex-1 flex justify-center">
                <SearchWithSuggestions
                  value={searchTerm}
                  onChange={onSearchChange}
                  placeholder="Search for topics/tags/location"
                  activeTab={activeTab}
                  activeSubTab={activeSubTab}
                  roundups={roundups}
                  newsStories={newsStories}
                />
              </div>

              {/* Create Button */}
              <div className="w-80 flex justify-end">
                <Button 
                  onClick={activeTab === 'news-stories' ? onCreateStoryClick : onCreateRoundupClick}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {activeTab === 'news-stories' ? 'Create News Story' : 'Create Round-up'}
                </Button>
              </div>
            </div>
          </div>

          {/* Edge-to-edge Separator Line */}
          <Separator />

          <div className="px-6 py-2">
            {/* Third Row - Action Buttons and Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger className="w-48">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingestion-desc">Latest Ingested</SelectItem>
                    <SelectItem value="ingestion-asc">Oldest Ingested</SelectItem>
                    <SelectItem value="safety-desc">Highest Safety Score</SelectItem>
                    <SelectItem value="safety-asc">Lowest Safety Score</SelectItem>
                    <SelectItem value="title-asc">Title A-Z</SelectItem>
                    <SelectItem value="title-desc">Title Z-A</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filter Dropdown */}
                <Select value={filterBy} onValueChange={onFilterChange}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="reuters">Reuters</SelectItem>
                    <SelectItem value="bbc">BBC News</SelectItem>
                    <SelectItem value="cnn">CNN</SelectItem>
                    <SelectItem value="ap">Associated Press</SelectItem>
                    <SelectItem value="bloomberg">Bloomberg</SelectItem>
                  </SelectContent>
                </Select>


              </div>

              {/* Selection Counter */}
              {(isBulkMode || isSuggestMode) && selectedArticleIds.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {selectedArticleIds.length}/5 articles selected
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'news-stories' ? (
            /* News Stories Content */
            <div className="p-6 min-w-[1400px] overflow-x-auto">
              {/* News Stories Cards Grid */}
              <div className="flex flex-wrap gap-6 justify-start">
                {newsStories
                  .filter(story => {
                    // Map archive tab to archived status
                    const statusToFilter = activeSubTab === 'archive' ? 'archived' : activeSubTab;
                    let matches = story.status === statusToFilter;
                    
                    // Apply search filter
                    if (searchTerm) {
                      matches = matches && (
                        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        story.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                      );
                    }
                    
                    return matches;
                  })
                  .sort((a, b) => {
                    // Sort by last updated (most recent first)
                    return new Date(b.lastEventDate).getTime() - new Date(a.lastEventDate).getTime();
                  })
                  .map((story) => (
                    <NewsStoryCard 
                      key={story.id} 
                      story={story} 
                      isSelected={selectedStory?.id === story.id}
                      onClick={() => onStorySelect?.(story)}
                    />
                  ))}
              </div>
              
              {/* No stories message */}
              {newsStories.filter(story => {
                const statusToFilter = activeSubTab === 'archive' ? 'archived' : activeSubTab;
                let matches = story.status === statusToFilter;
                
                if (searchTerm) {
                  matches = matches && (
                    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    story.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                  );
                }
                
                return matches;
              }).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No news stories found matching your criteria</p>
                </div>
              )}
            </div>
          ) : (
            /* News Round-up Content */
            <div className="p-6 min-w-[1400px] overflow-x-auto">
              {/* News Round-up Cards Grid */}
              <div className="flex flex-wrap gap-6 justify-start">
                {roundups
                  .filter(roundup => {
                    // Map archive tab to archived status
                    const statusToFilter = activeSubTab === 'archive' ? 'archived' : activeSubTab;
                    let matches = roundup.status === statusToFilter;
                    
                    // Apply search filter
                    if (searchTerm) {
                      matches = matches && (
                        roundup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        roundup.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        roundup.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                      );
                    }
                    
                    // Apply quick filters
                    if (quickFilters.length > 0) {
                      matches = matches && quickFilters.some(filter => 
                        roundup.tags.includes(filter) || 
                        roundup.type === filter
                      );
                    }
                    
                    return matches;
                  })
                  .map((roundup) => (
                    <NewsRoundupCard 
                      key={roundup.id} 
                      roundup={roundup} 
                      onClick={() => onRoundupSelect(roundup)}
                    />
                  ))}
              </div>
              
              {/* No roundups message */}
              {roundups.filter(roundup => {
                const statusToFilter = activeSubTab === 'archive' ? 'archived' : activeSubTab;
                let matches = roundup.status === statusToFilter;
                
                if (searchTerm) {
                  matches = matches && (
                    roundup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    roundup.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    roundup.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                  );
                }
                
                if (quickFilters.length > 0) {
                  matches = matches && quickFilters.some(filter => 
                    roundup.tags.includes(filter) || 
                    roundup.type === filter
                  );
                }
                
                return matches;
              }).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No roundups found matching your criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0">
        <Header
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filterBy={filterBy}
          onFilterChange={onFilterChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          activeSubTab={activeSubTab}
          onSubTabChange={onSubTabChange}
          tabCounts={tabCounts}
          isBulkMode={isBulkMode}
          isSuggestMode={isSuggestMode}
          quickFilters={quickFilters}
          selectedArticleIds={selectedArticleIds}
          onBulkModeToggle={onBulkModeToggle}
          onSuggestBulkPublishing={onSuggestBulkPublishing}
          onQuickFiltersChange={onQuickFiltersChange}
          activeTab={activeTab}
          articles={articles}
        />
      </div>
      
      {/* Main Content Area - using min-h-0 and overflow-hidden for internal scrolling */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Article List Column - Edge to edge with proper constraints */}
        <div className="w-[35vw] min-w-[400px] max-w-[600px] border-r border-border flex flex-col overflow-hidden">
          {/* Date Filters - Fixed at top */}
          <div className="flex-shrink-0 border-b border-border bg-white">
            <DateFilters
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
          
          <ScrollArea className="flex-1 h-full">
            <div className="relative w-full">
              {/* Show articles directly without date grouping since we're filtering by single date */}
              <div className="space-y-1 w-full pt-4 pb-4">
                {filteredAndSortedArticles.map((article) => (
                  <div key={article.id} className="w-full overflow-hidden">
                    <NewsCard
                      article={article}
                      isSelected={selectedArticle?.id === article.id}
                      isChecked={selectedArticleIds.includes(article.id)}
                      showCheckbox={isBulkMode || isSuggestMode}
                      onCheckboxChange={(isChecked) => onArticleSelection(article.id, isChecked)}
                      onClick={() => onArticleSelect(article)}
                      isNew={!viewedArticleIds?.has(article.id)}
                    />
                  </div>
                ))}
              </div>
              
              {/* No articles message */}
              {filteredAndSortedArticles.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No articles found for the selected date
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Article Detail Column - Takes remaining space */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <NewsDetail 
            article={selectedArticle} 
            onArticleUpdate={onArticleUpdate}
            onStatusChange={onStatusChange}
            selectedArticleIds={selectedArticleIds}
            isBulkMode={isBulkMode || isSuggestMode}
            onBulkStatusChange={onBulkStatusChange}
            onCancelSelection={onCancelSelection}
            activeSubTab={activeSubTab}
          />
        </div>
      </div>
    </div>
  );
}