import { Shield } from 'lucide-react';

interface SafetyScoreTagProps {
  score: number;
  size?: 'sm' | 'md';
  variant?: 'default' | 'details' | 'number-only';
}

export function SafetyScoreTag({ score, size = 'sm', variant = 'default' }: SafetyScoreTagProps) {
  const getSafetyTierInfo = (tier: number) => {
    switch (tier) {
      case 5:
        return {
          name: 'Publish Ready',
          textColor: 'text-green-700',
          borderColor: '#16a34a', // Pure green
          backgroundColor: 'rgba(220, 252, 231, 0.5)' // Light green with 50% opacity
        };
      case 4:
        return {
          name: 'Good to Publish',
          textColor: 'text-green-600',
          borderColor: '#059669', // Slightly lighter green
          backgroundColor: 'rgba(220, 252, 231, 0.3)' // Light green with 30% opacity
        };
      case 3:
        return {
          name: 'Review First',
          textColor: 'text-amber-700',
          borderColor: '#d97706', // Pure amber
          backgroundColor: 'rgba(254, 243, 199, 0.5)' // Light amber with 50% opacity
        };
      case 2:
        return {
          name: 'Needs Work',
          textColor: 'text-orange-700',
          borderColor: '#ea580c', // Pure orange
          backgroundColor: 'rgba(254, 215, 170, 0.5)' // Light orange with 50% opacity
        };
      case 1:
      default:
        return {
          name: 'Not Suitable',
          textColor: 'text-red-700',
          borderColor: '#dc2626', // Pure red
          backgroundColor: 'rgba(254, 202, 202, 0.5)' // Light red with 50% opacity
        };
    }
  };

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