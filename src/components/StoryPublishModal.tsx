import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface StoryPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (settings: StoryPublishSettings) => void;
  storyData: {
    headline: string;
    description: string;
    category: string;
    subcategory: string;
    tags: string[];
  };
  articleCount: number;
}

export interface StoryPublishSettings {
  isFeaturedStory: boolean;
  startTimeMode: 'now' | 'custom';
  customDate?: Date;
  customTime?: string;
  durationType: 'days' | 'hours';
  durationValue: number;
  userExpiryType: 'days' | 'hours';
  userExpiryValue: number;
  contentTypes: string[];
  regions: string[];
  audiences: string[];
  platforms: string[];
}

//Options data for stories
const contentTypesOptions = [
  'Breaking News Updates',
  'Developing Story Coverage', 
  'Analysis & Commentary',
  'Event Timeline',
  'Live Updates',
  'Investigation Reports',
  'Crisis Coverage',
  'Emergency Alerts',
  'Public Interest',
  'Community Impact',
  'Social Issues',
  'Policy Changes'
];

const regionsOptions = ['North India', 'South India', 'West India', 'East India', 'National', 'International'];
const audiencesOptions = ['General Public', 'Subscribers', 'Premium Members', 'Enterprise Users'];
const platformsOptions = ['Mobile App', 'Web Platform', 'Email Newsletter', 'Social Media'];

