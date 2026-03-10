import { CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import type { SafetyTierInfo } from '../types';

export interface SafetyTierInfoWithIcon extends SafetyTierInfo {
  icon: typeof CheckCircle;
}

export function getSafetyTierInfo(tier: number): SafetyTierInfoWithIcon {
  switch (tier) {
    case 5:
      return {
        name: 'Publish Ready',
        textColor: 'text-green-700',
        borderColor: '#16a34a',
        backgroundColor: 'rgba(220, 252, 231, 0.5)',
        icon: CheckCircle,
      };
    case 4:
      return {
        name: 'Good to Publish',
        textColor: 'text-green-600',
        borderColor: '#059669',
        backgroundColor: 'rgba(220, 252, 231, 0.3)',
        icon: CheckCircle,
      };
    case 3:
      return {
        name: 'Review First',
        textColor: 'text-amber-700',
        borderColor: '#d97706',
        backgroundColor: 'rgba(254, 243, 199, 0.5)',
        icon: Shield,
      };
    case 2:
      return {
        name: 'Needs Work',
        textColor: 'text-orange-700',
        borderColor: '#ea580c',
        backgroundColor: 'rgba(254, 215, 170, 0.5)',
        icon: AlertTriangle,
      };
    case 1:
    default:
      return {
        name: 'Not Suitable',
        textColor: 'text-red-700',
        borderColor: '#dc2626',
        backgroundColor: 'rgba(254, 202, 202, 0.5)',
        icon: AlertTriangle,
      };
  }
}
