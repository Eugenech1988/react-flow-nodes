import type {
  MockAppButtonProps,
  MockFloatingInputProps,
  MockLocalAlertProps,
} from '@/test-utils/mock-props';
import type { UseFormReturn } from 'react-hook-form';
import { usePasswordSection } from '../hooks/usePasswordSection';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PasswordSection } from './PasswordSection';

type PasswordValues = { currentPassword?: string; newPassword: string; confirmPassword: string };
type PasswordHook = ReturnType<typeof usePasswordSection>;

type PasswordFormOverrides = {
  register?: PasswordHook['form']['register'];
  handleSubmit?: PasswordHook['form']['handleSubmit'];
  formState?: Partial<PasswordHook['form']['formState']>;
};

vi.mock('../hooks/usePasswordSection', () => ({ usePasswordSection: vi.fn() }));

vi.mock('@/shared/ui', () => ({
  FloatingInput: (props: MockFloatingInputProps) => (
    <input data-testid={`input-${props.label}`} {...props} />
  ),
  LocalAlert: ({ alertMessage }: MockLocalAlertProps) => <div>{alertMessage}</div>,
  AppButton: ({ text, onClick, type, isDisabled }: MockAppButtonProps) => (
    <button onClick={onClick} type={type} disabled={isDisabled}>
      {text}
    </button>
  ),
}));

const mockedUsePasswordSection = vi.mocked(usePasswordSection);

const createHookMock = (
  overrides: Partial<Omit<PasswordHook, 'form'>> & { form?: PasswordFormOverrides } = {},
): PasswordHook =>
  ({
    form: {
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: { errors: {} },
      ...(overrides.form ?? {}),
    } as unknown as UseFormReturn<PasswordValues>,
    onSubmit: vi.fn(),
    hasPassword: true,
    isPending: false,
    isPristine: true,
    alert: null,
    ...overrides,
  }) as PasswordHook;

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