export function StoryPublishModal({
  isOpen,
  onClose,
  onConfirm,
  storyData,
  articleCount
}: StoryPublishModalProps) {
  const [settings, setSettings] = useState<StoryPublishSettings>({
    isFeaturedStory: false,
    startTimeMode: 'now',
    customTime: '12:00',
    durationType: 'days',
    durationValue: 1,
    userExpiryType: 'days',
    userExpiryValue: 1,
    contentTypes: [],
    regions: [],
    audiences: [],
    platforms: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (settings.durationValue < 1) {
      newErrors.durationValue = 'Duration must be at least 1';
    }

    if (settings.userExpiryValue < 1) {
      newErrors.userExpiryValue = 'Expiry must be at least 1';
    }

    if (settings.contentTypes.length === 0) {
      newErrors.contentTypes = 'Select at least one content type';
    }

    if (settings.regions.length === 0) {
      newErrors.regions = 'Select at least one region';
    }

    if (settings.audiences.length === 0) {
      newErrors.audiences = 'Select at least one audience';
    }

    if (settings.platforms.length === 0) {
      newErrors.platforms = 'Select at least one platform';
    }

    if (settings.startTimeMode === 'custom') {
      if (!settings.customDate) {
        newErrors.customDate = 'Select a date';
      }
      if (!settings.customTime) {
        newErrors.customTime = 'Select a time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm(settings);
      onClose();
    }
  };

  const updateSetting = (key: keyof StoryPublishSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Clear error when user makes changes
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  // Tag-style multi-select component for ≤5 options
  const TagMultiSelect = ({ 
    options, 
    selected, 
    onChange, 
    error 
  }: { 
    options: string[]; 
    selected: string[]; 
    onChange: (selected: string[]) => void;
    error?: string;
  }) => {
    const handleToggle = (option: string) => {
      const newSelected = selected.includes(option)
        ? selected.filter(item => item !== option)
        : [...selected, option];
      onChange(newSelected);
    };

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {options.map(option => (
            <Badge
              key={option}
              variant={selected.includes(option) ? "default" : "outline"}
              className={`cursor-pointer transition-colors px-3 py-1.5 text-sm ${
                selected.includes(option) 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/80' 
                  : 'hover:bg-muted'
              }`}
              onClick={() => handleToggle(option)}
            >
              {option}
            </Badge>
          ))}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-lg font-medium">Publish Story Settings</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Configure publishing options for "{storyData.headline}" with {articleCount} articles.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 pb-4 space-y-4">
          {/* Featured Story Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Mark as Featured Story*</Label>
                <p className="text-xs text-muted-foreground">
                  *Featured stories appear prominently on the home page
                </p>
              </div>
              <Switch
                checked={settings.isFeaturedStory}
                onCheckedChange={(checked) => updateSetting('isFeaturedStory', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Start Time */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Start Time:</Label>
            <RadioGroup
              value={settings.startTimeMode}
              onValueChange={(value) => updateSetting('startTimeMode', value as 'now' | 'custom')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="now" className="border-2 border-gray-300" />
                <Label htmlFor="now" className="cursor-pointer">Now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" className="border-2 border-gray-300" />
                <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
              </div>
            </RadioGroup>
            
            {/* Custom Date and Time Pickers */}
            {settings.startTimeMode === 'custom' && (
              <div className="flex gap-2">
                {/* Date Picker */}
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {settings.customDate ? format(settings.customDate, "MMM dd") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={settings.customDate}
                        onSelect={(date) => updateSetting('customDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.customDate && <p className="text-xs text-red-500 mt-1">{errors.customDate}</p>}
                </div>

                {/* Time Picker */}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={settings.customTime}
                    onChange={(e) => updateSetting('customTime', e.target.value)}
                    className="w-24"
                  />
                </div>
                {errors.customTime && <p className="text-xs text-red-500 mt-1">{errors.customTime}</p>}
              </div>
            )}
          </div>

          <Separator />

          {/* Duration Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Duration Type:</Label>
            <RadioGroup
              value={settings.durationType}
              onValueChange={(value) => updateSetting('durationType', value as 'days' | 'hours')}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="days" id="days" className="border-2 border-gray-300" />
                <Label htmlFor="days" className="cursor-pointer">Days</Label>
                {settings.durationType === 'days' && (
                  <Input
                    type="number"
                    value={settings.durationValue}
                    onChange={(e) => updateSetting('durationValue', parseInt(e.target.value) || 0)}
                    className="w-20 ml-2"
                    placeholder="0"
                    min="1"
                  />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hours" id="hours" className="border-2 border-gray-300" />
                <Label htmlFor="hours" className="cursor-pointer">Hours</Label>
                {settings.durationType === 'hours' && (
                  <Input
                    type="number"
                    value={settings.durationValue}
                    onChange={(e) => updateSetting('durationValue', parseInt(e.target.value) || 0)}
                    className="w-20 ml-2"
                    placeholder="0"
                    min="1"
                  />
                )}
              </div>
            </RadioGroup>
            {errors.durationValue && <p className="text-xs text-red-500">{errors.durationValue}</p>}
          </div>

          <Separator />

          {/* User Level Expiry */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">User level expiry:</Label>
            <RadioGroup
              value={settings.userExpiryType}
              onValueChange={(value) => updateSetting('userExpiryType', value as 'days' | 'hours')}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="days" id="expiry-days" className="border-2 border-gray-300" />
                <Label htmlFor="expiry-days" className="cursor-pointer">Days</Label>
                {settings.userExpiryType === 'days' && (
                  <Input
                    type="number"
                    value={settings.userExpiryValue}
                    onChange={(e) => updateSetting('userExpiryValue', parseInt(e.target.value) || 0)}
                    className="w-20 ml-2"
                    placeholder="0"
                    min="1"
                  />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hours" id="expiry-hours" className="border-2 border-gray-300" />
                <Label htmlFor="expiry-hours" className="cursor-pointer">Hours</Label>
                {settings.userExpiryType === 'hours' && (
                  <Input
                    type="number"
                    value={settings.userExpiryValue}
                    onChange={(e) => updateSetting('userExpiryValue', parseInt(e.target.value) || 0)}
                    className="w-20 ml-2"
                    placeholder="0"
                    min="1"
                  />
                )}
              </div>
            </RadioGroup>
            {errors.userExpiryValue && <p className="text-xs text-red-500">{errors.userExpiryValue}</p>}
          </div>

          <Separator />

          {/* Content Types Dropdown (>5 options) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Content Types:</Label>
            <Select 
              value={settings.contentTypes.join(',')} 
              onValueChange={(value) => updateSetting('contentTypes', value ? [value] : [])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select content types" />
              </SelectTrigger>
              <SelectContent>
                {contentTypesOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.contentTypes && <p className="text-xs text-red-500">{errors.contentTypes}</p>}
          </div>

          <Separator />

          {/* Regions (≤5 options - tag group) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Regions:</Label>
            <TagMultiSelect
              options={regionsOptions}
              selected={settings.regions}
              onChange={(selected) => updateSetting('regions', selected)}
              error={errors.regions}
            />
          </div>

          <Separator />

          {/* Audiences (≤5 options - tag group) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Target Audiences:</Label>
            <TagMultiSelect
              options={audiencesOptions}
              selected={settings.audiences}
              onChange={(selected) => updateSetting('audiences', selected)}
              error={errors.audiences}
            />
          </div>

          <Separator />

          {/* Platforms (≤5 options - tag group) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Publishing Platforms:</Label>
            <TagMultiSelect
              options={platformsOptions}
              selected={settings.platforms}
              onChange={(selected) => updateSetting('platforms', selected)}
              error={errors.platforms}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between items-center p-6 border-t">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={Object.keys(errors).some(key => errors[key])}
            className="bg-[#5767F2] hover:bg-[#2533B0] text-white"
          >
            Publish Story
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}