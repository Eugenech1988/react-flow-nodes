import type { TUserRole } from './types';

const BASE_URL = import.meta.env.VITE_API_URL;

interface ISubscriptionLike {
  plan?: string | null;
  planStatus?: string | null;
}

export const redirectByRole = (role: TUserRole | null | undefined): string => {
  if (role === 'CONTENT_MANAGER') return '/admin/jobs';
  return '/';
};

export const canSeeBilling = (role: TUserRole | null | undefined): boolean => {
  return role !== 'CONTENT_MANAGER';
};

export const resolveIsProActive = (subscription: ISubscriptionLike | null | undefined): boolean => {
  return subscription?.plan === 'PRO' && subscription?.planStatus === 'ACTIVE';
};

export const resolveAvatarUrl = (raw: string | null | undefined): string | null => {
  if (!raw) return null;
  if (raw.startsWith('http') || raw.startsWith('blob:') || raw.startsWith('data:')) {
    return raw;
  }
  return `${BASE_URL}${raw}`;
};
