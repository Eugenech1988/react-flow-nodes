import type { FC } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FloatingInput } from '@/shared/ui';
import type { CombinedFormData } from './AuthForm';

interface LoginFieldsProps {
  register: UseFormRegister<CombinedFormData>;
  errors: FieldErrors<CombinedFormData>;
  inputClasses: string;
  error?: boolean;
}

export const LoginFields: FC<LoginFieldsProps> = ({ register, errors, error, inputClasses }) => {
  return (
    <>
      <div className="space-y-1">
        <FloatingInput
          {...register('email')}
          type="text"
          autoComplete="email"
          label="Email Address"
          className={inputClasses}
          error={!!errors.email}
        />
        {errors.email && (
          <p className="text-xs text-red-400 pt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <FloatingInput
          {...register('password')}
          type="password"
          autoComplete="current-password"
          label="Password"
          error={!!errors.password}
          className={inputClasses}
        />
        {errors.password && (
          <p className="text-xs text-red-400 pt-1">{errors.password.message}</p>
        )}
      </div>
    </>
  );
};