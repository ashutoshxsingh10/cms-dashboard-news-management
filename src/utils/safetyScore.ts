import { CheckmarkCircle02Icon, Shield01Icon, Alert02Icon } from '@hugeicons/core-free-icons';
import type { SafetyTierInfo } from '../types';

export interface SafetyTierInfoWithIcon extends SafetyTierInfo {
  icon: typeof CheckmarkCircle02Icon;
}

export function getSafetyTierInfo(tier: number): SafetyTierInfoWithIcon {
  switch (tier) {
    case 5:
      return {
        name: 'Publish Ready',
        textColor: 'text-green-700',
        borderColor: '#16a34a',
        backgroundColor: 'rgba(220, 252, 231, 0.5)',
        icon: CheckmarkCircle02Icon,
      };
    case 4:
      return {
        name: 'Good to Publish',
        textColor: 'text-green-600',
        borderColor: '#059669',
        backgroundColor: 'rgba(220, 252, 231, 0.3)',
        icon: CheckmarkCircle02Icon,
      };
    case 3:
      return {
        name: 'Review First',
        textColor: 'text-amber-700',
        borderColor: '#d97706',
        backgroundColor: 'rgba(254, 243, 199, 0.5)',
        icon: Shield01Icon,
      };
    case 2:
      return {
        name: 'Needs Work',
        textColor: 'text-orange-700',
        borderColor: '#ea580c',
        backgroundColor: 'rgba(254, 215, 170, 0.5)',
        icon: Alert02Icon,
      };
    case 1:
    default:
      return {
        name: 'Not Suitable',
        textColor: 'text-red-700',
        borderColor: '#dc2626',
        backgroundColor: 'rgba(254, 202, 202, 0.5)',
        icon: Alert02Icon,
      };
  }
}

export function getSafetyScorePadding(variant: 'default' | 'details' | 'number-only', size: 'sm' | 'md'): string {
  if (variant === 'details') {
    return size === 'sm' ? 'px-1 py-1' : 'px-2 py-1.5';
  }
  return size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5';
}
