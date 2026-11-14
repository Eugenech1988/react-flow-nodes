import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TwoFactorForm } from './TwoFactorForm';

const { mockUseAuthStore } = vi.hoisted(() => ({
  mockUseAuthStore: vi.fn(),
}));

vi.mock('../model', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

vi.mock('@/shared/ui', () => ({
  AppButton: ({ text, type, onClick }: unknown) => <button type={type} onClick={onClick}>{text}</button>,
  LocalAlert: ({ alertMessage }: unknown) => <div>{alertMessage}</div>,
}));

vi.mock('@pipeline/ui', () => ({
  Input: (props: unknown) => <input {...props} />,
}));

vi.mock('@/shared/lib', () => ({
  cn: (...classes: Array<string | undefined | false | null>) => classes.filter(Boolean).join(' '),
}));

describe('TwoFactorForm', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({ tempToken: 'temp' });
  });

  const defaultProps = {
    isLoading: false,
    onVerify: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders correctly and submits code', async () => {
    render(<TwoFactorForm {...defaultProps} />);

    const input = screen.getByPlaceholderText('123456 or recovery code');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(defaultProps.onVerify).toHaveBeenCalledWith(
        { tempToken: 'temp', code: '123456' },
        expect.anything()
      );
    });
  });

  it('shows error message', () => {
    render(<TwoFactorForm {...defaultProps} error="Invalid code" />);
    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });

  it('triggers onBack on cancel', () => {
    render(<TwoFactorForm {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onBack).toHaveBeenCalled();
  });
});
