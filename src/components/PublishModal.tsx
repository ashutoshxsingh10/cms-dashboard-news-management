import { useState, useEffect } from 'react';
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

interface PublishSettings {
  isBreakingNews: boolean;
  startTimeMode: 'now' | 'custom';
  customDate?: Date;
  customTime?: string;
  durationType: 'days' | 'hours';
  durationValue: number;
  userExpiryType: 'days' | 'hours';
  userExpiryValue: number;
  experiments: string[];
  oems: string[];
  segments: string[];
  regions: string[];
}

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (settings: PublishSettings) => void;
  isBulkPublish?: boolean;
  articleCount?: number;
}

// Options data
const experimentsOptions = [
  'A/B Testing Framework',
  'Content Personalization',
  'Push Notification Timing',
  'User Engagement Metrics',
  'Content Recommendation Engine',
  'Social Media Integration',
  'Reading Time Optimization',
  'Mobile UI/UX Testing',
  'Advertisement Placement',
  'User Retention Analysis',
  'Performance Metrics',
  'Accessibility Features'
];

const oemsOptions = ['Samsung', 'Xiaomi', 'Oppo', 'Vivo'];
const segmentsOptions = ['Premium', 'Mid Range', 'Budget'];
const regionsOptions = ['North India', 'South India', 'West India', 'East India'];

export function PublishModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isBulkPublish = false, 
  articleCount = 1 
}: PublishModalProps) {
  const [settings, setSettings] = useState<PublishSettings>({
    isBreakingNews: false,
    startTimeMode: 'now',
    customTime: '12:00',
    durationType: 'days',
    durationValue: 1,
    userExpiryType: 'days',
    userExpiryValue: 1,
    experiments: [],
    oems: [],
    segments: [],
    regions: []
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

    if (settings.experiments.length === 0) {
      newErrors.experiments = 'Select at least one experiment';
    }

    if (settings.oems.length === 0) {
      newErrors.oems = 'Select at least one OEM';
    }

    if (settings.segments.length === 0) {
      newErrors.segments = 'Select at least one segment';
    }

    if (settings.regions.length === 0) {
      newErrors.regions = 'Select at least one region';
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

  const updateSetting = (key: keyof PublishSettings, value: any) => {
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
        {/* Header - No duplicate close button */}
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-lg font-medium">Publish Settings</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Configure publishing options for your {isBulkPublish && articleCount > 1 ? `${articleCount} articles` : 'article'}.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 pb-4 space-y-4">
          {/* Breaking News Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Mark as Breaking News*</Label>
                <p className="text-xs text-muted-foreground">
                  *Breaking news will stay for 12 hours or until new breaking news
                </p>
              </div>
              <Switch
                checked={settings.isBreakingNews}
                onCheckedChange={(checked) => updateSetting('isBreakingNews', checked)}
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

          {/* Experiments Dropdown (>5 options) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Experiments:</Label>
            <Select 
              value={settings.experiments.join(',')} 
              onValueChange={(value) => updateSetting('experiments', value ? [value] : [])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select experiments" />
              </SelectTrigger>
              <SelectContent>
                {experimentsOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.experiments && <p className="text-xs text-red-500">{errors.experiments}</p>}
          </div>

          <Separator />

          {/* OEMs (≤5 options - tag group) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">OEMs:</Label>
            <TagMultiSelect
              options={oemsOptions}
              selected={settings.oems}
              onChange={(selected) => updateSetting('oems', selected)}
              error={errors.oems}
            />
          </div>

          <Separator />

          {/* Segments (≤5 options - tag group) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Segments:</Label>
            <TagMultiSelect
              options={segmentsOptions}
              selected={settings.segments}
              onChange={(selected) => updateSetting('segments', selected)}
              error={errors.segments}
            />
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
            Publish {isBulkPublish && articleCount > 1 ? `${articleCount} Articles` : 'Article'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PublishModal;