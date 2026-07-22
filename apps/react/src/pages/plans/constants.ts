import type { IPlan, TPlanId } from './types';

export const BASE_PLANS: Omit<IPlan, 'popular'>[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Ideal for small projects and experimenting with basic features.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: '5 active pipelines', included: true },
      { text: 'Standard queue processing', included: true },
      { text: 'Basic execution metrics', included: true },
      { text: 'Community support', included: true },
      { text: 'Advanced analytics & DB integration', included: false },
      { text: 'Dedicated engineering support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Perfect for power users and growing teams needing raw performance.',
    monthlyPrice: 49,
    yearlyPrice: 39,
    features: [
      { text: 'Unlimited pipelines execution & storage', included: true },
      { text: 'Priority high-performance LLM node queue', included: true },
      { text: 'Advanced analytics & multi-db integrations', included: true },
      { text: '24/7 Dedicated engineering support', included: true },
      { text: 'SLA guarantees', included: false },
      { text: 'Custom deployment topologies', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For mission-critical infrastructure with dedicated capacity requirements.',
    monthlyPrice: 199,
    yearlyPrice: 159,
    features: [
      { text: 'Everything in Pro plan', included: true },
      { text: 'Custom execution timeout scales', included: true },
      { text: 'Dedicated infrastructure workloads', included: true },
      { text: 'Customized deployment topology models', included: true },
      { text: '99.9% Uptime SLA', included: true },
      { text: 'Dedicated TAM & onboarding support', included: true },
    ],
  },
];

export const getPlans = (isProActive: boolean): IPlan[] => {
  return BASE_PLANS.map((plan) => ({
    ...plan,
    popular: plan.id === 'pro' ? true : undefined,
  }));
};

export const getPlanMeta = (planId: TPlanId, isProActive: boolean) => {
  const isCurrent =
    (planId === 'pro' && isProActive) || (planId === 'free' && !isProActive);

  let buttonText: string;
  let buttonVariant: 'outline' | 'primary' | 'secondary';

  if (isCurrent) {
    buttonText = 'Current Plan';
    buttonVariant = 'outline';
  } else if (planId === 'pro') {
    buttonText = 'Upgrade to Pro';
    buttonVariant = 'primary';
  } else if (planId === 'enterprise') {
    buttonText = 'Contact Sales';
    buttonVariant = 'secondary';
  } else {
    buttonText = isProActive ? 'Downgrade to Free' : 'Current Plan';
    buttonVariant = 'outline';
  }

  return { isCurrent, buttonText, buttonVariant };
};