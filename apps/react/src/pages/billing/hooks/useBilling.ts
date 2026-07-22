import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSubscription, useTransactions } from '@/shared/hooks';
import { api } from '@/shared/api';
import { SUBSCRIPTION_QUERY_KEY } from '@/shared/lib';

const parseErrorMessage = (error: any, fallback: string) => {
  const msg = error?.response?.data?.message;
  return (Array.isArray(msg) ? msg.join(', ') : msg) || error?.message || fallback;
};

export const useBilling = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { subscription, isProActive, isLoading: isSubscriptionLoading } = useSubscription();
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

  const clearQueryParams = () => {
    if (searchParams.has('success') || searchParams.has('canceled')) {
      searchParams.delete('success');
      searchParams.delete('canceled');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      clearQueryParams();
      setBannerMessage({ error: null, success: null });
      const data = await api.post<{ url: string }>('/billing/checkout', { plan: 'PRO' });
      if (!data?.url) throw new Error('Failed to retrieve payment link from server.');
      return data.url;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      clearQueryParams();
      setBannerMessage({ error: null, success: null });
      return api.post('/billing/cancel');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
    },
  });

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
    activateSubscription: () => checkoutMutation.mutate(),
    cancelSubscription: () => cancelMutation.mutate(),
    dismissSuccess,
    dismissError,
    navigate,
  };
};