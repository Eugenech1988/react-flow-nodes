import { User, Shield, CreditCard } from 'lucide-react';

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