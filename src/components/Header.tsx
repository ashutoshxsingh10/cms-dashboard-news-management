import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { SearchWithSuggestions } from "./SearchWithSuggestions";
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
  articles?: any[]; // Articles data for search suggestions
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
    { id: 'sports', label: 'Sports', icon: Trophy },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'entertainment', label: 'Entertainment', icon: Clapperboard },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'world', label: 'World', icon: Globe },
    { id: 'national', label: 'National', icon: MapPin },
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
        <div className="mb-2">
          <h1 style={{ fontSize: '20pt' }}>News Publishing</h1>
          <p className="text-muted-foreground" style={{ fontSize: '8pt' }}>Edit, Curate, moderate and Publish news content from here.</p>
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
                {/* Suggest Bulk Publishing Button - Only in pending tab */}
                {activeSubTab === 'pending' && (
                  <>
                    <Button
                      variant={isSuggestMode ? "default" : "outline"}
                      onClick={onSuggestBulkPublishing}
                      className="flex items-center gap-2"
                    >
                      <Lightbulb className="h-4 w-4" />
                      {isSuggestMode ? "System Suggestion Active" : "Suggest Bulk Publishing"}
                    </Button>
                    <Separator orientation="vertical" className="h-6 bg-muted-foreground" />
                  </>
                )}

                {/* Checkbox Toggle */}
                <Button
                  variant={isBulkMode || isSuggestMode ? "default" : "outline"}
                  onClick={onBulkModeToggle}
                  className="flex items-center gap-2"
                >
                  <CheckSquare className="h-4 w-4" />
                  {isBulkMode || isSuggestMode ? "Cancel Selection" : "Select Articles"}
                </Button>
              </>
            )}

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
                  const Icon = filter.icon;
                  const isActive = quickFilters.includes(filter.id);
                  
                  return (
                    <Button
                      key={filter.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleQuickFilterToggle(filter.id)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Icon className="h-3 w-3" />
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
              {selectedArticleIds.length}/5 articles selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}