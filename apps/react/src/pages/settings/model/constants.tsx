import { User, Shield, CreditCard, Cpu, Clock, HardDrive } from 'lucide-react';
import type { TabItem } from '@/shared/ui';
import type { IUsageStatItem } from './types';

export const SETTINGS_TABS = (
  isProActive: boolean,
  isContentManager: boolean = false,
): TabItem[] => [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account Settings', icon: Shield },
  ...(!isContentManager
    ? [
        {
          id: 'billing',
          label: 'Billing',
          icon: CreditCard,
          badge: isProActive ? 'PRO' : undefined,
        },
      ]
    : []),
];

export const PLAN_FEATURES = [
  'Unlimited pipelines execution & storage',
  'Priority high-performance LLM node queue',
  'Advanced analytics & multi-db integrations',
  '24/7 Dedicated engineering support',
];

export const PLAN_USAGE_STATS = (isProActive: boolean): IUsageStatItem[] => [
  {
    label: 'Pipeline Executions',
    icon: <Cpu className="h-4 w-4 text-teal-500" />,
    value: isProActive ? 'Unlimited' : '85 / 100',
    sub: isProActive ? 'No monthly execution cap' : 'Resets on the 1st of next month',
    percentage: isProActive ? 0 : 85,
    isUnlimited: isProActive,
    barColor: 'bg-teal-600 dark:bg-teal-500',
  },
  {
    label: 'Execution Time',
    icon: <Clock className="h-4 w-4 text-teal-500" />,
    value: isProActive ? 'Unlimited' : '4.2 / 5 hrs',
    sub: isProActive ? 'No compute hour cap' : 'Compute hours consumed this cycle',
    percentage: isProActive ? 0 : 84,
    isUnlimited: isProActive,
    barColor: isProActive ? 'bg-teal-600 dark:bg-teal-500' : 'bg-amber-500',
  },
  {
    label: 'Pipeline Storage',
    icon: <HardDrive className="h-4 w-4 text-teal-500" />,
    value: `1.2 GB / ${isProActive ? '100 GB' : '2 GB'}`,
    sub: 'Artifacts and cache storage',
    percentage: isProActive ? 1.2 : 60,
    barColor: 'bg-teal-600 dark:bg-teal-500',
  },
];
