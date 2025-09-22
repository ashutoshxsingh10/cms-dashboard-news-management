import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TagsInput } from "./TagsInput";
import { toast } from "sonner@2.0.3";

interface CreateRoundupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (roundupData: {
    name: string;
    description: string;
    type: string;
    tags: string[];
  }) => void;
}

const roundupTypes = [
  { value: 'breaking', label: 'Breaking News' },
  { value: 'trending', label: 'Trending Stories' },
  { value: 'daily', label: 'Daily Digest' },
  { value: 'weekly', label: 'Weekly Review' },
  { value: 'regional', label: 'Regional Update' }
];

const availableTags = [
  'breaking', 'trending', 'daily', 'weekly', 'regional', 'sports', 'health', 
  'entertainment', 'business', 'world', 'national', 'politics', 'technology',
  'climate', 'economy', 'culture', 'science', 'education', 'healthcare'
];

export function CreateRoundupModal({ isOpen, onClose, onProceed }: CreateRoundupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const nameCharLimit = 100;
  const descriptionCharLimit = 300;

  const handleProceed = () => {
    if (!name.trim()) {
      toast.error("Please enter a roundup name");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (!type) {
      toast.error("Please select a roundup type");
      return;
    }

    onProceed({
      name: name.trim(),
      description: description.trim(),
      type,
      tags
    });

    // Reset form
    setName('');
    setDescription('');
    setType('');
    setTags([]);
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setType('');
    setTags([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Roundup</DialogTitle>
          <DialogDescription>
            Set up your news roundup with basic information and proceed to select articles.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Roundup Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              <span className="text-red-500">*</span> Roundup Name
            </label>
            <Input
              value={name}
              onChange={(e) => {
                if (e.target.value.length <= nameCharLimit) {
                  setName(e.target.value);
                }
              }}
              placeholder="Enter roundup name..."
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Name for your news roundup</span>
              <span className={name.length > nameCharLimit * 0.9 ? 'text-orange-600' : ''}>
                {name.length}/{nameCharLimit}
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
              placeholder="Describe what this roundup covers..."
              className="w-full min-h-[80px] resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Brief description of the roundup content</span>
              <span className={description.length > descriptionCharLimit * 0.9 ? 'text-orange-600' : ''}>
                {description.length}/{descriptionCharLimit}
              </span>
            </div>
          </div>

          {/* Roundup Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              <span className="text-red-500">*</span> Roundup Type
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select roundup type" />
              </SelectTrigger>
              <SelectContent>
                {roundupTypes.map((roundupType) => (
                  <SelectItem key={roundupType.value} value={roundupType.value}>
                    {roundupType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">
              Choose the category that best describes this roundup
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
              Add tags to help categorize and discover your roundup
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleProceed}
            style={{
              backgroundColor: '#5767F2',
              borderColor: '#2533B0',
              color: 'white'
            }}
            className="border hover:opacity-90"
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}