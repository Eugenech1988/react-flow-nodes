import { useState } from 'react';
import { api } from '@/shared/api';
import type { TPlanId } from '../types';

export const usePlanSelection = (isProActive: boolean) => {
  const [processingPlan, setProcessingPlan] = useState<TPlanId | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectPlan = async (
    planId: TPlanId,
    billingCycle: 'monthly' | 'yearly'
  ) => {
    if (planId === 'free') {
      if (isProActive) {
        window.location.href = '/settings/billing/portal';
      }
      return;
    }

    // Enterprise: open email
    if (planId === 'enterprise') {
      window.location.href =
        'mailto:enterprise@yourdomain.com?subject=Enterprise%20Plan%20Inquiry';
      return;
    }

    // Pro plan: initiate checkout
    if (planId === 'pro') {
      if (isProActive) return; // already on pro

      try {
        setProcessingPlan(planId);
        setErrorMessage(null);

        const data = await api.post<{ url: string }>('/billing/checkout', {
          plan: 'PRO',
          interval: billingCycle,
        });

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