import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileForm } from './ProfileForm';
import { useProfileForm } from '../hooks';
import { MockAppButtonProps, MockFloatingInputProps, MockLocalAlertProps } from '@/test-utils';
import { UseFormReturn } from 'react-hook-form';

type ProfileValues = {
  firstName?: string;
  lastName?: string | null;
  company?: string | null;
  location?: string | null;
  jobTitle?: string | null;
  avatarUrl?: string | null;
};

type ProfileHook = ReturnType<typeof useProfileForm>;

type FormFieldOverrides = {
  register?: ProfileHook['form']['register'];
  handleSubmit?: ProfileHook['form']['handleSubmit'];
  formState?: Partial<ProfileHook['form']['formState']>;
};

vi.mock('../hooks', () => ({
  useProfileForm: vi.fn(),
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => ({ user: { email: 'test@example.com' } }),
}));

vi.mock('@/shared/ui', () => ({
  FloatingInput: ({
    label,
    error,
    errorMessage,
    disabled,
    value,
    ...props
  }: MockFloatingInputProps) => (
    <div>
      <label>{label}</label>
      {error && <span data-testid={`error-${label}`}>{errorMessage}</span>}
      <input data-testid={`input-${label}`} disabled={disabled} value={value} {...props} />
    </div>
  ),
  LocalAlert: ({ alertMessage }: MockLocalAlertProps) => (
    <div data-testid="alert">{alertMessage}</div>
  ),
  AppButton: ({ text, type, onClick, isDisabled, isPending }: MockAppButtonProps) => (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled || isPending}
      data-testid={`btn-${text}`}
    >
      {text}
    </button>
  ),
}));

const mockedUseProfileForm = vi.mocked(useProfileForm);

const createHookMock = (
  overrides: Partial<Omit<ProfileHook, 'form'>> & { form?: FormFieldOverrides } = {},
): ProfileHook =>
  ({
    form: {
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: { errors: {} },
      ...(overrides.form ?? {}),
    } as unknown as UseFormReturn<ProfileValues>,
    onSubmit: vi.fn(),
    isPristine: true,
    isPending: false,
    alert: null,
    ...overrides,
  }) as ProfileHook;

describe('ProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    mockedUseProfileForm.mockReturnValue(createHookMock());
    render(<ProfileForm />);

    expect(screen.getByTestId('input-First Name')).toBeInTheDocument();
    expect(screen.getByTestId('input-Last Name')).toBeInTheDocument();
    expect(screen.getByTestId('input-Email Address')).toBeInTheDocument();
    expect(screen.getByTestId('input-Company')).toBeInTheDocument();
    expect(screen.getByTestId('input-Location')).toBeInTheDocument();
    expect(screen.getByTestId('input-Job Title')).toBeInTheDocument();
  });

  it('shows email as disabled and readonly', () => {
    mockedUseProfileForm.mockReturnValue(createHookMock());
    render(<ProfileForm />);

    expect(screen.getByTestId('input-Email Address')).toBeDisabled();
    expect(screen.getByTestId('input-Email Address')).toHaveValue('test@example.com');
  });

  it('shows error messages', () => {
    mockedUseProfileForm.mockReturnValue(
      createHookMock({
        form: {
          register: vi.fn(),
          formState: {
            errors: { firstName: { message: 'Too short', type: 'manual' } },
          },
        },
      }),
    );
    render(<ProfileForm />);

    expect(screen.getByTestId('error-First Name')).toHaveTextContent('Too short');
  });

  it('shows alert when provided', () => {
    mockedUseProfileForm.mockReturnValue(
      createHookMock({ alert: { type: 'success', message: 'Success!' } }),
    );
    render(<ProfileForm />);

    expect(screen.getByTestId('alert')).toHaveTextContent('Success!');
  });

  it('disables submit when pristine', () => {
    mockedUseProfileForm.mockReturnValue(createHookMock({ isPristine: true }));
    render(<ProfileForm />);

    expect(screen.getByTestId('btn-Save Changes')).toBeDisabled();
  });

  it('triggers onSubmit on form submit', () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    mockedUseProfileForm.mockReturnValue(createHookMock({ onSubmit }));
    const { container } = render(<ProfileForm />);

    fireEvent.submit(container.querySelector('form')!);
    expect(onSubmit).toHaveBeenCalled();
  });
});
