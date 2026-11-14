import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BillingTab } from './BillingTab';

const { mockUseBilling } = vi.hoisted(() => ({ mockUseBilling: vi.fn() }));

vi.mock('./hooks/useBilling', () => ({ useBilling: () => mockUseBilling() }));
vi.mock('@/shared/ui', () => ({
  AppButton: ({ text, onClick, isLink, linkTo }: unknown) =>
    isLink ? <a href={linkTo}>{text}</a> : <button onClick={onClick}>{text}</button>,
}));
vi.mock('./components', () => ({
  SubscriptionCard: () => <div data-testid="subscription-card" />,
  UsageStats: () => <div data-testid="usage-stats" />,
  PaymentMethod: () => <div data-testid="payment-method" />,
  InvoiceHistory: () => <div data-testid="invoice-history" />,
}));

describe('BillingTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseBilling.mockReturnValue({ isSubscriptionLoading: true });
    render(<BillingTab />);
    expect(screen.getByText('Loading subscription status...')).toBeInTheDocument();
  });

  it('renders full layout', () => {
    mockUseBilling.mockReturnValue({
      isSubscriptionLoading: false,
      errorMessage: null,
      successMessage: null,
      dismissSuccess: vi.fn(),
      dismissError: vi.fn(),
    });
    render(<BillingTab />);
    expect(screen.getByTestId('subscription-card')).toBeInTheDocument();
    expect(screen.getByTestId('usage-stats')).toBeInTheDocument();
    expect(screen.getByTestId('payment-method')).toBeInTheDocument();
    expect(screen.getByTestId('invoice-history')).toBeInTheDocument();
  });

  it('renders success message and dismisses', () => {
    const dismiss = vi.fn();
    mockUseBilling.mockReturnValue({
      isSubscriptionLoading: false,
      errorMessage: null,
      successMessage: 'Success!',
      dismissSuccess: dismiss,
      dismissError: vi.fn(),
    });
    render(<BillingTab />);
    expect(screen.getByText('Success!')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Dismiss'));
    expect(dismiss).toHaveBeenCalled();
  });
});
