import { useState, useMemo } from 'react';
import { Button } from "./ui/button";
import { NewsCard } from './NewsCard';
import { ScrollArea } from "./ui/scroll-area";
import { SearchWithSuggestions } from './SearchWithSuggestions';
import { Separator } from './ui/separator';
import { ArrowLeft, ArrowUpDown, Filter, Trophy, Heart, Clapperboard, Briefcase, Globe, MapPin, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SafetyScoreTag } from './SafetyScoreTag';
import { toast } from "sonner@2.0.3";

interface RoundupCreationPageProps {
  roundupData: {
    name: string;
    description: string;
    type: string;
    tags: string[];
  };
  articles: Array<{
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
  onCreateRoundup: (selectedArticleIds: string[]) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterBy: string;
  onFilterChange: (filter: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  quickFilters: string[];
  onQuickFiltersChange: (filters: string[]) => void;
  initialSelectedArticleIds?: string[];
}

// Draggable News Card Component with native HTML5 drag and drop
function DraggableNewsCard({ 
  article, 
  isSelected, 
  onClick, 
  onDragStart 
}: {
  article: any;
  isSelected: boolean;
  onClick: () => void;
  onDragStart: () => void;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ id: article.id, type: 'news-article' }));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart();
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleCardClick = () => {
    onClick();
  };

  const handleCheckboxChange = (checked: boolean) => {
    onClick(); // Use the same handler for both checkbox and card click
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="cursor-move transition-opacity"
    >
      <NewsCard
        article={article}
        isSelected={isSelected}
        onClick={handleCardClick}
        onCheckboxChange={handleCheckboxChange}
        showCheckbox={true}
        isRoundupCreation={true}
      />
    </div>
  );
}

