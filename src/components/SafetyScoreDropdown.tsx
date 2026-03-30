import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Shield01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { getSafetyTierInfo, getSafetyScorePadding } from '../utils/safetyScore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { toast } from "sonner@2.0.3";

interface SafetyScoreDropdownProps {
  score: number;
  originalScore: number;
  size?: 'sm' | 'md';
  variant?: 'default' | 'details' | 'number-only';
  onScoreChange: (newScore: number) => void;
  isReadOnly?: boolean;
  roundupStatus?: 'live' | 'paused' | 'expired' | 'archived';
}

export function SafetyScoreDropdown({ 
  score, 
  originalScore, 
  size = 'sm', 
  variant = 'default',
  onScoreChange,
  isReadOnly = false,
  roundupStatus
}: SafetyScoreDropdownProps) {
  const [isHovered, setIsHovered] = useState(false);

  const tierInfo = getSafetyTierInfo(score);
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const chevronSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  
  const padding = getSafetyScorePadding(variant, size);
  
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  const handleDropdownClick = () => {
    if (isReadOnly || roundupStatus) {
      let message = "Content safety rating cannot be modified for published articles in round-ups.";
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

  const generateTierOptions = () => {
    const options = [];
    for (let i = 1; i <= 10; i++) {
      const optionTierInfo = getSafetyTierInfo(i);
      const IconComponent = optionTierInfo.icon;
      const isOriginal = i === originalScore;
      const isCurrent = i === score;
      
      options.push(
        <DropdownMenuItem
          key={i}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer"
          onClick={() => onScoreChange(i)}
        >
          <div 
            className={`flex items-center gap-2 rounded-md border px-2 py-1 ${optionTierInfo.textColor}`}
            style={{ 
              borderColor: optionTierInfo.borderColor,
              backgroundColor: optionTierInfo.backgroundColor
            }}
          >
            <IconComponent className="h-3 w-3" />
            <span className="text-xs font-medium">{i}</span>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm whitespace-nowrap">{optionTierInfo.name}</span>
            {isOriginal && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full whitespace-nowrap">
                Auto-generated
              </span>
            )}
            {isCurrent && !isOriginal && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                Current
              </span>
            )}
          </div>
        </DropdownMenuItem>
      );
    }
    return options;
  };

  // Determine display content based on variant
  const displayContent = variant === 'number-only' ? score : tierInfo.name;

  // If read-only or in round-up, render as non-interactive element
  if (isReadOnly || roundupStatus) {
    return (
      <div 
        className={`flex items-center gap-1 rounded-lg border ${tierInfo.textColor} ${padding} cursor-pointer hover:opacity-80 transition-opacity`}
        style={{ 
          borderColor: tierInfo.borderColor,
          backgroundColor: tierInfo.backgroundColor
        }}
        onClick={handleDropdownClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <HugeiconsIcon icon={Shield01Icon} className={iconSize} />
        <span className={`${textSize} font-medium`}>{displayContent}</span>
        <HugeiconsIcon icon={ArrowDown01Icon}
          className={`${chevronSize} transition-opacity ${isHovered ? 'opacity-70' : 'opacity-0'}`}
        />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex items-center gap-1 rounded-lg border ${tierInfo.textColor} ${padding} cursor-pointer hover:opacity-80 transition-opacity`}
          style={{
            borderColor: tierInfo.borderColor,
            backgroundColor: tierInfo.backgroundColor
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <HugeiconsIcon icon={Shield01Icon} className={iconSize} />
          <span className={`${textSize} font-medium`}>{displayContent}</span>
          <HugeiconsIcon icon={ArrowDown01Icon}
            className={`${chevronSize} transition-opacity ${isHovered ? 'opacity-70' : 'opacity-0'}`}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start">
        <div className="p-2">
          <div className="text-sm font-medium mb-2 text-foreground">Select Content Safety Rating</div>
          <div className="space-y-1">
            {generateTierOptions()}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}