import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentMethod } from './PaymentMethod';

const { mockPortal, mockUseUser, mockUseBilling } = vi.hoisted(() => ({
  mockPortal: vi.fn(),
  mockUseUser: vi.fn(),
  mockUseBilling: vi.fn(),
}));

vi.mock('@/shared/hooks', () => ({ useUser: () => mockUseUser() }));
vi.mock('../hooks', () => ({ useBilling: () => mockUseBilling() }));
vi.mock('@/shared/ui', () => ({
  AppButton: ({ text, onClick }: unknown) => <button onClick={onClick}>{text}</button>,
}));

describe('PaymentMethod', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBilling.mockReturnValue({ openBillingPortal: mockPortal });
  });

  it('renders free UI', () => {
    mockUseUser.mockReturnValue({ isProActive: false });
    render(<PaymentMethod />);
    expect(screen.getByText(/No active payment method/)).toBeInTheDocument();
  });

  it('renders pro UI', () => {
    mockUseUser.mockReturnValue({ isProActive: true });
    render(<PaymentMethod />);
    expect(screen.getByText('VISA')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Update card details'));
    expect(mockPortal).toHaveBeenCalled();
  });
});
