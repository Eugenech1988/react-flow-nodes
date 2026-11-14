import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SubscriptionCard } from './SubscriptionCard';

const { mockCancel, mockActivate, mockUseUser, mockUseBilling } = vi.hoisted(() => ({
  mockCancel: vi.fn(),
  mockActivate: vi.fn(),
  mockUseUser: vi.fn(),
  mockUseBilling: vi.fn(),
}));

vi.mock('@/shared/hooks', () => ({ useUser: () => mockUseUser() }));
vi.mock('../hooks/useBilling', () => ({ useBilling: () => mockUseBilling() }));
vi.mock('@/shared/ui', () => ({
  AppButton: ({ text, onClick, isLink, linkTo }: unknown) =>
    isLink ? <a href={linkTo}>{text}</a> : <button onClick={onClick}>{text}</button>,
}));

describe('SubscriptionCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBilling.mockReturnValue({
      isProcessing: false,
      subscription: null,
      cancelSubscription: mockCancel,
      activateSubscription: mockActivate,
    });
  });

  it('renders free tier UI', () => {
    mockUseUser.mockReturnValue({ isProActive: false });
    render(<SubscriptionCard />);
    expect(screen.getByText('Free Tier')).toBeInTheDocument();
    expect(screen.getByText('Free Account')).toBeInTheDocument();
    expect(screen.getByText('Activate Pro Plan')).toBeInTheDocument();
  });

  it('renders pro tier UI', () => {
    mockUseUser.mockReturnValue({ isProActive: true });
    render(<SubscriptionCard />);
    expect(screen.getByText('Active Plan')).toBeInTheDocument();
    expect(screen.getByText('Pro Account')).toBeInTheDocument();
    expect(screen.getByText('Cancel subscription')).toBeInTheDocument();
  });

  it('triggers activate', () => {
    mockUseUser.mockReturnValue({ isProActive: false });
    render(<SubscriptionCard />);
    fireEvent.click(screen.getByText('Activate Pro Plan'));
    expect(mockActivate).toHaveBeenCalled();
  });

  it('triggers cancel', () => {
    mockUseUser.mockReturnValue({ isProActive: true });
    render(<SubscriptionCard />);
    fireEvent.click(screen.getByText('Cancel subscription'));
    expect(mockCancel).toHaveBeenCalled();
  });
});
