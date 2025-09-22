import { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Search, 
  Filter,
  Zap,
  Tag,
  Calendar,
  Globe,
  Shield,
  ChevronRight,
  Sparkles,
  Clock,
  TrendingUp
} from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  description?: string;
  icon?: React.ReactNode;
  category: 'contextual' | 'operator' | 'source' | 'category' | 'time';
}

interface SearchWithSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  activeTab: string;
  activeSubTab: string;
  articles?: any[]; // Current articles data for generating realistic suggestions
  roundups?: any[]; // Current roundups data for generating realistic suggestions
  newsStories?: any[]; // Current news stories data for generating realistic suggestions
}

export function SearchWithSuggestions({ 
  value, 
  onChange, 
  placeholder = "Search for topics/tags/location",
  activeTab,
  activeSubTab,
  articles = [],
  roundups = [],
  newsStories = []
}: SearchWithSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate realistic suggestions based on current tab data
  const getTabSuggestions = (): SearchSuggestion[] => {
    const suggestions: SearchSuggestion[] = [];
    
    if (activeTab === 'news-publishing' && articles.length > 0) {
      // Contextual suggestions based on current sub-tab
      switch (activeSubTab) {
        case 'pending':
          suggestions.push(
            { id: 'breaking-news', text: 'breaking news', description: 'Breaking news articles', icon: <Zap className="h-4 w-4" />, category: 'contextual' },
            { id: 'high-safety', text: 'safety score > 8', description: 'High safety articles', icon: <Shield className="h-4 w-4" />, category: 'operator' },
            { id: 'last-hour', text: 'last 1 hour', description: 'Recently ingested', icon: <Clock className="h-4 w-4" />, category: 'time' }
          );
          break;
        case 'published':
          suggestions.push(
            { id: 'live-status', text: 'status:live', description: 'Currently live articles', icon: <Globe className="h-4 w-4" />, category: 'operator' },
            { id: 'trending', text: 'trending', description: 'Popular articles', icon: <TrendingUp className="h-4 w-4" />, category: 'contextual' }
          );
          break;
        case 'review':
          suggestions.push(
            { id: 'low-safety', text: 'safety score < 6', description: 'Articles needing review', icon: <Shield className="h-4 w-4" />, category: 'operator' },
            { id: 'flagged', text: 'flagged content', description: 'Flagged for review', icon: <Filter className="h-4 w-4" />, category: 'contextual' }
          );
          break;
      }

      // Extract unique sources from actual data
      const uniqueSources = [...new Set(articles.map(a => a.source))].slice(0, 4);
      uniqueSources.forEach(source => {
        suggestions.push({
          id: `source-${source.toLowerCase()}`,
          text: `source:${source.toLowerCase()}`,
          description: `Articles from ${source}`,
          icon: <Globe className="h-4 w-4" />,
          category: 'source'
        });
      });

      // Extract popular tags from actual data
      const allTags = articles.flatMap(a => a.tags || []);
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const popularTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag]) => ({
          id: `tag-${tag}`,
          text: tag.toLowerCase(),
          description: `Articles tagged with ${tag}`,
          icon: <Tag className="h-4 w-4" />,
          category: 'category' as const
        }));
      
      suggestions.push(...popularTags);

    } else if (activeTab === 'news-roundup' && roundups.length > 0) {
      // Roundup-specific suggestions
      suggestions.push(
        { id: 'daily-digest', text: 'daily digest', description: 'Daily roundups', icon: <Calendar className="h-4 w-4" />, category: 'contextual' },
        { id: 'weekly-summary', text: 'weekly summary', description: 'Weekly roundups', icon: <Calendar className="h-4 w-4" />, category: 'contextual' },
        { id: 'breaking-roundup', text: 'breaking news', description: 'Breaking news roundups', icon: <Zap className="h-4 w-4" />, category: 'contextual' }
      );

      // Extract roundup types from actual data
      const roundupTypes = [...new Set(roundups.map(r => r.type))].slice(0, 3);
      roundupTypes.forEach(type => {
        suggestions.push({
          id: `type-${type}`,
          text: type.toLowerCase(),
          description: `${type} roundups`,
          icon: <Tag className="h-4 w-4" />,
          category: 'category'
        });
      });

    } else if (activeTab === 'news-stories' && newsStories.length > 0) {
      // News Stories-specific suggestions
      suggestions.push(
        { id: 'ongoing-stories', text: 'ongoing stories', description: 'Currently active stories', icon: <TrendingUp className="h-4 w-4" />, category: 'contextual' },
        { id: 'breaking-stories', text: 'breaking stories', description: 'Breaking news stories', icon: <Zap className="h-4 w-4" />, category: 'contextual' },
        { id: 'international-stories', text: 'international', description: 'International news stories', icon: <Globe className="h-4 w-4" />, category: 'contextual' }
      );

      // Extract story types from actual data
      const storyTypes = [...new Set(newsStories.map(s => s.type))].slice(0, 3);
      storyTypes.forEach(type => {
        suggestions.push({
          id: `story-type-${type}`,
          text: type.toLowerCase(),
          description: `${type} stories`,
          icon: <Tag className="h-4 w-4" />,
          category: 'category'
        });
      });

      // Extract popular tags from story data
      const allStoryTags = newsStories.flatMap(s => s.tags || []);
      const storyTagCounts = allStoryTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const popularStoryTags = Object.entries(storyTagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag]) => ({
          id: `story-tag-${tag}`,
          text: tag.toLowerCase(),
          description: `Stories tagged with ${tag}`,
          icon: <Tag className="h-4 w-4" />,
          category: 'category' as const
        }));
      
      suggestions.push(...popularStoryTags);
    }

    // Time-based suggestions (universal)
    suggestions.push(
      { id: 'today', text: 'today', description: 'Content from today', icon: <Calendar className="h-4 w-4" />, category: 'time' },
      { id: 'yesterday', text: 'yesterday', description: 'Content from yesterday', icon: <Calendar className="h-4 w-4" />, category: 'time' },
      { id: 'this-week', text: 'this week', description: 'Content from this week', icon: <Calendar className="h-4 w-4" />, category: 'time' }
    );

    // Advanced operators
    suggestions.push(
      { id: 'time-24h', text: 'time:24h', description: 'Last 24 hours', icon: <Clock className="h-4 w-4" />, category: 'operator' },
      { id: 'time-7d', text: 'time:7d', description: 'Last 7 days', icon: <Clock className="h-4 w-4" />, category: 'operator' }
    );

    return suggestions;
  };

  // Filter suggestions based on current input
  const suggestions = getTabSuggestions();
  const filteredSuggestions = value.trim() === '' 
    ? suggestions 
    : suggestions.filter(s => 
        s.text.toLowerCase().includes(value.toLowerCase()) ||
        s.description?.toLowerCase().includes(value.toLowerCase())
      );

  // Group suggestions by category
  const groupedSuggestions = filteredSuggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const categoryLabels = {
    contextual: `Suggestions for ${activeSubTab}`,
    operator: 'Search Operators',
    source: 'News Sources',
    category: 'Categories & Tags',
    time: 'Time Filters'
  };

  const categoryIcons = {
    contextual: <Sparkles className="h-4 w-4" />,
    operator: <Filter className="h-4 w-4" />,
    source: <Globe className="h-4 w-4" />,
    category: <Tag className="h-4 w-4" />,
    time: <Clock className="h-4 w-4" />
  };

  const categoryOrder = ['contextual', 'operator', 'source', 'category', 'time'];

  return (
    <div className="relative w-80" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4 h-10"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#D9D9D9] shadow-xl z-50 overflow-hidden">
          <div className="max-h-80 w-full">
            {/* Search Tips Header */}
            {value.trim() === '' && (
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  💡 Use operators like <span className="bg-muted px-1.5 py-0.5 rounded text-xs font-medium">source:</span>, <span className="bg-muted px-1.5 py-0.5 rounded text-xs font-medium">time:</span>, or search by tags and topics
                </p>
              </div>
            )}

            <ScrollArea className="max-h-64">
              <div className="py-2">
                {categoryOrder.map(category => {
                  const items = groupedSuggestions[category];
                  if (!items || items.length === 0) return null;

                  return (
                    <div key={category} className="mb-1">
                      {/* Category Header */}
                      <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/20">
                        {categoryIcons[category as keyof typeof categoryIcons]}
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </div>
                      
                      {/* Category Items */}
                      <div className="space-y-0">
                        {items.map((suggestion) => (
                          <Button
                            key={suggestion.id}
                            variant="ghost"
                            className="w-full justify-start px-4 py-2.5 h-auto font-normal hover:bg-muted/50 rounded-none"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className="text-muted-foreground flex-shrink-0">
                                {suggestion.icon}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <div className="text-sm font-medium truncate">{suggestion.text}</div>
                                {suggestion.description && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {suggestion.description}
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {filteredSuggestions.length === 0 && value.trim() !== '' && (
                  <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                    No suggestions found for "<span className="font-medium">{value}</span>"
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}