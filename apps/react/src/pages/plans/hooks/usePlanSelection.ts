import { useState } from 'react';
import { trpcClient } from '@/shared/api';
import type { TCheckoutPlanInputData, TBillingCycle } from '@pipeline/contracts';
import type { TPlanId } from '../model';

interface ITrpcLikeError {
  message?: unknown;
  data?: { message?: unknown };
}

const isTrpcLikeError = (value: unknown): value is ITrpcLikeError =>
  typeof value === 'object' && value !== null;

const extractErrorMessage = (error: unknown): string | null => {
  if (!isTrpcLikeError(error)) return null;

  const dataMessage = error.data?.message;
  if (typeof dataMessage === 'string' && dataMessage.length > 0) return dataMessage;

  const message = error.message;
  if (typeof message === 'string' && message.length > 0) return message;

  return null;
};

export const usePlanSelection = (isProActive: boolean) => {
  const [processingPlan, setProcessingPlan] = useState<TPlanId | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectPlan = async (planId: TPlanId, billingCycle: TBillingCycle) => {
    if (planId === 'free') {
      if (isProActive) {
        window.location.href = `${import.meta.env.VITE_API_URL}/billing/portal`;
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

        const payload: TCheckoutPlanInputData = {
          plan: 'PRO',
          cycle: billingCycle,
        };

        const data = await trpcClient.billing.checkout.mutate(payload);

        if (data?.url) {
          window.location.href = data.url;
          return;
        }

        throw new Error('Failed to retrieve payment link from server.');
      } catch (error) {
        console.error('Failed to create checkout session', error);
        setErrorMessage(
          extractErrorMessage(error) ??
          'Failed to initialize payment. Please try again later.',
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