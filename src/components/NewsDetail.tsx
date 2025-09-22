import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { SafetyScoreDropdown } from "./SafetyScoreDropdown";
import { SafetyScoreConfirmModal } from "./SafetyScoreConfirmModal";
import { TagsInput } from "./TagsInput";
import { Edit, ExternalLink, RotateCcw, Undo, X, ChevronDown, Pause, Square, Send, Archive } from "lucide-react";
import { PublishModal } from './PublishModal';
import { RejectConfirmModal } from './RejectConfirmModal';
import { AddToReviewConfirmModal } from './AddToReviewConfirmModal';
import { PausePublishingConfirmModal } from './PausePublishingConfirmModal';
import { EndPublishingConfirmModal } from './EndPublishingConfirmModal';
import { toast } from "sonner@2.0.3";
import { ImageCropSection } from './ImageCropSection';

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

interface NewsDetailProps {
  article: NewsArticle | null;
  onArticleUpdate: (articleId: string, updates: Partial<NewsArticle>) => void;
  onStatusChange: (articleId: string, status: NewsArticle['status']) => void;
  selectedArticleIds: string[];
  isBulkMode: boolean;
  onBulkStatusChange: (articleIds: string[], status: NewsArticle['status']) => void;
  onCancelSelection: () => void;
  activeSubTab: string;
  isRoundupDetail?: boolean;
  roundupStatus?: 'live' | 'paused' | 'expired' | 'archived';
  isReadOnly?: boolean;
  onRoundupActionClick?: (action: 'pause' | 'end' | 'resume' | 'archive' | 'extend' | 'restore' | 'publish') => void;
}

// Available categories and subcategories
const categories = [
  { value: 'sports', label: 'Sports', subcategories: ['Cricket', 'Football', 'Basketball', 'Tennis'] },
  { value: 'health', label: 'Health', subcategories: ['Medical', 'Wellness', 'Mental Health', 'Nutrition'] },
  { value: 'entertainment', label: 'Entertainment', subcategories: ['Movies', 'Music', 'TV Shows', 'Celebrity'] },
  { value: 'business', label: 'Business', subcategories: ['Finance', 'Technology', 'Markets', 'Startups'] },
  { value: 'world', label: 'World', subcategories: ['Politics', 'International', 'Conflict', 'Diplomacy'] },
  { value: 'national', label: 'National', subcategories: ['Politics', 'Economy', 'Society', 'Government'] }
];

// Available tags
const availableTags = [
  'india', 'cricket', 'virat', 'rohit', 'sports', 'match', 'team', 'player',
  'health', 'medical', 'wellness', 'fitness', 'nutrition', 'mental',
  'entertainment', 'movie', 'music', 'celebrity', 'bollywood', 'hollywood',
  'business', 'finance', 'market', 'economy', 'startup', 'technology',
  'world', 'international', 'politics', 'global', 'news', 'breaking'
];