// Drop Zone Component with native HTML5 drag and drop
function DropZone({ 
  children, 
  onDrop 
}: { 
  children: React.ReactNode; 
  onDrop: (articleId: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set to false if we're actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const data = e.dataTransfer.getData('application/json');
      const draggedItem = JSON.parse(data);
      
      if (draggedItem.type === 'news-article' && draggedItem.id) {
        onDrop(draggedItem.id);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 flex flex-col transition-colors ${
        isDragOver ? 'bg-blue-50 border-blue-200' : ''
      }`}
    >
      {children}
    </div>
  );
}

export function RoundupCreationPage({
  roundupData,
  articles,
  onBack,
  onCreateRoundup,
  searchTerm,
  onSearchChange,
  filterBy,
  onFilterChange,
  sortBy,
  onSortChange,
  quickFilters,
  onQuickFiltersChange,
  initialSelectedArticleIds = []
}: RoundupCreationPageProps) {
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>(initialSelectedArticleIds);

  // Filter articles to only show published articles from last 24 hours
  const eligibleArticles = useMemo(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return articles.filter(article => {
      // Only published articles
      if (article.status !== 'published') return false;
      
      // Only articles from last 24 hours
      const articleDate = new Date(article.ingestionTime);
      if (articleDate < twentyFourHoursAgo) return false;

      return true;
    });
  }, [articles]);

  // Apply filters and search to eligible articles
  const filteredArticles = useMemo(() => {
    let filtered = eligibleArticles;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.source.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(article => 
        article.newsType.toLowerCase() === filterBy.toLowerCase()
      );
    }

    // Apply quick filters
    if (quickFilters.length > 0) {
      filtered = filtered.filter(article => {
        return quickFilters.some(filter => {
          if (filter === 'breaking') return article.isBreaking;
          if (filter === 'video') return article.contentType === 'video';
          if (filter === 'high-safety') return article.safetyScore >= 8;
          return article.tags.includes(filter) || article.newsType.toLowerCase() === filter;
        });
      });
    }

    // Apply sorting
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
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [eligibleArticles, searchTerm, filterBy, quickFilters, sortBy]);

  // Get selected articles in order
  const selectedArticles = useMemo(() => {
    return selectedArticleIds.map(id => 
      articles.find(article => article.id === id)
    ).filter(Boolean);
  }, [selectedArticleIds, articles]);

  const handleArticleSelect = (articleId: string) => {
    setSelectedArticleIds(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId);
      } else if (prev.length < 8) {
        return [...prev, articleId];
      } else {
        toast.warning("Maximum 8 articles allowed", {
          description: "You can select up to 8 articles for a roundup.",
          duration: 3000,
        });
        return prev;
      }
    });
  };

  const handleRemoveArticle = (articleId: string) => {
    setSelectedArticleIds(prev => prev.filter(id => id !== articleId));
  };

  const handleDragStart = (articleId: string) => {
    // Auto-select article when dragging starts if not already selected
    if (!selectedArticleIds.includes(articleId) && selectedArticleIds.length < 8) {
      setSelectedArticleIds(prev => [...prev, articleId]);
    }
  };

  const handleDrop = (articleId: string) => {
    // Add article to selected list if not already included
    if (!selectedArticleIds.includes(articleId) && selectedArticleIds.length < 8) {
      setSelectedArticleIds(prev => [...prev, articleId]);
      toast.success("Article added to roundup", {
        description: "Article has been added to your selection.",
        duration: 2000,
      });
    } else if (selectedArticleIds.length >= 8) {
      toast.warning("Maximum 8 articles allowed", {
        description: "You can select up to 8 articles for a roundup.",
        duration: 3000,
      });
    } else {
      // Article is already selected
      toast.info("Article already selected", {
        description: "This article is already in your roundup selection.",
        duration: 2000,
      });
    }
  };

  const handleContinue = () => {
    if (selectedArticleIds.length < 5) {
      toast.error("Minimum 5 articles required", {
        description: "Please select at least 5 articles for the roundup.",
        duration: 3000,
      });
      return;
    }

    onCreateRoundup(selectedArticleIds);
  };

  const typeLabels = {
    breaking: 'Breaking News',
    trending: 'Trending Stories', 
    daily: 'Daily Digest',
    weekly: 'Weekly Review',
    regional: 'Regional Update'
  };

  const quickFilterOptions = [
    { id: 'sports', label: 'Sports', icon: Trophy },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'entertainment', label: 'Entertainment', icon: Clapperboard },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'world', label: 'World', icon: Globe },
    { id: 'national', label: 'National', icon: MapPin },
  ];

  const handleQuickFilterToggle = (filterId: string) => {
    if (quickFilters.includes(filterId)) {
      onQuickFiltersChange(quickFilters.filter(f => f !== filterId));
    } else {
      onQuickFiltersChange([...quickFilters, filterId]);
    }
  };

  // Source icon mapping
  const getSourceIcon = (sourceIcon: string) => {
    const iconMap: Record<string, string> = {
      'reuters': 'R',
      'bbc': 'BBC',
      'cnn': 'CNN',
      'ap': 'AP',
      'bloomberg': 'B',
      'espn': 'ESPN',
      'medical': 'MED',
      'variety': 'VAR',
      'thr': 'THR',
      'billboard': 'BB',
      'wired': 'W',
      'ew': 'EW',
      'gamespot': 'GS',
      'wsj': 'WSJ',
      'tc': 'TC',
      'ft': 'FT',
      'iea': 'IEA',
      'natgeo': 'NG',
      'spacetoday': 'ST',
      'sciam': 'SA'
    };
    return iconMap[sourceIcon.toLowerCase()] || sourceIcon.charAt(0).toUpperCase();
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 border-b bg-white">
        <div className="px-6 pt-6">
          {/* Title Row with Back Button and Search */}
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
              <h1 className="text-xl font-medium truncate">{roundupData.name}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {typeLabels[roundupData.type as keyof typeof typeLabels]}
              </p>
            </div>

            {/* Center-aligned Search Bar */}
            <div className="flex-1 flex justify-center max-w-md">
              <SearchWithSuggestions
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Search for topics/tags/location"
                activeTab="news-publishing"
                activeSubTab="published"
                articles={eligibleArticles}
              />
            </div>

            {/* Right spacer for balance */}
            <div className="flex-1"></div>
          </div>
        </div>

        {/* Edge-to-edge Separator Line */}
        <Separator />

        <div className="px-6 py-2">
          {/* Filter Controls Row - aligned with headline */}
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
                  <SelectItem value="alphabetical">Title A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Dropdown */}
              <Select value={filterBy} onValueChange={onFilterChange}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="world">World</SelectItem>
                  <SelectItem value="national">National</SelectItem>
                </SelectContent>
              </Select>

              <Separator orientation="vertical" className="h-6 bg-muted-foreground" />

              {/* Quick Filter Tags */}
              <div className="flex items-center gap-2">
                {quickFilterOptions.map((filter) => {
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
                })}
              </div>
            </div>


          </div>
        </div>

        {/* Filter info bar */}
        <div className="px-6 py-3 bg-blue-50 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700">
              Showing published articles from last 24 hours • Click checkbox or drag articles to select
            </span>
            <span className="text-blue-600 font-medium">
              {filteredArticles.length} articles available
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Column - Article Grid (2/3 width) */}
        <div className="w-2/3 border-r border-border flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 h-full">
            <div className="p-6">
              {/* Articles Grid - 2 columns identical to main grid */}
              <div className="grid grid-cols-2 gap-3">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="w-full">
                    <DraggableNewsCard
                      article={article}
                      isSelected={selectedArticleIds.includes(article.id)}
                      onClick={() => handleArticleSelect(article.id)}
                      onDragStart={() => handleDragStart(article.id)}
                    />
                  </div>
                ))}
              </div>
              
              {/* No articles message */}
              {filteredArticles.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No published articles found from the last 24 hours</p>
                  <p className="text-sm mt-2">Try adjusting your filters or check back later</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Right Column - Selected Articles (1/3 width) */}
        <div className="w-1/3 flex flex-col min-h-0 overflow-hidden bg-gray-50">
          <DropZone onDrop={handleDrop}>
            {/* Header */}
            <div className="p-4 border-b bg-white">
              <h3 className="font-medium text-lg">Selected Articles</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedArticleIds.length > 0 
                  ? `${selectedArticleIds.length} of 8 selected (${selectedArticleIds.length < 5 ? `${5 - selectedArticleIds.length} more needed` : 'minimum met'})`
                  : 'Select 5-8 articles for your roundup'
                }
              </p>
            </div>

            {/* Selected Articles List */}
            <ScrollArea className="flex-1 h-full">
              <div className="h-full">
                {selectedArticles.length > 0 ? (
                  <div className="p-4 space-y-1">
                    {selectedArticles.map((article, index) => (
                      <div key={article.id} className="relative">
                        {/* Remove button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveArticle(article.id)}
                          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600 z-20 bg-white/80 backdrop-blur-sm shadow-sm border"
                        >
                          <X className="h-3 w-3" />
                        </Button>

                        {/* Order number */}
                        <div className="absolute top-2 left-2 w-5 h-5 bg-[#5767F2] text-white text-xs rounded-full flex items-center justify-center font-medium z-20">
                          {index + 1}
                        </div>

                        {/* Full NewsCard - No scaling, proper responsive sizing */}
                        <div className="w-full">
                          <NewsCard
                            article={article}
                            isSelected={true}
                            onClick={() => {}} // No-op for selected articles in this view
                            showCheckbox={false}
                            isRoundupCreation={true}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-8">
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm">No articles selected yet</p>
                      <p className="text-xs mt-1">Click checkboxes or drag articles here to select them</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DropZone>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="flex-shrink-0 border-t bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedArticleIds.length} of 8 articles selected (minimum 5 required)
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack}>
              Back to Setup
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={selectedArticleIds.length < 5}
              style={{
                backgroundColor: selectedArticleIds.length >= 5 ? '#5767F2' : undefined,
                borderColor: selectedArticleIds.length >= 5 ? '#2533B0' : undefined,
                color: selectedArticleIds.length >= 5 ? 'white' : undefined
              }}
              className="border hover:opacity-90 disabled:opacity-50"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}