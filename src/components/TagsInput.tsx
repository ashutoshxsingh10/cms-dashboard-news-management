import { useState, useRef, useEffect, useMemo } from 'react';
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { X, ChevronDown } from "lucide-react";

interface TagsInputProps {
  tags: string[];
  onTagsChange?: (tags: string[]) => void;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
  availableTags: string[];
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
}

export function TagsInput({ 
  tags = [],
  onTagsChange,
  onAddTag,
  onRemoveTag,
  availableTags = [],
  placeholder = "Add tags...", 
  maxTags = 10,
  disabled = false
}: TagsInputProps) {
  // Ensure tags is always an array and memoize it to prevent unnecessary re-renders
  const safeTags = useMemo(() => Array.isArray(tags) ? tags : [], [tags]);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize filtered tags to prevent unnecessary recalculations
  const filteredTags = useMemo(() => {
    if (!availableTags || !Array.isArray(availableTags)) return [];
    
    return availableTags.filter(tag => 
      !safeTags.includes(tag.toLowerCase()) && 
      tag.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, safeTags, availableTags]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue && !isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && inputValue === '' && safeTags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(safeTags[safeTags.length - 1]);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const addTag = (tagToAdd: string) => {
    if (!tagToAdd || disabled) return;
    
    // Normalize tag: remove leading "#" if present and convert to lowercase
    const normalizedTag = tagToAdd.startsWith('#') ? tagToAdd.slice(1) : tagToAdd;
    const lowercaseTag = normalizedTag.toLowerCase();
    
    if (!safeTags.includes(lowercaseTag) && safeTags.length < maxTags) {
      if (onAddTag) {
        onAddTag(lowercaseTag);
      } else if (onTagsChange) {
        onTagsChange([...safeTags, lowercaseTag]);
      }
    }
    
    setInputValue('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove: string) => {
    if (disabled) return;
    
    if (onRemoveTag) {
      onRemoveTag(tagToRemove);
    } else if (onTagsChange) {
      onTagsChange(safeTags.filter(tag => tag !== tagToRemove));
    }
  };

  const handleTagClick = (tag: string) => {
    addTag(tag);
  };

  const handleContainerClick = () => {
    if (disabled) return;
    inputRef.current?.focus();
    setIsDropdownOpen(true);
  };



  return (
    <div className="relative" ref={containerRef}>
      {/* Main input container */}
      <div 
        className={`min-h-[40px] w-full rounded-md px-3 py-2 flex flex-wrap gap-1 items-center ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'
        } bg-white border border-[#D9D9D9]`}
        onClick={handleContainerClick}
      >
        {/* Render selected tags */}
        {safeTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-gray-100 text-gray-700 px-2 py-0.5 text-xs flex items-center gap-1"
          >
            #{tag}
            {!disabled && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="ml-1 hover:text-red-500 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    removeTag(tag);
                  }
                }}
              >
                <X className="h-3 w-3" />
              </span>
            )}
          </Badge>
        ))}
        
        {/* Input field */}
        <div className="flex-1 min-w-[120px] flex items-center">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={disabled ? undefined : handleInputChange}
            onKeyDown={disabled ? undefined : handleInputKeyDown}
            onFocus={disabled ? undefined : () => setIsDropdownOpen(true)}
            placeholder={safeTags.length === 0 ? placeholder : ""}
            className="border-none shadow-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
          />
        </div>

        {/* Dropdown arrow */}
        <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
      </div>

      {/* Dropdown */}
      {isDropdownOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#D9D9D9] rounded-md shadow-md max-h-60 overflow-auto">
          {filteredTags.length > 0 ? (
            <>
              {filteredTags.slice(0, 10).map((tag) => (
                <div
                  key={tag}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleTagClick(tag)}
                >
                  #{tag}
                </div>
              ))}
            </>
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {inputValue.trim() ? (
                <div
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  onClick={() => addTag(inputValue.trim())}
                >
                  Create "{inputValue.trim()}"
                </div>
              ) : (
                "No tags found"
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}