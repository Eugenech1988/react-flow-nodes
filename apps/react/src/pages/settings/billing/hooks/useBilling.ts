import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSubscription, useTransactions } from '@/shared/hooks';
import { useTRPC } from '@/shared/api';
import type { TBillingCycle, TCheckoutPlanInputData } from '@pipeline/contracts';

interface IBillingBanner {
  error: string | null;
  success: string | null;
}

export const useBilling = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const [searchParams, setSearchParams] = useSearchParams();

  const { subscription, isLoading: isSubscriptionLoading } = useSubscription();
  const { transactions, isLoading: isTransactionLoading } = useTransactions();

  const [banner, setBanner] = useState<IBillingBanner>(() => {
    if (searchParams.get('success') === 'true') {
      return { error: null, success: 'Payment successful! Your Pro plan is now active.' };
    }
    if (searchParams.get('canceled') === 'true') {
      return { error: 'Payment was canceled.', success: null };
    }
    return { error: null, success: null };
  });

  useEffect(() => {
    if (searchParams.has('success') || searchParams.has('canceled')) {
      if (searchParams.get('success') === 'true') {
        queryClient.invalidateQueries(trpc.billing.subscription.queryFilter());
        queryClient.invalidateQueries(trpc.auth.me.queryFilter());
      }

      const newParams = new URLSearchParams(searchParams);
      newParams.delete('success');
      newParams.delete('canceled');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, queryClient, trpc]);

  const checkoutMutation = useMutation(
    trpc.billing.checkout.mutationOptions({
      onMutate: () => setBanner({ error: null, success: null }),
      onSuccess: (data) => {
        if (data?.url) {
          window.location.href = data.url;
          return;
        }
        setBanner({ error: 'Failed to retrieve payment link.', success: null });
      },
      onError: (error) => {
        setBanner({
          error: error.message || 'Failed to initialize payment.',
          success: null,
        });
      },
    }),
  );

  const cancelMutation = useMutation(
    trpc.billing.cancel.mutationOptions({
      onMutate: () => setBanner({ error: null, success: null }),
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.billing.subscription.queryFilter());
        await queryClient.invalidateQueries(trpc.auth.me.queryFilter());
        setBanner({ error: null, success: 'Subscription successfully canceled.' });
      },
      onError: (error) => {
        setBanner({
          error: error.message || 'Failed to cancel subscription.',
          success: null,
        });
      },
    }),
  );

  const dismissError = () => {
    setBanner((prev) => ({ ...prev, error: null }));
    checkoutMutation.reset();
    cancelMutation.reset();
  };

  const dismissSuccess = () => {
    setBanner((prev) => ({ ...prev, success: null }));
  };

  const openBillingPortal = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/billing/portal`;
  };

  const activateSubscription = (cycle: TBillingCycle = 'monthly') => {
    const payload: TCheckoutPlanInputData = { plan: 'PRO', cycle };
    checkoutMutation.mutate(payload);
  };

  const cancelSubscription = () => {
    cancelMutation.mutate();
  };

  return {
    subscription,
    isSubscriptionLoading,
    transactions,
    isTransactionLoading,
    isProcessing: checkoutMutation.isPending || cancelMutation.isPending,
    errorMessage: banner.error,
    successMessage: banner.success,
    activateSubscription,
    cancelSubscription,
    openBillingPortal,
    dismissSuccess,
    dismissError,
  };
};
