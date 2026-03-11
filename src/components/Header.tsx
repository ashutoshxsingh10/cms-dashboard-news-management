import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { SearchWithSuggestions } from "./SearchWithSuggestions";
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, FilterIcon, ArrowUpDownIcon, BulbIcon, CheckmarkSquare02Icon, Square01Icon, ChampionIcon, FavouriteIcon, Film01Icon, Briefcase01Icon, Globe02Icon, Location01Icon } from '@hugeicons/core-free-icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { NewsArticle } from '../types';
import { MAX_BULK_SELECTION } from '../constants';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterBy: string;
  onFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
  tabCounts?: {
    pending: number;
    review: number;
    rejected: number;
    published: number;
  };
  isBulkMode: boolean;
  isSuggestMode: boolean;
  quickFilters: string[];
  selectedArticleIds?: string[];
  onBulkModeToggle: () => void;
  onSuggestBulkPublishing: () => void;
  onQuickFiltersChange: (filters: string[]) => void;
  activeTab: string;
  articles?: NewsArticle[];
  showBulkOptions?: boolean;
  selectedCount?: number;
  totalCount?: number;
}

export function Header({
  searchTerm,
  onSearchChange,
  filterBy,
  onFilterChange,
  sortBy,
  onSortChange,
  activeSubTab,
  onSubTabChange,
  tabCounts,
  isBulkMode,
  isSuggestMode,
  quickFilters,
  selectedArticleIds = [],
  onBulkModeToggle,
  onSuggestBulkPublishing,
  onQuickFiltersChange,
  activeTab,
  articles = [],
  showBulkOptions = true,
  selectedCount = 0,
  totalCount = 0
}: HeaderProps) {
  const tabs = [
    { id: 'pending', label: 'Pending', count: tabCounts.pending },
    { id: 'review', label: 'Review', count: tabCounts.review },
    { id: 'rejected', label: 'Rejected', count: tabCounts.rejected },
    { id: 'published', label: 'Published', count: tabCounts.published },
  ];

  const quickFilterOptions = [
    { id: 'sports', label: 'Sports', icon: ChampionIcon },
    { id: 'health', label: 'Health', icon: FavouriteIcon },
    { id: 'entertainment', label: 'Entertainment', icon: Film01Icon },
    { id: 'business', label: 'Business', icon: Briefcase01Icon },
    { id: 'world', label: 'World', icon: Globe02Icon },
    { id: 'national', label: 'National', icon: Location01Icon },
  ];

  const publishedStatusFilters = [
    { id: 'live', label: 'Live', color: 'bg-green-100 text-green-800 border-green-200' },
    { id: 'paused', label: 'Paused', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { id: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800 border-red-200' },
  ];

  const handleQuickFilterToggle = (filterId: string) => {
    if (quickFilters.includes(filterId)) {
      onQuickFiltersChange(quickFilters.filter(f => f !== filterId));
    } else {
      onQuickFiltersChange([...quickFilters, filterId]);
    }
  };

  return (
    <div className="border-b bg-white">
      <div className="px-6 pt-6">
        {/* Header Title */}
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h1 className="text-[20pt]">News Publishing</h1>
            <p className="text-muted-foreground text-[8pt]">Edit, Curate, moderate and Publish news content from here.</p>
          </div>
          <span className="flex items-center gap-1.5 text-[7pt] text-muted-foreground/35 whitespace-nowrap mt-2 select-none tracking-wide">
            <svg width="10" height="14" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
              <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
              <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
              <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
              <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
              <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
            </svg>
            <span className="opacity-70">Figma</span>
            <span className="text-muted-foreground/25 mx-0.5">+</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
              <rect width="24" height="24" rx="5" fill="#1A1A1A"/>
              <path d="M7 5.5L12 12L7 18.5" stroke="#8B8B8B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 5.5L12 12L17 18.5" stroke="#555" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="opacity-70">Cursor</span>
          </span>
        </div>

        {/* Sub-tabs and Search in same row */}
        <div className="flex justify-between items-center mb-2">
          {/* Sub Navigation with Underline Style - only show if tabCounts provided */}
          {tabCounts && activeSubTab && onSubTabChange ? (
            <div className="flex space-x-8">
              {tabs.map((tab) => (
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
          ) : (
            <div></div>
          )}

          {/* Center-aligned Search Bar - Enhanced with Suggestions */}
          <div className="flex-1 flex justify-center">
            <SearchWithSuggestions
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search for topics/tags/location"
              activeTab={activeTab}
              activeSubTab={activeSubTab}
              articles={articles}
            />
          </div>

          {/* Empty space to maintain balance */}
          <div className="w-80"></div>
        </div>
      </div>

      {/* Edge-to-edge Separator Line */}
      <Separator />

      <div className="px-6 py-2">
        {/* Third Row - Action Buttons and Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Bulk options - only show when showBulkOptions is true */}
            {showBulkOptions && (
              <>
                {/* Checkbox Toggle - Icon only */}
                <Button
                  variant={isBulkMode || isSuggestMode ? "default" : "outline"}
                  size="icon"
                  onClick={onBulkModeToggle}
                >
                  <HugeiconsIcon icon={isBulkMode || isSuggestMode ? CheckmarkSquare02Icon : Square01Icon} className="h-4 w-4" />
                </Button>

                {/* Suggest Bulk Publishing Button - Only in pending tab */}
                {activeSubTab === 'pending' && (
                  <>
                    <Button
                      variant={isSuggestMode ? "default" : "outline"}
                      onClick={onSuggestBulkPublishing}
                      className="flex items-center gap-2"
                    >
                      <HugeiconsIcon icon={BulbIcon} className="h-4 w-4" />
                      {isSuggestMode ? "System Suggestion Active" : "Suggest Bulk Publishing"}
                    </Button>
                    <Separator orientation="vertical" className="h-6 bg-muted-foreground" />
                  </>
                )}
              </>
            )}

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-48">
                <HugeiconsIcon icon={ArrowUpDownIcon} className="h-4 w-4" />
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
                <HugeiconsIcon icon={FilterIcon} className="h-4 w-4" />
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

            <Separator orientation="vertical" className="h-6 bg-muted-foreground" />

            {showBulkOptions && <Separator orientation="vertical" className="h-6 bg-muted-foreground" />}

            {/* Quick Filter Tags */}
            <div className="flex items-center gap-2">
              {activeSubTab === 'published' ? (
                // Show published status filters for published tab
                publishedStatusFilters.map((filter) => {
                  const isActive = quickFilters.includes(filter.id);
                  
                  return (
                    <Button
                      key={filter.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleQuickFilterToggle(filter.id)}
                      className={`flex items-center gap-1 text-xs ${isActive ? filter.color : ''}`}
                    >
                      {filter.label}
                    </Button>
                  );
                })
              ) : (
                // Show category filters for other tabs
                quickFilterOptions.map((filter) => {
                  const isActive = quickFilters.includes(filter.id);

                  return (
                    <Button
                      key={filter.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleQuickFilterToggle(filter.id)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <HugeiconsIcon icon={filter.icon} className="h-3 w-3" />
                      {filter.label}
                    </Button>
                  );
                })
              )}
            </div>
          </div>

          {/* Selection Counter */}
          {showBulkOptions && (isBulkMode || isSuggestMode) && selectedArticleIds.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedArticleIds.length}/{MAX_BULK_SELECTION} articles selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}