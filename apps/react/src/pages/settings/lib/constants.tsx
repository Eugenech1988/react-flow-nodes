
import { User, Shield, CreditCard, Cpu, Clock, HardDrive } from 'lucide-react';

export const SETTINGS_TABS = (isProActive: boolean) => [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account Settings', icon: Shield },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    badge: isProActive ? 'PRO' : undefined,
  },
];

export const PLAN_FEATURES = [
  'Unlimited pipelines execution & storage',
  'Priority high-performance LLM node queue',
  'Advanced analytics & multi-db integrations',
  '24/7 Dedicated engineering support',
];

export const PLAN_USAGE_STATS = (isProActive: boolean) => [
  {
    label: 'Pipeline Executions',
    icon: <Cpu className="w-4 h-4 text-teal-500" />,
    value: isProActive ? 'Unlimited' : '85 / 100',
    sub: 'Resets on the 1st of next month',
    percentage: isProActive ? 100 : 85,
    barColor: 'bg-teal-600 dark:bg-teal-500',
  },
  {
    label: 'Execution Time',
    icon: <Clock className="w-4 h-4 text-teal-500" />,
    value: isProActive ? '12.4 hrs' : '4.2 / 5 hrs',
    sub: 'Compute hours consumed this cycle',
    percentage: isProActive ? 30 : 84,
    barColor: isProActive ? 'bg-teal-600 dark:bg-teal-500' : 'bg-amber-500',
  },
  {
    label: 'Pipeline Storage',
    icon: <HardDrive className="w-4 h-4 text-teal-500" />,
    value: `1.2 GB / ${isProActive ? '100 GB' : '2 GB'}`,
    sub: 'Artifacts and cache storage',
    percentage: isProActive ? 1.2 : 60,
    barColor: 'bg-teal-600 dark:bg-teal-500',
  },
]