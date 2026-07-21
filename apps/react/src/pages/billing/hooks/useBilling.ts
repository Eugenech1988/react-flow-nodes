// src/pages/settings/billing/hooks/useBilling.ts
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSubscription, useTransactions } from '@/shared/hooks';
import { api } from '@/shared/api';

export const useBilling = () => {
  const { subscription, isProActive, isLoading: isSubscriptionLoading, refetch } = useSubscription();
  const { transactions, isLoading: isTransactionLoading } = useTransactions();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccessMessage('Payment successful! Your Pro plan is now active.');
      refetch?.();
      searchParams.delete('success');
      setSearchParams(searchParams, { replace: true });
    } else if (searchParams.get('canceled') === 'true') {
      setErrorMessage('Payment was canceled.');
      searchParams.delete('canceled');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, refetch]);

  const activateSubscription = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const data = await api.post<{ url: string }>('/billing/checkout', {
        plan: 'PRO',
      });

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to retrieve payment link from server.');
      }
    } catch (error: any) {
      console.error('Failed to create Stripe checkout session', error);
      const serverMessage = error?.response?.data?.message;
      const detailedMessage = Array.isArray(serverMessage) ? serverMessage.join(', ') : serverMessage;
      setErrorMessage(
        detailedMessage || error?.message || 'Failed to initialize payment. Please try again later.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelSubscription = () => {
    window.location.href = '/settings/billing/portal';
  };

  const dismissSuccess = () => setSuccessMessage(null);
  const dismissError = () => setErrorMessage(null);

  return {
    subscription,
    isProActive,
    isSubscriptionLoading,
    transactions,
    isTransactionLoading,
    isProcessing,
    errorMessage,
    successMessage,
    activateSubscription,
    cancelSubscription,
    dismissSuccess,
    dismissError,
    navigate,
  };
};