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
