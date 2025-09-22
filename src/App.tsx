import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { CMSContent } from './components/CMSContent';
import { CreateRoundupModal } from './components/CreateRoundupModal';
import CreateNewsStoryModal, { NewsStory } from './components/CreateNewsStoryModal';
import { RoundupCreationPage } from './components/RoundupCreationPage';
import { RoundupPrePublishPage } from './components/RoundupPrePublishPage';
import { RoundupPublishModal, RoundupPublishSettings } from './components/RoundupPublishModal';
import { RoundupArchiveModal } from './components/RoundupArchiveModal';
import { StoryCreationPage } from './components/StoryCreationPage';
import { StoryPrePublishPage } from './components/StoryPrePublishPage';
import { StoryPublishModal, StoryPublishSettings } from './components/StoryPublishModal';
import { StoryArchiveModal } from './components/StoryArchiveModal';
import { BulkRejectModal } from './components/BulkRejectModal';
import { BulkAddToReviewModal } from './components/BulkAddToReviewModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { Toaster } from './components/ui/sonner';
import { mockArticles } from './data/mockArticles';
import { mockRoundups } from './data/mockRoundups';
import { mockNewsStories } from './data/mockNewsStories';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [activeTab, setActiveTab] = useState('news-publishing');
  const [activeSubTab, setActiveSubTab] = useState('pending');
  const [selectedArticle, setSelectedArticle] = useState<typeof mockArticles[0] | null>(null);
  const [selectedRoundup, setSelectedRoundup] = useState<typeof mockRoundups[0] | null>(null);
  const [selectedStory, setSelectedStory] = useState<typeof mockNewsStories[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('ingestion-desc');
  const [articles, setArticles] = useState(mockArticles);
  const [roundups, setRoundups] = useState(mockRoundups);
  const [newsStories, setNewsStories] = useState(mockNewsStories);
  const [viewedArticleIds, setViewedArticleIds] = useState<Set<string>>(new Set());
  
  // Bulk operations state
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isSuggestMode, setIsSuggestMode] = useState(false);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);

  // Bulk confirmation modals
  const [isBulkRejectModalOpen, setIsBulkRejectModalOpen] = useState(false);
  const [isBulkAddToReviewModalOpen, setIsBulkAddToReviewModalOpen] = useState(false);

  // Roundup creation state
  const [isCreateRoundupModalOpen, setIsCreateRoundupModalOpen] = useState(false);
  
  // Story creation state
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [isStoryCreationMode, setIsStoryCreationMode] = useState(false);
  const [isStoryPrePublishMode, setIsStoryPrePublishMode] = useState(false);
  
  // Disclaimer modal state
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [pendingStoryData, setPendingStoryData] = useState<{
    headline: string;
    description: string;
    category: string;
    subcategory: string;
    tags: string[];
  } | null>(null);
  const [selectedStoryArticleIds, setSelectedStoryArticleIds] = useState<string[]>([]);
  
  // Story publish/archive modals
  const [isStoryPublishModalOpen, setIsStoryPublishModalOpen] = useState(false);
  const [isStoryArchiveModalOpen, setIsStoryArchiveModalOpen] = useState(false);
  
  const [isRoundupCreationMode, setIsRoundupCreationMode] = useState(false);
  const [isRoundupPrePublishMode, setIsRoundupPrePublishMode] = useState(false);
  const [pendingRoundupData, setPendingRoundupData] = useState<{
    name: string;
    description: string;
    type: string;
    tags: string[];
  } | null>(null);
  const [selectedRoundupArticleIds, setSelectedRoundupArticleIds] = useState<string[]>([]);
  
  // Roundup publish/archive modals
  const [isRoundupPublishModalOpen, setIsRoundupPublishModalOpen] = useState(false);
  const [isRoundupArchiveModalOpen, setIsRoundupArchiveModalOpen] = useState(false);

  // Check if disclaimer has been shown before
  useEffect(() => {
    const disclaimerShown = localStorage.getItem('cms-disclaimer-shown');
    if (!disclaimerShown) {
      setIsDisclaimerModalOpen(true);
    }
  }, []);

  // Handle disclaimer acknowledgment
  const handleDisclaimerClose = () => {
    localStorage.setItem('cms-disclaimer-shown', 'true');
    setIsDisclaimerModalOpen(false);
  };

  // Auto-select first article when on news-publishing tab and no article is selected
  useEffect(() => {
    if (activeTab === 'news-publishing' && !selectedArticle && !isRoundupCreationMode && !isRoundupPrePublishMode && !isStoryCreationMode && !isStoryPrePublishMode) {
      const filteredArticles = getFilteredArticles();
      if (filteredArticles.length > 0) {
        handleArticleSelect(filteredArticles[0]);
      }
    }
  }, [activeTab, activeSubTab, articles, searchTerm, filterBy, sortBy, quickFilters, selectedArticle, isRoundupCreationMode, isRoundupPrePublishMode, isStoryCreationMode, isStoryPrePublishMode]);

  // Auto-select first article when in roundup detail view and no article is selected
  useEffect(() => {
    if (activeTab === 'news-roundup' && selectedRoundup && !selectedArticle && !isRoundupCreationMode && !isRoundupPrePublishMode && !isStoryCreationMode && !isStoryPrePublishMode) {
      if (selectedRoundup.articleIds && selectedRoundup.articleIds.length > 0) {
        const roundupArticles = articles.filter(article => 
          selectedRoundup.articleIds.includes(article.id) && 
          article.status === 'published'
        );
        
        if (roundupArticles.length > 0) {
          setSelectedArticle(roundupArticles[0]);
        }
      }
    }
  }, [activeTab, selectedRoundup, selectedArticle, articles, isRoundupCreationMode, isRoundupPrePublishMode]);

  // Handle case where selected article is no longer available in current roundup
  useEffect(() => {
    if (activeTab === 'news-roundup' && selectedRoundup && selectedArticle && !isRoundupCreationMode && !isRoundupPrePublishMode && !isStoryCreationMode && !isStoryPrePublishMode) {
      if (selectedRoundup.articleIds && selectedRoundup.articleIds.length > 0) {
        const roundupArticles = articles.filter(article => 
          selectedRoundup.articleIds.includes(article.id) && 
          article.status === 'published'
        );
        
        // Check if the currently selected article is still in the roundup
        const isSelectedArticleInRoundup = roundupArticles.some(article => article.id === selectedArticle.id);
        
        if (!isSelectedArticleInRoundup && roundupArticles.length > 0) {
          // Select the first available article if current selection is not in roundup
          setSelectedArticle(roundupArticles[0]);
        } else if (roundupArticles.length === 0) {
          // Clear selection if no articles are available
          setSelectedArticle(null);
        }
      }
    }
  }, [activeTab, selectedRoundup, selectedArticle, articles, isRoundupCreationMode, isRoundupPrePublishMode, isStoryCreationMode, isStoryPrePublishMode]);

  // Handle article selection and mark as viewed
  const handleArticleSelect = (article: typeof mockArticles[0]) => {
    setSelectedArticle(article);
    // Mark article as viewed when selected
    setViewedArticleIds(prev => new Set([...prev, article.id]));
  };

  // Handle article updates
  const handleArticleUpdate = (articleId: string, updates: Partial<typeof mockArticles[0]>) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId ? { ...article, ...updates } : article
    ));
    
    if (selectedArticle?.id === articleId) {
      setSelectedArticle(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Handle status changes
  const handleStatusChange = (articleId: string, status: typeof mockArticles[0]['status']) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId ? { ...article, status } : article
    ));
    
    if (selectedArticle?.id === articleId) {
      setSelectedArticle(prev => prev ? { ...prev, status } : null);
    }
  };

  // Handle bulk status changes with confirmation
  const handleBulkStatusChange = (articleIds: string[], status: typeof mockArticles[0]['status']) => {
    if (articleIds.length === 0) {
      toast.warning("No articles selected", {
        description: "Please select articles before performing bulk actions.",
        duration: 3000,
      });
      return;
    }

    if (status === 'rejected') {
      setIsBulkRejectModalOpen(true);
    } else if (status === 'review') {
      setIsBulkAddToReviewModalOpen(true);
    } else {
      // For publish action, directly perform the change
      performBulkStatusChange(articleIds, status);
    }
  };

  // Perform the actual bulk status change
  const performBulkStatusChange = (articleIds: string[], status: typeof mockArticles[0]['status']) => {
    if (articleIds.length === 0) {
      toast.warning("No articles selected", {
        description: "Please select articles before performing bulk actions.",
        duration: 3000,
      });
      return;
    }

    setArticles(prev => prev.map(article => 
      articleIds.includes(article.id) ? { ...article, status } : article
    ));
    
    // Clear selections after bulk action
    setSelectedArticleIds([]);
    setIsBulkMode(false);
    setIsSuggestMode(false);

    // Show success toast
    const statusText = status === 'rejected' ? 'rejected' : status === 'review' ? 'moved to review' : 'published';
    toast.success(`Articles ${statusText} successfully!`, {
      description: `${articleIds.length} article${articleIds.length > 1 ? 's' : ''} ${statusText}.`,
      duration: 3000,
    });
  };

  // Handle bulk reject confirmation
  const handleBulkRejectConfirm = (reason?: string) => {
    performBulkStatusChange(selectedArticleIds, 'rejected');
    setIsBulkRejectModalOpen(false);
  };

  // Handle bulk add to review confirmation
  const handleBulkAddToReviewConfirm = (notes?: string) => {
    performBulkStatusChange(selectedArticleIds, 'review');
    setIsBulkAddToReviewModalOpen(false);
  };

  // Handle suggest bulk publishing - core logic only (called by wrapper function)
  const handleSuggestBulkPublishing = () => {
    // Get filtered articles for current state (respects search, filters, etc.)
    const filteredArticles = getFilteredArticles();
    
    if (filteredArticles.length === 0) {
      toast.warning("No articles available", {
        description: `No articles found in current ${activeSubTab} view.`,
        duration: 4000,
      });
      return;
    }
    
    // Sort by safety tier (descending - higher tier numbers are better) and then by recency (descending)
    const sortedArticles = [...filteredArticles]
      .sort((a, b) => {
        if (b.safetyScore !== a.safetyScore) {
          return b.safetyScore - a.safetyScore; // Higher tier (5) ranks higher than lower tier (1)
        }
        return new Date(b.ingestionTime).getTime() - new Date(a.ingestionTime).getTime();
      });
    
    // Select between 3-5 articles (prefer 5, but ensure minimum 3)
    const maxSelectable = Math.min(5, sortedArticles.length);
    const minSelectable = Math.min(3, sortedArticles.length);
    const selectedCount = Math.max(minSelectable, maxSelectable);
    
    if (selectedCount < 3) {
      toast.warning("Insufficient articles for bulk suggestion", {
        description: `Need at least 3 articles in current view for bulk suggestion.`,
        duration: 4000,
      });
      return;
    }
    
    const topArticles = sortedArticles.slice(0, selectedCount);
    
    // Clear existing selections and set new ones
    setSelectedArticleIds(topArticles.map(a => a.id));
    
    toast.success("Bulk selection suggested", {
      description: `${topArticles.length} articles selected based on safety tier and recency.`,
      duration: 3000,
    });
  };

  // Handle manual article selection
  const handleArticleSelection = (articleId: string, isSelected: boolean) => {
    if (!isBulkMode) {
      // If not in bulk mode, activate it when user tries to select
      setIsBulkMode(true);
      toast.info("Selection mode activated", {
        description: "You can now select multiple articles.",
        duration: 2000,
      });
    }

    if (isSelected) {
      if (selectedArticleIds.length >= 5) {
        toast.warning("Selection limit reached", {
          description: "You can select up to 5 articles at a time.",
          duration: 3000,
        });
        return;
      }
      setSelectedArticleIds(prev => [...prev, articleId]);
      // Reset suggest mode when manually selecting articles
      setIsSuggestMode(false);
    } else {
      setSelectedArticleIds(prev => prev.filter(id => id !== articleId));
    }
  };

  // Handle bulk mode toggle - improved coordination
  const handleBulkModeToggle = () => {
    if (isBulkMode) {
      // If bulk mode is active, turn it off and clear selections
      setIsBulkMode(false);
      setIsSuggestMode(false);
      setSelectedArticleIds([]);
      
      toast.info("Selection mode deactivated", {
        description: "Article selection has been cleared.",
        duration: 2000,
      });
    } else {
      // Turn on bulk mode - let user manually select or use suggestions
      setIsBulkMode(true);
      setIsSuggestMode(false); // Reset suggest mode when manually toggling
      
      toast.info("Selection mode activated", {
        description: "Click on articles to select them, or use 'Suggest Bulk Publishing'.",
        duration: 3000,
      });
    }
  };

  // Handle suggest bulk publishing - enable both modes and make suggestions
  const handleSuggestBulkPublishingWithMode = () => {
    // Enable both modes when suggesting
    setIsBulkMode(true);
    setIsSuggestMode(true);
    
    // Clear any existing selections first
    setSelectedArticleIds([]);
    
    // Use setTimeout to ensure state updates are applied before calling suggest function
    setTimeout(() => {
      handleSuggestBulkPublishing();
    }, 0);
  };

  // Handle tab change with appropriate sub-tab reset
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Don't reset state if we're in roundup or story creation/pre-publish mode
    if (isRoundupCreationMode || isRoundupPrePublishMode || isStoryCreationMode || isStoryPrePublishMode) {
      // Allow navigation but maintain workflow state
      return;
    }
    
    // Clear selections when switching tabs
    setSelectedArticleIds([]);
    setIsBulkMode(false);
    setIsSuggestMode(false);
    setSelectedArticle(null);
    setSelectedRoundup(null);
    setSelectedStory(null);
    
    // Reset to appropriate default sub-tab based on main tab
    if (tab === 'news-publishing') {
      setActiveSubTab('pending');
      // Auto-select first article after state update
      setTimeout(() => {
        // Filter for pending articles since that's the default sub-tab for news-publishing
        let filtered = articles.filter(article => article.status === 'pending');

        // Apply current filters
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

        if (quickFilters.length > 0) {
          filtered = filtered.filter(article => {
            return quickFilters.some(filter => 
              article.newsType.toLowerCase().includes(filter.toLowerCase()) ||
              article.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())) ||
              article.subType.some(subType => subType.toLowerCase().includes(filter.toLowerCase()))
            );
          });
        }

        // Sort articles
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

        if (filtered.length > 0) {
          setSelectedArticle(filtered[0]);
        }
      }, 0);
    } else if (tab === 'news-roundup') {
      setActiveSubTab('live');
    } else if (tab === 'news-stories') {
      setActiveSubTab('live');
    } else {
      setActiveSubTab('live'); // Default for other tabs
    }
  };

  // Handle round-up selection for detail view
  const handleRoundupSelect = (roundup: typeof mockRoundups[0]) => {
    setSelectedRoundup(roundup);
    setSelectedArticle(null); // Clear article selection when entering roundup detail
    
    // Auto-select first article from roundup after state update
    setTimeout(() => {
      if (roundup.articleIds && roundup.articleIds.length > 0) {
        const roundupArticles = articles.filter(article => 
          roundup.articleIds.includes(article.id) && 
          article.status === 'published'
        );
        
        if (roundupArticles.length > 0) {
          setSelectedArticle(roundupArticles[0]);
        }
      }
    }, 0);
  };

  // Handle back from round-up detail view
  const handleRoundupBack = () => {
    setSelectedRoundup(null);
    setSelectedArticle(null);
    
    // If we have pending roundup data, it means we came from roundup creation flow
    // Restore the creation mode and selections
    if (pendingRoundupData && selectedRoundupArticleIds.length > 0) {
      setIsRoundupPrePublishMode(true);
      // Don't set creation mode, stay in pre-publish mode
    }
  };

  // Handle round-up status changes
  const handleRoundupStatusChange = (roundupId: string, status: typeof mockRoundups[0]['status']) => {
    setRoundups(prev => prev.map(roundup => 
      roundup.id === roundupId ? { ...roundup, status } : roundup
    ));
    
    if (selectedRoundup?.id === roundupId) {
      setSelectedRoundup(prev => prev ? { ...prev, status } : null);
    }
  };

  // Handle news story status changes
  const handleStoryStatusChange = (storyId: string, status: typeof mockNewsStories[0]['status']) => {
    setNewsStories(prev => prev.map(story => 
      story.id === storyId ? { ...story, status } : story
    ));
    
    if (selectedStory?.id === storyId) {
      setSelectedStory(prev => prev ? { ...prev, status } : null);
    }
  };

  // Handle story selection for detail view
  const handleStorySelect = (story: typeof mockNewsStories[0]) => {
    setSelectedStory(story);
    setSelectedArticle(null); // Clear article selection when entering story detail
  };

  // Handle back from story detail view
  const handleStoryBack = () => {
    setSelectedStory(null);
    setSelectedArticle(null);
  };

  // Helper function to get filtered and sorted articles for current state
  const getFilteredArticles = () => {
    let filtered = articles;

    // Filter by sub-tab status
    if (activeSubTab !== 'all') {
      filtered = filtered.filter(article => article.status === activeSubTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by source
    if (filterBy !== 'all') {
      filtered = filtered.filter(article => article.source.toLowerCase().includes(filterBy.toLowerCase()));
    }

    // Apply quick filters
    if (quickFilters.length > 0) {
      filtered = filtered.filter(article => {
        if (activeSubTab === 'published') {
          return quickFilters.includes(article.publishStatus || '');
        } else {
          return quickFilters.some(filter => 
            article.newsType.toLowerCase().includes(filter.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())) ||
            article.subType.some(subType => subType.toLowerCase().includes(filter.toLowerCase()))
          );
        }
      });
    }

    // Sort articles
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
  };

  // Handle sub-tab change with auto-selection for news-publishing
  const handleSubTabChange = (newSubTab: string) => {
    setActiveSubTab(newSubTab);
    
    // Clear bulk selections when changing sub-tabs
    setSelectedArticleIds([]);
    setIsBulkMode(false);
    setIsSuggestMode(false);
    
    // Auto-select first article for news-publishing tab
    if (activeTab === 'news-publishing') {
      setSelectedArticle(null); // Clear current selection first
      setTimeout(() => {
        let filtered = articles;

        // Filter by new sub-tab status
        if (newSubTab !== 'all') {
          filtered = filtered.filter(article => article.status === newSubTab);
        }

        // Apply current filters
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

        if (quickFilters.length > 0) {
          filtered = filtered.filter(article => {
            if (newSubTab === 'published') {
              return quickFilters.includes(article.publishStatus || '');
            } else {
              return quickFilters.some(filter => 
                article.newsType.toLowerCase().includes(filter.toLowerCase()) ||
                article.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())) ||
                article.subType.some(subType => subType.toLowerCase().includes(filter.toLowerCase()))
              );
            }
          });
        }

        // Sort articles
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

        if (filtered.length > 0) {
          handleArticleSelect(filtered[0]);
        }
      }, 0);
    }
  };

  // Handle create roundup modal
  const handleCreateRoundupClick = () => {
    setIsCreateRoundupModalOpen(true);
  };

  // Handle create story click
  const handleCreateStoryClick = () => {
    setIsCreateStoryModalOpen(true);
  };

  // Handle story creation proceed (similar to roundup creation)
  const handleStoryCreationProceed = (storyData: {
    headline: string;
    description: string;
    category: string;
    subcategory: string;
    tags: string[];
  }) => {
    setPendingStoryData(storyData);
    setIsCreateStoryModalOpen(false);
    setIsStoryCreationMode(true);
    
    // Clear any existing selections and reset filters for story creation
    setSelectedArticleIds([]);
    setIsBulkMode(false);
    setIsSuggestMode(false);
    setSearchTerm('');
    setFilterBy('all');
    setSortBy('ingestion-desc');
    setQuickFilters([]);
  };

  // Handle back from story creation
  const handleStoryCreationBack = () => {
    setIsStoryCreationMode(false);
    setPendingStoryData(null);
    setSelectedArticleIds([]);
  };

  // Handle story creation completion - move to pre-publish
  const handleCreateStory = (selectedArticleIds: string[]) => {
    if (!pendingStoryData) return;

    // Batch state updates to prevent intermediate rendering
    setSelectedStoryArticleIds(selectedArticleIds);
    setSelectedArticleIds([]);
    setIsStoryCreationMode(false);
    setIsStoryPrePublishMode(true);

    toast.success("Articles selected successfully!", {
      description: `${selectedArticleIds.length} articles ready for story publication.`,
      duration: 3000,
    });
  };

  // Handle back from story pre-publish to creation
  const handleStoryPrePublishBack = () => {
    setIsStoryPrePublishMode(false);
    setIsStoryCreationMode(true);
    setSelectedArticleIds(selectedStoryArticleIds);
  };

  // Handle edit selection from story pre-publish
  const handleStoryPrePublishEdit = () => {
    setIsStoryPrePublishMode(false);
    setIsStoryCreationMode(true);
    setSelectedArticleIds(selectedStoryArticleIds);
  };

  // Handle archive story
  const handleArchiveStory = () => {
    setIsStoryArchiveModalOpen(true);
  };

  // Handle story archive confirmation
  const handleStoryArchiveConfirm = (reason?: string) => {
    setIsStoryArchiveModalOpen(false);
    setIsStoryPrePublishMode(false);
    setPendingStoryData(null);
    setSelectedStoryArticleIds([]);
    
    toast.success("Story archived", {
      description: "The story has been moved to archives.",
      duration: 3000,
    });
  };

  // Handle publish story
  const handlePublishStory = () => {
    setIsStoryPublishModalOpen(true);
  };

  // Handle story publish confirmation
  const handleStoryPublishConfirm = (settings: StoryPublishSettings) => {
    if (!pendingStoryData) return;

    const publishTime = settings.startTimeMode === 'now' ? new Date() : new Date(`${settings.customDate?.toISOString().split('T')[0]}T${settings.customTime}`);
    const expireTime = new Date(publishTime.getTime() + settings.durationValue * (settings.durationType === 'days' ? 24 : 1) * 60 * 60 * 1000);

    // Create new story
    const newStory = {
      id: `story-${Date.now()}`,
      title: pendingStoryData.headline,
      subtitle: pendingStoryData.description,
      status: 'live' as const,
      imageUrl: articles.find(a => selectedStoryArticleIds.includes(a.id))?.imageUrl || 'https://images.unsplash.com/photo-1650984661525-7e6b1b874e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwZGlnaXRhbCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU1NzA3NjkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      publishedTime: publishTime.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
      }),
      publishedTimezone: 'IST',
      publishedDate: publishTime.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }),
      expiresTime: expireTime.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
      }),
      expiresTimezone: 'IST',
      expiresDate: expireTime.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }),
      eventCount: selectedStoryArticleIds.length,
      tags: pendingStoryData.tags,
      type: `${pendingStoryData.category} - ${pendingStoryData.subcategory}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articleIds: selectedStoryArticleIds,
      lastEventDate: new Date().toISOString()
    };

    // Add to stories list
    setNewsStories(prev => [newStory, ...prev]);

    // Reset states
    setIsStoryPublishModalOpen(false);
    setIsStoryPrePublishMode(false);
    setPendingStoryData(null);
    setSelectedStoryArticleIds([]);
    
    // Switch to stories tab and select the new story
    setActiveTab('news-stories');
    setActiveSubTab('live');
    setSelectedStory(newStory);

    const publishMessage = settings.startTimeMode === 'now' 
      ? `"${pendingStoryData.headline}" is now live with ${selectedStoryArticleIds.length} articles.`
      : `"${pendingStoryData.headline}" scheduled for publication.`;

    toast.success("Story published successfully!", {
      description: publishMessage,
      duration: 4000,
    });
  };

  // Handle roundup creation proceed
  const handleRoundupCreationProceed = (roundupData: {
    name: string;
    description: string;
    type: string;
    tags: string[];
  }) => {
    setPendingRoundupData(roundupData);
    setIsCreateRoundupModalOpen(false);
    setIsRoundupCreationMode(true);
    
    // Clear any existing selections and reset filters for roundup creation
    setSelectedArticleIds([]);
    setIsBulkMode(false);
    setIsSuggestMode(false);
    setSearchTerm('');
    setFilterBy('all');
    setSortBy('ingestion-desc');
    setQuickFilters([]);
  };

  // Handle back from roundup creation
  const handleRoundupCreationBack = () => {
    setIsRoundupCreationMode(false);
    setPendingRoundupData(null);
    setSelectedArticleIds([]);
  };

  // Handle roundup creation completion - move to pre-publish
  const handleCreateRoundup = (selectedArticleIds: string[]) => {
    if (!pendingRoundupData) return;

    // Batch state updates to prevent intermediate rendering
    setSelectedRoundupArticleIds(selectedArticleIds);
    setSelectedArticleIds([]);
    setIsRoundupCreationMode(false);
    setIsRoundupPrePublishMode(true);

    toast.success("Articles selected successfully!", {
      description: `${selectedArticleIds.length} articles ready for roundup publication.`,
      duration: 3000,
    });
  };

  // Handle back from pre-publish to creation
  const handlePrePublishBack = () => {
    setIsRoundupPrePublishMode(false);
    setIsRoundupCreationMode(true);
    setSelectedArticleIds(selectedRoundupArticleIds);
  };

  // Handle edit selection from pre-publish
  const handlePrePublishEdit = () => {
    setIsRoundupPrePublishMode(false);
    setIsRoundupCreationMode(true);
    setSelectedArticleIds(selectedRoundupArticleIds);
  };

  // Handle archive roundup
  const handleArchiveRoundup = () => {
    setIsRoundupArchiveModalOpen(true);
  };

  // Handle archive confirmation
  const handleArchiveConfirm = (reason?: string) => {
    setIsRoundupArchiveModalOpen(false);
    setIsRoundupPrePublishMode(false);
    setPendingRoundupData(null);
    setSelectedRoundupArticleIds([]);
    
    toast.success("Roundup archived", {
      description: "The roundup has been moved to archives.",
      duration: 3000,
    });
  };

  // Handle publish roundup
  const handlePublishRoundup = () => {
    setIsRoundupPublishModalOpen(true);
  };

  // Handle publish confirmation
  const handlePublishConfirm = (settings: RoundupPublishSettings) => {
    if (!pendingRoundupData) return;

    const publishTime = settings.startTimeMode === 'now' ? new Date() : new Date(`${settings.customDate?.toISOString().split('T')[0]}T${settings.customTime}`);
    const expireTime = new Date(publishTime.getTime() + settings.durationValue * (settings.durationType === 'days' ? 24 : 1) * 60 * 60 * 1000);

    // Create new roundup
    const newRoundup = {
      id: `roundup-${Date.now()}`,
      title: pendingRoundupData.name,
      subtitle: pendingRoundupData.description,
      status: 'live' as const,
      imageUrl: articles.find(a => selectedRoundupArticleIds.includes(a.id))?.imageUrl || 'https://images.unsplash.com/photo-1716703432455-3045789de738?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlY2hub2xvZ3klMjBtZWV0aW5nfGVufDF8fHx8MTc1NTcwNzY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      publishedTime: publishTime.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
      }),
      publishedTimezone: 'IST',
      publishedDate: publishTime.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }),
      expiresTime: expireTime.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
      }),
      expiresTimezone: 'IST',
      expiresDate: expireTime.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }),
      tags: pendingRoundupData.tags,
      type: pendingRoundupData.type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articleIds: selectedRoundupArticleIds
    };

    // Add to roundups list
    setRoundups(prev => [newRoundup, ...prev]);

    // Reset states
    setIsRoundupPublishModalOpen(false);
    setIsRoundupPrePublishMode(false);
    setPendingRoundupData(null);
    setSelectedRoundupArticleIds([]);
    
    // Switch to roundups tab and select the new roundup
    setActiveTab('news-roundup');
    setActiveSubTab('live');
    setSelectedRoundup(newRoundup);

    const publishMessage = settings.startTimeMode === 'now' 
      ? `"${pendingRoundupData.name}" is now live with ${selectedRoundupArticleIds.length} articles.`
      : `"${pendingRoundupData.name}" scheduled for publication.`;

    toast.success("Roundup published successfully!", {
      description: publishMessage,
      duration: 4000,
    });
  };

  // Determine what to render based on current mode
  const renderMainContent = () => {
    // Prioritize story workflow when we have pending story data
    if (pendingStoryData) {
      if (isStoryPrePublishMode) {
        const selectedArticles = articles.filter(a => selectedStoryArticleIds.includes(a.id));
        return (
          <StoryPrePublishPage
            storyData={pendingStoryData}
            selectedArticles={selectedArticles}
            onBack={handleStoryPrePublishBack}
            onEdit={handleStoryPrePublishEdit}
            onArchive={handleArchiveStory}
            onPublish={handlePublishStory}
          />
        );
      }

      if (isStoryCreationMode) {
        return (
          <StoryCreationPage
            storyData={pendingStoryData}
            articles={articles}
            onBack={handleStoryCreationBack}
            onCreateStory={handleCreateStory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterBy={filterBy}
            onFilterChange={setFilterBy}
            sortBy={sortBy}
            onSortChange={setSortBy}
            quickFilters={quickFilters}
            onQuickFiltersChange={setQuickFilters}
            initialSelectedArticleIds={selectedArticleIds}
          />
        );
      }

      // If we have pending story data but neither mode is active, something went wrong
      // Default to pre-publish mode to prevent showing CMSContent
      if (selectedStoryArticleIds.length > 0) {
        const selectedArticles = articles.filter(a => selectedStoryArticleIds.includes(a.id));
        return (
          <StoryPrePublishPage
            storyData={pendingStoryData}
            selectedArticles={selectedArticles}
            onBack={handleStoryPrePublishBack}
            onEdit={handleStoryPrePublishEdit}
            onArchive={handleArchiveStory}
            onPublish={handlePublishStory}
          />
        );
      }
    }

    // Prioritize roundup workflow when we have pending roundup data
    if (pendingRoundupData) {
      if (isRoundupPrePublishMode) {
        const selectedArticles = articles.filter(a => selectedRoundupArticleIds.includes(a.id));
        return (
          <RoundupPrePublishPage
            roundupData={pendingRoundupData}
            selectedArticles={selectedArticles}
            onBack={handlePrePublishBack}
            onEdit={handlePrePublishEdit}
            onArchive={handleArchiveRoundup}
            onPublish={handlePublishRoundup}
          />
        );
      }

      if (isRoundupCreationMode) {
        return (
          <RoundupCreationPage
            roundupData={pendingRoundupData}
            articles={articles}
            onBack={handleRoundupCreationBack}
            onCreateRoundup={handleCreateRoundup}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterBy={filterBy}
            onFilterChange={setFilterBy}
            sortBy={sortBy}
            onSortChange={setSortBy}
            quickFilters={quickFilters}
            onQuickFiltersChange={setQuickFilters}
            initialSelectedArticleIds={selectedArticleIds}
          />
        );
      }

      // If we have pending roundup data but neither mode is active, something went wrong
      // Default to pre-publish mode to prevent showing CMSContent
      if (selectedRoundupArticleIds.length > 0) {
        const selectedArticles = articles.filter(a => selectedRoundupArticleIds.includes(a.id));
        return (
          <RoundupPrePublishPage
            roundupData={pendingRoundupData}
            selectedArticles={selectedArticles}
            onBack={handlePrePublishBack}
            onEdit={handlePrePublishEdit}
            onArchive={handleArchiveRoundup}
            onPublish={handlePublishRoundup}
          />
        );
      }
    }

    return (
      <CMSContent
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        onSubTabChange={handleSubTabChange}
        selectedArticle={selectedArticle}
        onArticleSelect={handleArticleSelect}
        viewedArticleIds={viewedArticleIds}
        selectedRoundup={selectedRoundup}
        onRoundupSelect={handleRoundupSelect}
        onRoundupBack={handleRoundupBack}
        selectedStory={selectedStory}
        onStorySelect={handleStorySelect}
        onStoryBack={handleStoryBack}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        sortBy={sortBy}
        onSortChange={setSortBy}
        articles={articles}
        onArticleUpdate={handleArticleUpdate}
        onStatusChange={handleStatusChange}
        selectedArticleIds={selectedArticleIds}
        isBulkMode={isBulkMode}
        isSuggestMode={isSuggestMode}
        quickFilters={quickFilters}
        onArticleSelection={handleArticleSelection}
        onBulkModeToggle={handleBulkModeToggle}
        onSuggestBulkPublishing={handleSuggestBulkPublishingWithMode}
        onBulkStatusChange={handleBulkStatusChange}
        onQuickFiltersChange={setQuickFilters}
        onCancelSelection={() => {
          setSelectedArticleIds([]);
          setIsBulkMode(false);
          setIsSuggestMode(false);
        }}
        onRoundupStatusChange={handleRoundupStatusChange}
        onStoryStatusChange={handleStoryStatusChange}
        onCreateRoundupClick={handleCreateRoundupClick}
        onCreateStoryClick={handleCreateStoryClick}
        roundups={roundups}
        newsStories={newsStories}
      />
    );
  };

  return (
    <div className="h-screen" style={{ backgroundColor: '#F9FBFC' }}>
      {/* Main container */}
      <div className="h-full flex">
        {/* Column 1 - Primary Navigation - always visible */}
        <div className="w-[3.5vw] min-w-[60px] flex-shrink-0 z-0">
          <Navigation 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            articles={articles}
            roundups={roundups}
            newsStories={newsStories}
          />
        </div>
        
        {/* Column 2 - Main Content with border, drop shadow and 32px border radius */}
        <div className="flex-1 relative z-10 p-2">
          <div 
            className="h-full rounded-[32px] overflow-hidden"
            style={{
              filter: 'drop-shadow(-6px 6px 24px rgba(87, 103, 242, 0.08)) drop-shadow(0px 0px 0px rgba(87, 103, 242, 0.08))',
              border: '0.5px solid #999999'
            }}
          >
            {renderMainContent()}
          </div>
        </div>
      </div>
      
      {/* Create Roundup Modal */}
      <CreateRoundupModal
        isOpen={isCreateRoundupModalOpen}
        onClose={() => setIsCreateRoundupModalOpen(false)}
        onProceed={handleRoundupCreationProceed}
      />

      {/* Roundup Publish Modal */}
      {pendingRoundupData && (
        <RoundupPublishModal
          isOpen={isRoundupPublishModalOpen}
          onClose={() => setIsRoundupPublishModalOpen(false)}
          onConfirm={handlePublishConfirm}
          roundupData={pendingRoundupData}
          articleCount={selectedRoundupArticleIds.length}
        />
      )}

      {/* Roundup Archive Modal */}
      {pendingRoundupData && (
        <RoundupArchiveModal
          isOpen={isRoundupArchiveModalOpen}
          onClose={() => setIsRoundupArchiveModalOpen(false)}
          onConfirm={handleArchiveConfirm}
          roundupData={pendingRoundupData}
          articleCount={selectedRoundupArticleIds.length}
        />
      )}

      {/* Bulk Reject Modal */}
      <BulkRejectModal
        isOpen={isBulkRejectModalOpen}
        onClose={() => setIsBulkRejectModalOpen(false)}
        onConfirm={handleBulkRejectConfirm}
        articleCount={selectedArticleIds.length}
      />

      {/* Bulk Add to Review Modal */}
      <BulkAddToReviewModal
        isOpen={isBulkAddToReviewModalOpen}
        onClose={() => setIsBulkAddToReviewModalOpen(false)}
        onConfirm={handleBulkAddToReviewConfirm}
        articleCount={selectedArticleIds.length}
      />

      {/* Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerModalOpen}
        onClose={handleDisclaimerClose}
      />

      {/* Create News Story Modal */}
      <CreateNewsStoryModal
        open={isCreateStoryModalOpen}
        onCancel={() => setIsCreateStoryModalOpen(false)}
        onSubmit={handleStoryCreationProceed}
      />

      {/* Story Publish Modal */}
      {pendingStoryData && (
        <StoryPublishModal
          isOpen={isStoryPublishModalOpen}
          onClose={() => setIsStoryPublishModalOpen(false)}
          onConfirm={handleStoryPublishConfirm}
          storyData={pendingStoryData}
          articleCount={selectedStoryArticleIds.length}
        />
      )}

      {/* Story Archive Modal */}
      {pendingStoryData && (
        <StoryArchiveModal
          isOpen={isStoryArchiveModalOpen}
          onClose={() => setIsStoryArchiveModalOpen(false)}
          onConfirm={handleStoryArchiveConfirm}
          storyData={pendingStoryData}
          articleCount={selectedStoryArticleIds.length}
        />
      )}
      
      {/* Toast Provider */}
      <Toaster 
        position="top-right"
        closeButton={true}
        richColors={true}
      />
    </div>
  );
}