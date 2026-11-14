import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RecoveryForm } from './RecoveryForm';

vi.mock('@/shared/ui', () => ({
  FloatingInput: (props: unknown) => <input data-testid={`input-${props.label}`} {...props} />,
  LocalAlert: ({ alertMessage }: unknown) => <div>{alertMessage}</div>,
  AppButton: ({ text, type, onClick }: unknown) => <button type={type} onClick={onClick}>{text}</button>,
}));

describe('RecoveryForm', () => {
  const defaultProps = {
    isLoading: false,
    onRequestSubmit: vi.fn(),
    onResetSubmit: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders request mode', () => {
    render(<RecoveryForm {...defaultProps} mode="request" />);
    expect(screen.getByTestId('input-Email Address')).toBeInTheDocument();
    expect(screen.getByText('Send Link')).toBeInTheDocument();
  });

  it('renders reset mode', () => {
    render(<RecoveryForm {...defaultProps} mode="reset" />);
    expect(screen.getByTestId('input-New Password')).toBeInTheDocument();
    expect(screen.getByTestId('input-Confirm New Password')).toBeInTheDocument();
    expect(screen.getByText('Update Password')).toBeInTheDocument();
  });

  it('renders success state', () => {
    render(<RecoveryForm {...defaultProps} mode="request" isSuccess={true} />);
    expect(screen.getByText('Check your email for a link to reset your password.')).toBeInTheDocument();
  });

  it('triggers onBack', () => {
    render(<RecoveryForm {...defaultProps} mode="request" />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onBack).toHaveBeenCalled();
  });
});
