export type TUserRole = 'USER' | 'CONTENT_MANAGER' | 'SUPER_ADMIN';
export type TUserPlan = 'FREE' | 'PRO' | 'ENTERPRISE';
export type TSubscriptionPlanStatus = 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING';
export type TTransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED';
export type TCurrentPipelineStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
export type TCurrentPipelineRunStatus = 'SUCCESS' | 'FAILED' | 'RUNNING';

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
};

export type TTransaction = {
  id: string;
  userId: string;
  invoiceId: string | null;
  providerTxId: string;
  amount: number;
  currency: string;
  status: TTransactionStatus;
  plan: TUserPlan;
  invoiceUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TSubscription = {
  id: string;
  userId: string;
  plan: TUserPlan;
  planStatus: TSubscriptionPlanStatus;
  customerId: string | null;
  subscriptionId: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TCurrentPipeline = {
  id: string;
  name: string;
  description: string | null;
  status: TCurrentPipelineStatus | null;
  lastRunAt: string | null;
  lastRunStatus: TCurrentPipelineRunStatus | null;
  screenshotUrl: string | null;
};

export interface IUser {
  id: string;
  email: string;
  provider: 'google' | 'github' | 'local';
  providerId: string;
  role: TUserRole;
  hasPassword: boolean;
  isTwoFactorEnabled: boolean;
  currentPipelineId: string | null;
  currentPipeline: TCurrentPipeline | null;
  createdAt: string;
  updatedAt: string;
  profile: TProfile | null;
  subscription: TSubscription | null;
  transactions: TTransaction[];
}

export type TRoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export type TAlertState = {
  type: 'success' | 'error';
  message: string;
} | null;
