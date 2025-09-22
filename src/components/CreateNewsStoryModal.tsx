import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TagsInput } from "./TagsInput";
import { toast } from "sonner@2.0.3";

export interface NewsStory {
  headline: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
}

interface CreateNewsStoryModalProps {
  open: boolean;
  loading?: boolean;
  initialValues?: Partial<NewsStory>;
  categories?: Record<string, string[]>;
  onCancel: () => void;
  onSubmit: (values: NewsStory) => Promise<void> | void;
}

const DEFAULT_CATEGORIES: Record<string, string[]> = {
  "World Politics": ["US Presidential election", "Europe", "Middle East", "Asia-Pacific"],
  "Business": ["Markets", "Startups", "Earnings", "Technology"],
  "Technology": ["AI", "Cybersecurity", "Consumer Tech", "Software"],
  "Sports": ["Cricket", "Football", "Tennis", "Olympics"],
  "Health": ["Medical Research", "Public Health", "Healthcare Policy", "Mental Health"],
  "Environment": ["Climate Change", "Conservation", "Renewable Energy", "Sustainability"]
};

const availableTags = [
  'breaking', 'trending', 'developing', 'investigation', 'analysis', 'politics', 'business', 
  'technology', 'sports', 'health', 'environment', 'science', 'education', 'culture',
  'international', 'national', 'regional', 'local', 'economy', 'finance'
];

export default function CreateNewsStoryModal({
  open,
  loading = false,
  initialValues,
  categories = DEFAULT_CATEGORIES,
  onCancel,
  onSubmit
}: CreateNewsStoryModalProps) {
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const headlineCharLimit = 100;
  const descriptionCharLimit = 400;

  // Reset form when modal opens/closes or initialValues change
  useEffect(() => {
    if (open) {
      setHeadline(initialValues?.headline || '');
      setDescription(initialValues?.description || '');
      setCategory(initialValues?.category || '');
      setSubcategory(initialValues?.subcategory || '');
      setTags(initialValues?.tags || []);
    }
  }, [open, initialValues]);

  // Clear subcategory when category changes
  useEffect(() => {
    if (category) {
      setSubcategory('');
    }
  }, [category]);

  const handleProceed = async () => {
    if (!headline.trim()) {
      toast.error("Please enter a headline");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!subcategory) {
      toast.error("Please select a sub-category");
      return;
    }

    const storyData: NewsStory = {
      headline: headline.trim(),
      description: description.trim(),
      category,
      subcategory,
      tags: tags.map(tag => tag.toLowerCase().replace(/^#/, '')).filter((tag, index, arr) => arr.indexOf(tag) === index)
    };

    try {
      await onSubmit(storyData);
      // Reset form after successful submission
      handleClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleClose = () => {
    setHeadline('');
    setDescription('');
    setCategory('');
    setSubcategory('');
    setTags([]);
    onCancel();
  };

  const subcategoryOptions = category ? categories[category] || [] : [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New News Story</DialogTitle>
          <DialogDescription>
            Set up your news story with basic information to start tracking events.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Headline */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              <span className="text-red-500">*</span> Headline
            </label>
            <Input
              value={headline}
              onChange={(e) => {
                if (e.target.value.length <= headlineCharLimit) {
                  setHeadline(e.target.value);
                }
              }}
              placeholder="Enter story headline..."
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>This headline will be visible to end users</span>
              <span className={headline.length > headlineCharLimit * 0.9 ? 'text-orange-600' : ''}>
                {headline.length}/{headlineCharLimit}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              <span className="text-red-500">*</span> Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= descriptionCharLimit) {
                  setDescription(e.target.value);
                }
              }}
              placeholder="Describe what this story will cover..."
              className="w-full min-h-[80px] resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Brief description of the story content</span>
              <span className={description.length > descriptionCharLimit * 0.9 ? 'text-orange-600' : ''}>
                {description.length}/{descriptionCharLimit}
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              <span className="text-red-500">*</span> Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(categories).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">
              Choose the main category for this news story
            </div>
          </div>

          {/* Sub-category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              <span className="text-red-500">*</span> Sub-category
            </label>
            <Select 
              value={subcategory} 
              onValueChange={setSubcategory}
              disabled={!category}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sub-category" />
              </SelectTrigger>
              <SelectContent>
                {subcategoryOptions.map((subcat) => (
                  <SelectItem key={subcat} value={subcat}>
                    {subcat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">
              Choose a specific sub-category within the selected category
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <TagsInput
              value={tags}
              onChange={setTags}
              availableTags={availableTags}
              placeholder="Add relevant tags..."
              maxTags={8}
            />
            <div className="text-xs text-muted-foreground">
              Add tags to help categorize and discover your story
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleProceed}
            disabled={loading}
            style={{
              backgroundColor: '#5767F2',
              borderColor: '#2533B0',
              color: 'white'
            }}
            className="border hover:opacity-90"
          >
            {loading ? "Creating..." : "Proceed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}