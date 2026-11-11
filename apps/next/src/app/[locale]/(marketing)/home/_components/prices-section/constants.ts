import { APP_LOGIN_URL } from '@/shared/lib/app-url';

export const PRICING_TIERS = [
  { id: 'hobby', popular: false, href: APP_LOGIN_URL },
  { id: 'pro', popular: true, href: APP_LOGIN_URL },
  { id: 'enterprise', popular: false, href: '#' },
];
