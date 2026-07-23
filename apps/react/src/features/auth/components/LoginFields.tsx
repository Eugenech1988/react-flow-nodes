import type { FC } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FloatingInput } from '@/shared/ui';
import type { CombinedFormData } from '../model/types';

interface LoginFieldsProps {
  register: UseFormRegister<CombinedFormData>;
  errors: FieldErrors<CombinedFormData>;
  inputClasses?: string;
  error?: boolean;
}

export const LoginFields: FC<LoginFieldsProps> = ({ register, errors, error }) => {
  return (
    <>
      <FloatingInput
        {...register('email')}
        type="text"
        autoComplete="email"
        label="Email Address"
        error={error || !!errors.email}
        errorMessage={errors.email?.message}
      />

      <FloatingInput
        {...register('password')}
        type="password"
        autoComplete="current-password"
        label="Password"
        error={error || !!errors.password}
        errorMessage={errors.password?.message}
      />
    </>
  );
};