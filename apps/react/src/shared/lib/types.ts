export type TProfile = {
  id: string;
  userId: string;
  nickName: string;
  firstName: string;
  lastName?: string | null;
  avatarUrl: string | null;
  company?: string | null;
  location?: string | null;
  jobTitle?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TSubscription = {
  id: string;
  userId: string;
  plan: string;
  planStatus: string;
  customerId: string;
  subscriptionId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  email: string;
  provider: 'google' | 'github' | 'local';
  providerId: string;
  createdAt: string;
  updatedAt: string;
  profile: TProfile | null;
  subscription: TSubscription | null;
  isTwoFactorEnabled?: boolean;
  twoFactorSecret?: string;
}