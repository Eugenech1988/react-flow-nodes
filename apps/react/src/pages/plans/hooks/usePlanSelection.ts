import { useState } from 'react';
import { trpcClient } from '@/shared/api';
import type { TPlanId } from '@/pages/plans/lib';

export const usePlanSelection = (isProActive: boolean) => {
  const [processingPlan, setProcessingPlan] = useState<TPlanId | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectPlan = async (
    planId: TPlanId,
    _billingCycle: 'monthly' | 'yearly'
  ) => {
    if (planId === 'free') {
      if (isProActive) {
        window.location.href = '/settings/billing/portal';
      }
      return;
    }

    if (planId === 'enterprise') {
      window.location.href =
        'mailto:enterprise@yourdomain.com?subject=Enterprise%20Plan%20Inquiry';
      return;
    }

    if (planId === 'pro') {
      if (isProActive) return;

      try {
        setProcessingPlan(planId);
        setErrorMessage(null);

        const data = await trpcClient.billing.checkout.mutate('PRO');

        if (data?.url) {
          window.location.href = data.url;
        } else {
          throw new Error('Failed to retrieve payment link from server.');
        }
      } catch (error: any) {
        console.error('Failed to create checkout session', error);
        const serverMessage = error?.response?.data?.message;
        const detailedMessage = Array.isArray(serverMessage)
          ? serverMessage.join(', ')
          : serverMessage;
        setErrorMessage(
          detailedMessage ||
          error?.message ||
          'Failed to initialize payment. Please try again later.'
        );
      } finally {
        setProcessingPlan(null);
      }
    }
  };

  return {
    processingPlan,
    errorMessage,
    setErrorMessage,
    handleSelectPlan,
  };
};