export function NewsDetail({ 
  article, 
  onArticleUpdate, 
  onStatusChange,
  selectedArticleIds,
  isBulkMode,
  onBulkStatusChange,
  onCancelSelection,
  activeSubTab,
  isRoundupDetail = false,
  roundupStatus,
  isReadOnly = false,
  onRoundupActionClick
}: NewsDetailProps) {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedSubCategory, setEditedSubCategory] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [editedCtaText, setEditedCtaText] = useState('');
  const [editedCtaUrl, setEditedCtaUrl] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [previousSummary, setPreviousSummary] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [pendingSafetyScore, setPendingSafetyScore] = useState<number | null>(null);
  const [isScoreConfirmModalOpen, setIsScoreConfirmModalOpen] = useState(false);
  
  // Individual action confirmation modals
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isAddToReviewModalOpen, setIsAddToReviewModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isEndPublishingModalOpen, setIsEndPublishingModalOpen] = useState(false);

  // Update local state when article changes
  useEffect(() => {
    if (article) {
      setEditedTitle(article.title || '');
      setEditedCategory(article.newsType?.toLowerCase() || '');
      setEditedSubCategory(article.subType?.[0] || '');
      setEditedTags(Array.isArray(article.tags) ? article.tags.map(tag => tag.toLowerCase()) : []);
      setEditedCtaText('View more');
      setEditedCtaUrl('https://timesofindia.indiatimes.com/sports/cricket/bangladesh-tour-of-india');
      setEditedSummary(article.excerpt || '');
      setPreviousSummary(article.excerpt || '');
      setIsBreaking(article.isBreaking || false);
    }
  }, [article]);

  if (!article) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: '#F4F6F7' }}>
        <div className="text-center">
          <div className="text-muted-foreground mb-2">No article selected</div>
          <p className="text-sm text-muted-foreground">
            Select an article from the list to view details
          </p>
        </div>
      </div>
    );
  }

  // Check if editing should be restricted (round-up articles)
  const isEditingRestricted = isRoundupDetail || roundupStatus;

  const showEditingRestrictedToast = (fieldName: string) => {
    if (isEditingRestricted) {
      let message = `${fieldName} cannot be modified for articles in round-ups.`;
      let description = "Round-up articles have locked metadata to maintain consistency.";
      
      if (roundupStatus) {
        switch (roundupStatus) {
          case 'live':
            description = "Live round-up articles cannot be edited to maintain active content integrity.";
            break;
          case 'paused':
            description = "Paused round-up articles cannot be edited while in this state.";
            break;
          case 'expired':
            description = "Expired round-up articles are archived and cannot be modified.";
            break;
          case 'archived':
            description = "Archived round-up articles cannot be edited.";
            break;
        }
      }
      
      toast.warning(message, {
        description: description,
        duration: 4000,
      });
    }
  };

  const handleSave = () => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("Article title");
      return;
    }
    
    onArticleUpdate(article.id, {
      title: editedTitle,
      newsType: editedCategory.charAt(0).toUpperCase() + editedCategory.slice(1),
      subType: editedSubCategory ? [editedSubCategory] : [],
      tags: editedTags,
      excerpt: editedSummary,
      isBreaking: isBreaking,
    });
    setIsEditingTitle(false);
  };

  const handleAddTag = (tag: string) => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("Tags");
      return;
    }
    
    if (!editedTags.includes(tag.toLowerCase()) && editedTags.length < 10) {
      setEditedTags([...editedTags, tag.toLowerCase()]);
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("Tags");
      return;
    }
    setEditedTags(newTags);
  };

  const handleSafetyScoreChange = (newScore: number) => {
    if (isEditingRestricted) {
      return;
    }
    
    if (newScore !== article.safetyScore) {
      setPendingSafetyScore(newScore);
      setIsScoreConfirmModalOpen(true);
    }
  };

  const handleScoreConfirm = () => {
    if (pendingSafetyScore !== null) {
      const originalScore = article.originalSafetyScore || article.safetyScore;
      
      onArticleUpdate(article.id, { 
        safetyScore: pendingSafetyScore,
        originalSafetyScore: originalScore
      });
      
      toast.success("Safety score updated successfully!", {
        description: `Content safety score changed to ${pendingSafetyScore}`,
        duration: 3000,
      });
    }
    
    setIsScoreConfirmModalOpen(false);
    setPendingSafetyScore(null);
  };

  const handleScoreCancel = () => {
    setIsScoreConfirmModalOpen(false);
    setPendingSafetyScore(null);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("Tags");
      return;
    }
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  const handleRegenerateSummary = () => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("Summary");
      return;
    }
    
    // Store current summary as previous before regenerating
    setPreviousSummary(editedSummary);
    
    const summaries = [
      "Former Bangladesh captain Tamim Iqbal, who was on commentary duty, said that the dismissal made the analyst look like magician. Virat's coming back to Test cricket after a while, so he wants to build back by feeling the ball. It happens to everyone. We have all played the game.",
      "The cricket analyst's prediction came true in a spectacular fashion when Virat Kohli was dismissed exactly as forecasted. This moment highlighted the precision of modern cricket analysis and the predictable patterns in batting techniques.",
      "Commentary experts noted that Kohli's dismissal was a textbook example of how detailed analysis can predict player behavior. The incident showcased the evolving role of data analytics in modern cricket."
    ];
    const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
    setEditedSummary(randomSummary);
    
    toast.success("Summary regenerated!", {
      description: "Summary has been updated with new content.",
      duration: 2000,
    });
  };

  const handleUndoSummary = () => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("Summary");
      return;
    }
    
    if (previousSummary && previousSummary !== editedSummary) {
      const currentSummary = editedSummary;
      setEditedSummary(previousSummary);
      setPreviousSummary(currentSummary);
      
      toast.success("Summary restored!", {
        description: "Previous summary has been restored.",
        duration: 2000,
      });
    } else {
      toast.info("No previous version available", {
        description: "There is no previous summary to restore.",
        duration: 2000,
      });
    }
  };

  const getCurrentSubcategories = () => {
    const category = categories.find(cat => cat.value === editedCategory);
    return category ? category.subcategories : [];
  };

  const formatTime = (timeString: string) => {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    }) + ' IST';
  };

  const handlePublishClick = () => {
    setIsPublishModalOpen(true);
  };

  const handleBulkPublishClick = () => {
    setIsPublishModalOpen(true);
  };

  const handlePublishConfirm = (settings: any) => {
    if (isBulkMode && selectedArticleIds.length > 0) {
      onBulkStatusChange(selectedArticleIds, 'published');
      toast.success(`Successfully published ${selectedArticleIds.length} article${selectedArticleIds.length > 1 ? 's' : ''}!`, {
        description: "Your articles are now live and visible to users.",
        duration: 4000,
      });
    } else {
      onStatusChange(article.id, 'published');
      toast.success("Article published successfully!", {
        description: "Your article is now live and visible to users.",
        duration: 4000,
      });
    }
    setIsPublishModalOpen(false);
  };

  const handleCategoryChange = (value: string) => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("Category");
      return;
    }
    setEditedCategory(value);
  };

  const handleSubCategoryChange = (value: string) => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("Sub-category");
      return;
    }
    setEditedSubCategory(value);
  };

  const handleBreakingNewsChange = (checked: boolean) => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("Breaking news status");
      return;
    }
    setIsBreaking(checked);
    onArticleUpdate(article.id, { isBreaking: checked });
  };

  // Individual action handlers
  const handleRejectClick = () => {
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = (reason?: string) => {
    onStatusChange(article.id, 'rejected');
    toast.success("Article rejected successfully!", {
      description: reason ? `Reason: ${reason}` : "Article has been moved to rejected status.",
      duration: 3000,
    });
  };

  const handleAddToReviewClick = () => {
    setIsAddToReviewModalOpen(true);
  };

  const handleAddToReviewConfirm = (notes?: string) => {
    onStatusChange(article.id, 'review');
    toast.success("Article moved to review!", {
      description: notes ? `Notes: ${notes}` : "Article has been added to review queue.",
      duration: 3000,
    });
  };

  const handlePausePublishingClick = () => {
    setIsPauseModalOpen(true);
  };

  const handlePausePublishingConfirm = () => {
    toast.success("Article paused successfully!", {
      description: "The article is no longer visible to users.",
      duration: 3000,
    });
  };

  const handleEndPublishingClick = () => {
    setIsEndPublishingModalOpen(true);
  };

  const handleEndPublishingConfirm = () => {
    toast.success("Publishing ended successfully!", {
      description: "The article has been removed from publication.",
      duration: 3000,
    });
  };

  const handleCtaTextChange = (value: string) => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("CTA text");
      return;
    }
    setEditedCtaText(value);
  };

  const handleCtaUrlChange = (value: string) => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("CTA URL");
      return;
    }
    setEditedCtaUrl(value);
  };

  const handleSummaryChange = (value: string) => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("Summary");
      return;
    }
    setEditedSummary(value);
  };

  const handleTitleEditClick = () => {
    if (isEditingRestricted) {
      showEditingRestrictedToast("Article title");
      return;
    }
    setIsEditingTitle(!isEditingTitle);
  };

  // Function to render conditional action buttons based on activeSubTab
  const renderActionButtons = () => {
    // Round-up detail view - different actions based on round-up status
    if (isRoundupDetail && roundupStatus) {
      switch (roundupStatus) {
        case 'live':
          return (
            <>
              <div className="flex">
                <Button 
                  onClick={() => onRoundupActionClick?.('pause')}
                  className="flex items-center gap-2 bg-gray-100 text-black border border-gray-300 hover:bg-gray-200"
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => onRoundupActionClick?.('end')}
                  className="flex items-center gap-2 bg-red-500 text-white border border-red-600 hover:bg-red-600"
                >
                  <Square className="h-4 w-4" />
                  Stop Publish
                </Button>
              </div>
            </>
          );
        case 'paused':
          return (
            <>
              <div></div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => onRoundupActionClick?.('resume')}
                  style={{
                    backgroundColor: '#5767F2',
                    borderColor: '#2533B0',
                    color: 'white'
                  }}
                  className="border hover:opacity-90"
                >
                  Resume Round-up
                </Button>
                <Button 
                  onClick={() => onRoundupActionClick?.('end')}
                  className="flex items-center gap-2 bg-red-500 text-white border border-red-600 hover:bg-red-600"
                >
                  <Square className="h-4 w-4" />
                  End Round-up
                </Button>
              </div>
            </>
          );
        case 'expired':
          return (
            <>
              <div></div>
              <div className="flex gap-3">
                {/* No actions available for expired round-ups */}
              </div>
            </>
          );
        case 'archived':
          return (
            <>
              <div></div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => onRoundupActionClick?.('restore')}
                  className="bg-gray-100 text-black border border-gray-300 hover:bg-gray-200"
                >
                  Restore Round-up
                </Button>
              </div>
            </>
          );
        default:
          return (
            <>
              <div></div>
              <div></div>
            </>
          );
      }
    }

    if (isBulkMode) {
      // Bulk mode actions
      if (activeSubTab === 'pending') {
        return (
          <>
            <div className="flex">
              <Button 
                onClick={() => onBulkStatusChange(selectedArticleIds, 'rejected')}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                disabled={selectedArticleIds.length === 0}
              >
                Reject
              </Button>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => onBulkStatusChange(selectedArticleIds, 'review')}
                className="bg-gray-100 text-black border border-gray-300 hover:bg-gray-200"
                disabled={selectedArticleIds.length === 0}
              >
                Add to Review
              </Button>
              <Button 
                onClick={handleBulkPublishClick}
                style={{
                  backgroundColor: '#5767F2',
                  borderColor: '#2533B0',
                  color: 'white'
                }}
                className="border hover:opacity-90"
                disabled={selectedArticleIds.length === 0}
              >
                Publish {selectedArticleIds.length} Article{selectedArticleIds.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </>
        );
      } else if (activeSubTab === 'review') {
        return (
          <>
            <div className="flex">
              <Button 
                onClick={handleRejectClick}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                disabled={selectedArticleIds.length === 0}
              >
                Reject
              </Button>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleBulkPublishClick}
                style={{
                  backgroundColor: '#5767F2',
                  borderColor: '#2533B0',
                  color: 'white'
                }}
                className="border hover:opacity-90"
                disabled={selectedArticleIds.length === 0}
              >
                Publish {selectedArticleIds.length} Article{selectedArticleIds.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </>
        );
      } else if (activeSubTab === 'rejected') {
        return (
          <>
            <div></div>
            <div className="flex gap-3">
              <Button 
                onClick={() => onBulkStatusChange(selectedArticleIds, 'review')}
                className="bg-gray-100 text-black border border-gray-300 hover:bg-gray-200"
                disabled={selectedArticleIds.length === 0}
              >
                Add to Review
              </Button>
            </div>
          </>
        );
      }
    }

    // Single article actions based on sub-tab
    switch (activeSubTab) {
      case 'pending':
        return (
          <>
            <div className="flex">
              <Button 
                onClick={handleRejectClick}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Reject
              </Button>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleAddToReviewClick}
                className="bg-gray-100 text-black border border-gray-300 hover:bg-gray-200"
              >
                Add to Review
              </Button>
              <Button 
                onClick={handlePublishClick}
                style={{
                  backgroundColor: '#5767F2',
                  borderColor: '#2533B0',
                  color: 'white'
                }}
                className="border hover:opacity-90"
              >
                Publish
              </Button>
            </div>
          </>
        );
        
      case 'review':
        return (
          <>
            <div className="flex">
              <Button 
                onClick={handleRejectClick}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Reject
              </Button>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handlePublishClick}
                style={{
                  backgroundColor: '#5767F2',
                  borderColor: '#2533B0',
                  color: 'white'
                }}
                className="border hover:opacity-90"
              >
                Publish
              </Button>
            </div>
          </>
        );
        
      case 'rejected':
        return (
          <>
            <div></div>
            <div className="flex gap-3">
              <Button 
                onClick={handleAddToReviewClick}
                className="bg-gray-100 text-black border border-gray-300 hover:bg-gray-200"
              >
                Add to Review
              </Button>
            </div>
          </>
        );
        
      case 'published':
        return (
          <>
            <div></div>
            <div className="flex gap-3">
              <Button 
                onClick={handlePausePublishingClick}
                className="flex items-center gap-2 bg-gray-100 text-black border border-gray-300 hover:bg-gray-200"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
              <Button 
                onClick={handleEndPublishingClick}
                className="flex items-center gap-2 bg-red-500 text-white border border-red-600 hover:bg-red-600"
              >
                <Square className="h-4 w-4" />
                End Publishing
              </Button>
            </div>
          </>
        );
        
      default:
        return (
          <>
            <div></div>
            <div></div>
          </>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              {/* Title with Edit - Dynamic background based on breaking news toggle */}
              <div 
                className="p-4 rounded-2xl" 
                style={{
                  height: '96px',
                  backgroundColor: isBreaking ? '#F4F5FC' : '#F4F5FC',
                  border: isBreaking ? '1px solid #873DFF' : 'none',
                  background: isBreaking 
                    ? 'linear-gradient(90deg, rgba(135, 61, 255, 0.10) 0%, rgba(255, 24, 24, 0.10) 100%), #F4F5FC'
                    : '#F4F5FC'
                }}
              >
                <div className="flex items-start justify-between gap-4 h-full">
                  <div className="flex-1 flex items-start">
                    {isEditingTitle && !isEditingRestricted ? (
                      <div className="space-y-2 w-full">
                        <Input
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="text-xl p-0 border-none shadow-none focus-visible:ring-1"
                          placeholder="Article title..."
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSave}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingTitle(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <h1 className="text-xl leading-tight pr-4">{editedTitle}</h1>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground p-2"
                    onClick={handleTitleEditClick}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Safety Score, Breaking News Toggle and Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Content Safety Score with Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Content safety score:</span>
                    <SafetyScoreDropdown 
                      score={article.safetyScore} 
                      originalScore={article.originalSafetyScore || article.safetyScore}
                      size="md" 
                      variant="details"
                      onScoreChange={handleSafetyScoreChange}
                      isReadOnly={isEditingRestricted}
                      roundupStatus={roundupStatus}
                    />
                  </div>

                  {/* Breaking News Toggle - Hidden in round-up detail */}
                  {!isRoundupDetail && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-muted-foreground">Breaking News:</label>
                      <Switch
                        checked={isBreaking}
                        onCheckedChange={handleBreakingNewsChange}
                        disabled={isEditingRestricted}
                      />
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatTime(article.ingestionTime)}
                </div>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="grid grid-cols-3 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  <span className="text-red-500">*</span> Category
                </label>
                <Select 
                  value={editedCategory} 
                  onValueChange={handleCategoryChange}
                  disabled={isEditingRestricted}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub-category */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  <span className="text-red-500">*</span> Sub-category
                </label>
                <Select 
                  value={editedSubCategory} 
                  onValueChange={handleSubCategoryChange}
                  disabled={isEditingRestricted}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sub-category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentSubcategories().map(subCategory => (
                      <SelectItem key={subCategory} value={subCategory}>
                        {subCategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Empty space to maintain grid */}
              <div></div>
            </div>

            {/* Tags Section */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Tags</label>
              <TagsInput
                tags={editedTags}
                onTagsChange={handleTagsChange}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                availableTags={availableTags}
                disabled={isEditingRestricted}
              />
            </div>

            {/* Image Section */}
            {/* CTA text */}


            {/* CTA URL */}


            {/* Summary */}


            {/* Image - moved to bottom */}
            {/* Call-to-action */}
            <div className="space-y-4">
              <label className="text-sm text-muted-foreground">Call-to-action</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">CTA Text</label>
                  <Input 
                    value={editedCtaText}
                    onChange={(e) => handleCtaTextChange(e.target.value)}
                    placeholder="Enter CTA text..."
                    disabled={isEditingRestricted}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">CTA URL</label>
                  <div className="flex gap-2">
                    <Input 
                      value={editedCtaUrl}
                      onChange={(e) => handleCtaUrlChange(e.target.value)}
                      placeholder="https://..."
                      disabled={isEditingRestricted}
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled={isEditingRestricted}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Summary</label>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleUndoSummary}
                    disabled={isEditingRestricted}
                    className="p-2"
                  >
                    <Undo className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleRegenerateSummary}
                    className="text-xs"
                    disabled={isEditingRestricted}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Regenerate
                  </Button>
                </div>
              </div>
              <Textarea
                value={editedSummary}
                onChange={(e) => handleSummaryChange(e.target.value)}
                className="min-h-[120px] resize-none"
                placeholder="Article summary..."
                disabled={isEditingRestricted}
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm text-muted-foreground">Image</label>
              {/* Image Section */}
              <ImageCropSection 
                imageUrl={article.imageUrl} 
                onImageUpdate={(imageUrl) => onArticleUpdate(article.id, { imageUrl })}
                disabled={isEditingRestricted}
              />
            </div>

            {/* CTA Section */}


            {/* Summary Section */}

          </div>
        </ScrollArea>
      </div>
      
      {/* Action Bar */}
      <div 
        className="flex-shrink-0 border-t px-6 py-4 bg-white"
        style={{ height: '78px' }}
      >
        <div className="flex justify-between items-center h-full">
          {renderActionButtons()}
        </div>
      </div>

      {/* Publish Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handlePublishConfirm}
        articleCount={isBulkMode && selectedArticleIds.length > 0 ? selectedArticleIds.length : 1}
        articleTitle={isBulkMode && selectedArticleIds.length > 1 ? '' : article.title}
        isBulkMode={isBulkMode && selectedArticleIds.length > 0}
      />

      {/* Safety Score Confirmation Modal */}
      <SafetyScoreConfirmModal
        isOpen={isScoreConfirmModalOpen}
        onClose={handleScoreCancel}
        onConfirm={handleScoreConfirm}
        pendingScore={pendingSafetyScore}
        currentScore={article.safetyScore}
        originalScore={article.originalSafetyScore}
      />

      {/* Individual Action Confirmation Modals */}
      <RejectConfirmModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        articleTitle={article.title}
      />

      <AddToReviewConfirmModal
        isOpen={isAddToReviewModalOpen}
        onClose={() => setIsAddToReviewModalOpen(false)}
        onConfirm={handleAddToReviewConfirm}
        articleTitle={article.title}
      />

      <PausePublishingConfirmModal
        isOpen={isPauseModalOpen}
        onClose={() => setIsPauseModalOpen(false)}
        onConfirm={handlePausePublishingConfirm}
        articleTitle={article.title}
      />

      <EndPublishingConfirmModal
        isOpen={isEndPublishingModalOpen}
        onClose={() => setIsEndPublishingModalOpen(false)}
        onConfirm={handleEndPublishingConfirm}
        articleTitle={article.title}
      />
    </div>
  );
}