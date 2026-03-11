import { HugeiconsIcon } from '@hugeicons/react';
import { Shield01Icon } from '@hugeicons/core-free-icons';
import { getSafetyTierInfo, getSafetyScorePadding } from '../utils/safetyScore';

interface SafetyScoreTagProps {
  score: number;
  size?: 'sm' | 'md';
  variant?: 'default' | 'details' | 'number-only';
}

export function SafetyScoreTag({ score, size = 'sm', variant = 'default' }: SafetyScoreTagProps) {
  const tierInfo = getSafetyTierInfo(score);
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  
  const padding = getSafetyScorePadding(variant, size);
  
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  // For number-only variant, show just the score number
  if (variant === 'number-only') {
    return (
      <div 
        className={`flex items-center gap-1 rounded-lg border ${tierInfo.textColor} ${padding}`} 
        style={{ 
          borderColor: tierInfo.borderColor,
          backgroundColor: tierInfo.backgroundColor
        }}
      >
        <HugeiconsIcon icon={Shield01Icon} className={iconSize} />
        <span className={`${textSize} font-medium`}>{score}</span>
      </div>
    );
  }

  // For default and details variants, show the text name
  return (
    <div 
      className={`flex items-center gap-1 rounded-lg border ${tierInfo.textColor} ${padding}`} 
      style={{ 
        borderColor: tierInfo.borderColor,
        backgroundColor: tierInfo.backgroundColor
      }}
    >
      <HugeiconsIcon icon={Shield01Icon} className={iconSize} />
      <span className={`${textSize} font-medium`}>{tierInfo.name}</span>
    </div>
  );
}