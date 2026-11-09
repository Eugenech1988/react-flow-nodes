import type { FC } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { RegisterFormInputData } from '@pipeline/contracts';
import { AuthField } from './AuthField';

interface RegisterFieldsProps {
  register: UseFormRegister<RegisterFormInputData>;
  errors: FieldErrors<RegisterFormInputData>;
}

export const RegisterFields: FC<RegisterFieldsProps> = ({ register, errors }) => {
  return (
    <div className="space-y-4">
      <AuthField
        id="email"
        type="email"
        autoComplete="email"
        label="Email Address"
        error={errors.email?.message}
        {...register('email')}
      />
      <AuthField
        id="password"
        type="password"
        autoComplete="new-password"
        label="Password"
        error={errors.password?.message}
        {...register('password')}
      />
      <AuthField
        id="confirmPassword"
        type="password"
        autoComplete="new-password"
        label="Confirm Password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
    </div>
  );
};