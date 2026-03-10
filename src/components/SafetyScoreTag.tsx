import { Shield } from 'lucide-react';
import { getSafetyTierInfo } from '../utils/safetyScore';

interface SafetyScoreTagProps {
  score: number;
  size?: 'sm' | 'md';
  variant?: 'default' | 'details' | 'number-only';
}

export function SafetyScoreTag({ score, size = 'sm', variant = 'default' }: SafetyScoreTagProps) {
  const tierInfo = getSafetyTierInfo(score);
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  
  // Adjust padding based on variant - reduce by 2px each side for details
  let padding;
  if (variant === 'details') {
    padding = size === 'sm' ? 'px-1 py-1' : 'px-2 py-1.5';
  } else {
    padding = size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5';
  }
  
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  // For number-only variant, show just the score number
  if (variant === 'number-only') {
    return (
      <div 
        className={`flex items-center gap-1 rounded-[8px] border ${tierInfo.textColor} ${padding}`} 
        style={{ 
          borderColor: tierInfo.borderColor,
          backgroundColor: tierInfo.backgroundColor
        }}
      >
        <Shield className={iconSize} />
        <span className={`${textSize} font-medium`}>{score}</span>
      </div>
    );
  }

  // For default and details variants, show the text name
  return (
    <div 
      className={`flex items-center gap-1 rounded-[8px] border ${tierInfo.textColor} ${padding}`} 
      style={{ 
        borderColor: tierInfo.borderColor,
        backgroundColor: tierInfo.backgroundColor
      }}
    >
      <Shield className={iconSize} />
      <span className={`${textSize} font-medium`}>{tierInfo.name}</span>
    </div>
  );
}