import type { FC } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FloatingInput } from '@/shared/ui';
import type { CombinedFormData } from './AuthForm';

interface RegisterFieldsProps {
  register: UseFormRegister<CombinedFormData>;
  errors: FieldErrors<CombinedFormData>;
  inputClasses: string;
}

export const RegisterFields: FC<RegisterFieldsProps> = ({ register, errors, inputClasses }) => {
  return (
    <>
      <div className="space-y-1">
        <FloatingInput
          {...register('email')}
          type="email"
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
          autoComplete="new-password"
          label="Password"
          className={inputClasses}
          error={!!errors.password}
        />
        {errors.password && (
          <p className="text-xs text-red-400 pt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <FloatingInput
          {...register('confirmPassword')}
          type="password"
          autoComplete="new-password"
          label="Confirm Password"
          error={!!errors.confirmPassword}
          className={inputClasses}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-400 pt-1">{errors.confirmPassword.message}</p>
        )}
      </div>
    </>
  );
};