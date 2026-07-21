import type { FC } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FloatingInput } from '@/shared/ui';
import type { CombinedFormData } from '../types';

interface RegisterFieldsProps {
  register: UseFormRegister<CombinedFormData>;
  errors: FieldErrors<CombinedFormData>;
  inputClasses: string;
}

export const RegisterFields: FC<RegisterFieldsProps> = ({ register, errors, inputClasses }) => {
  return (
    <>
      <FloatingInput
        {...register('email')}
        type="email"
        autoComplete="email"
        label="Email Address"
        className={inputClasses}
        error={!!errors.email}
        errorMessage={errors.email?.message}
      />

      <FloatingInput
        {...register('password')}
        type="password"
        autoComplete="new-password"
        label="Password"
        className={inputClasses}
        error={!!errors.password}
        errorMessage={errors.password?.message}
      />

      <FloatingInput
        {...register('confirmPassword')}
        type="password"
        autoComplete="new-password"
        label="Confirm Password"
        className={inputClasses}
        error={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
      />
    </>
  );
};