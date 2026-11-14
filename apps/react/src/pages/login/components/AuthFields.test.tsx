import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginFields } from './LoginFields';
import { RegisterFields } from './RegisterFields';

vi.mock('@/shared/ui', () => ({
  FloatingInput: ({ label, error, errorMessage, ...props }: unknown) => (
    <div>
      <label>{label}</label>
      {error && <span data-testid={`error-${label}`}>{errorMessage}</span>}
      <input data-testid={`input-${label}`} {...props} />
    </div>
  ),
}));

describe('Auth Fields', () => {
  describe('LoginFields', () => {
    it('renders email and password inputs without errors', () => {
      render(<LoginFields register={vi.fn() as unknown as never} errors={{}} />);
      expect(screen.getByTestId('input-Email Address')).toBeInTheDocument();
      expect(screen.getByTestId('input-Password')).toBeInTheDocument();
    });

    it('renders error messages', () => {
      render(
        <LoginFields
          register={vi.fn() as unknown as never}
          errors={{ email: { message: 'Invalid email' }, password: { message: 'Required' } } as unknown as never}
        />
      );
      expect(screen.getByTestId('error-Email Address')).toHaveTextContent('Invalid email');
      expect(screen.getByTestId('error-Password')).toHaveTextContent('Required');
    });
  });

  describe('RegisterFields', () => {
    it('renders all 3 inputs without errors', () => {
      render(<RegisterFields register={vi.fn() as unknown as never} errors={{}} />);
      expect(screen.getByTestId('input-Email Address')).toBeInTheDocument();
      expect(screen.getByTestId('input-Password')).toBeInTheDocument();
      expect(screen.getByTestId('input-Confirm Password')).toBeInTheDocument();
    });

    it('renders error messages', () => {
      render(
        <RegisterFields
          register={vi.fn() as unknown as never}
          errors={{ confirmPassword: { message: 'Mismatch' } } as unknown as never}
        />
      );
      expect(screen.getByTestId('error-Confirm Password')).toHaveTextContent('Mismatch');
    });
  });
});
