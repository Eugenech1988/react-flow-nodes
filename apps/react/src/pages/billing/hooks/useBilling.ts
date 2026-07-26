import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/shared/hooks';
import { useSubscription, useTransactions } from '@/shared/hooks';
import { useTRPC } from '@/shared/api';

const parseErrorMessage = (error: any, fallback: string) => {
  const msg = error?.response?.data?.message;
  return (Array.isArray(msg) ? msg.join(', ') : msg) || error?.message || fallback;
};

export const useBilling = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isProActive } = useUser();

  const { subscription, isLoading: isSubscriptionLoading } = useSubscription();
  const { transactions, isLoading: isTransactionLoading } = useTransactions();

  const [bannerMessage, setBannerMessage] = useState<{ error: string | null; success: string | null }>(() => {
    if (searchParams.get('success') === 'true') {
      return { error: null, success: 'Payment successful! Your Pro plan is now active.' };
    }
    if (searchParams.get('canceled') === 'true') {
      return { error: 'Payment was canceled.', success: null };
    }
    return { error: null, success: null };
  });

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      queryClient.invalidateQueries({ queryKey: trpc.billing.subscription.queryKey() });
    }
  }, [searchParams, queryClient]);

  const clearQueryParams = () => {
    if (searchParams.has('success') || searchParams.has('canceled')) {
      searchParams.delete('success');
      searchParams.delete('canceled');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const checkoutMutation = useMutation(
    trpc.billing.checkout.mutationOptions({
      onMutate: () => {
      clearQueryParams();
      setBannerMessage({ error: null, success: null });
      },
      onSuccess: (data) => {
        if (data.url) window.location.href = data.url;
        else setBannerMessage({ error: 'Failed to retrieve payment link from server.', success: null });
      },
    }),
  );

  const cancelMutation = useMutation(
    trpc.billing.cancel.mutationOptions({
      onMutate: () => {
      clearQueryParams();
      setBannerMessage({ error: null, success: null });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.billing.subscription.queryKey() });
      },
    }),
  );

  const errorMessage =
    (checkoutMutation.error && parseErrorMessage(checkoutMutation.error, 'Failed to initialize payment.')) ||
    (cancelMutation.error && parseErrorMessage(cancelMutation.error, 'Failed to cancel subscription.')) ||
    bannerMessage.error;

  const successMessage = cancelMutation.isSuccess
    ? 'Subscription successfully canceled.'
    : bannerMessage.success;

  const isProcessing = checkoutMutation.isPending || cancelMutation.isPending;

  const dismissError = () => {
    setBannerMessage((prev) => ({ ...prev, error: null }));
    checkoutMutation.reset();
    cancelMutation.reset();
  };

  const dismissSuccess = () => {
    setBannerMessage((prev) => ({ ...prev, success: null }));
    cancelMutation.reset();
  };

  return {
    subscription,
    isProActive,
    isSubscriptionLoading,
    transactions,
    isTransactionLoading,
    isProcessing,
    errorMessage,
    successMessage,
    activateSubscription: () => checkoutMutation.mutate('PRO'),
    cancelSubscription: () => cancelMutation.mutate(),
    dismissSuccess,
    dismissError,
    navigate,
  };
};
