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

export type TTransaction = {
  id: string;
  usedrId: string;
  ivoiceId: string;
  providerTxId: string;
  amount: number;
  currency: string;
  plan: string;
  invoiceUrl: string | null;
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

export type TPipeline = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  lastRunStatus?: 'success' | 'failed' | 'running';
  lastRunAt?: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
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
  transactions: TTransaction[];
  isTwoFactorEnabled?: boolean;
  twoFactorSecret?: string;
}