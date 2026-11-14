import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PasswordSection } from './PasswordSection';
import { usePasswordSection } from '../hooks';

vi.mock('../hooks', () => ({
  usePasswordSection: vi.fn(),
}));

vi.mock('@/shared/ui', () => ({
  FloatingInput: (props: unknown) => (
    <input data-testid={`input-${props.label}`} {...props} />
  ),
  LocalAlert: ({ alertMessage }: unknown) => <div>{alertMessage}</div>,
  AppButton: ({ text, onClick, type, isDisabled }: unknown) => (
    <button onClick={onClick} type={type} disabled={isDisabled}>
      {text}
    </button>
  ),
}));

const mockedUsePasswordSection = vi.mocked(usePasswordSection);

const createHookMock =   (overrides: Record<string, unknown> = {}) => ({
  form: {
    register: vi.fn(),
    handleSubmit: vi.fn((fn) => fn),
    formState: { errors: {} },
  },
  onSubmit: vi.fn(),
  hasPassword: true,
  isPending: false,
  isPristine: false,
  alert: null,
  ...overrides,
});

describe('PasswordSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders change password mode', () => {
    mockedUsePasswordSection.mockReturnValue(createHookMock());
    render(<PasswordSection />);
    expect(screen.getByRole('heading', { name: 'Change Password' })).toBeInTheDocument();
    expect(screen.getByTestId('input-Current Password')).toBeInTheDocument();
    expect(screen.getByTestId('input-New Password')).toBeInTheDocument();
  });

  it('renders set password mode', () => {
    mockedUsePasswordSection.mockReturnValue(createHookMock({ hasPassword: false }));
    render(<PasswordSection />);
    expect(screen.getByRole('heading', { name: 'Set Password' })).toBeInTheDocument();
    expect(screen.queryByTestId('input-Current Password')).not.toBeInTheDocument();
    expect(screen.getByTestId('input-Set Password')).toBeInTheDocument();
  });

  it('disables submit if pristine', () => {
    mockedUsePasswordSection.mockReturnValue(createHookMock({ isPristine: true }));
    render(<PasswordSection />);
    const submitBtn = screen.getByRole('button', { name: 'Change Password' });
    expect(submitBtn).toBeDisabled();
  });

  it('renders alert', () => {
    mockedUsePasswordSection.mockReturnValue(
      createHookMock({ alert: { type: 'error', message: 'Error!' } }),
    );
    render(<PasswordSection />);
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });
});
