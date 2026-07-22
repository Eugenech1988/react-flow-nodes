export type TPlanFeature = {
  text: string;
  included: boolean;
}

export type TPlanId = 'free' | 'pro' | 'enterprise';

export interface IPlan {
  id: TPlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: TPlanFeature[];
}

export interface IPlanWithMeta extends IPlan {
  isCurrent: boolean;
  buttonText: string;
  buttonVariant: 'outline' | 'primary' | 'secondary';
}