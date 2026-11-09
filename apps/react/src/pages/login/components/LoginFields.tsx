import type { FC } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { TLoginInputData } from '@pipeline/contracts';
import { AuthField } from './AuthField';

interface LoginFieldsProps {
  register: UseFormRegister<TLoginInputData>;
  errors: FieldErrors<TLoginInputData>;
}

export const LoginFields: FC<LoginFieldsProps> = ({ register, errors }) => {
  return (
    <div className="space-y-4">
      <AuthField
        id="email"
        type="text"
        autoComplete="email"
        label="Email Address"
        error={errors.email?.message}
        {...register('email')}
      />
      <AuthField
        id="password"
        type="password"
        autoComplete="current-password"
        label="Password"
        error={errors.password?.message}
        {...register('password')}
      />
    </div>
  );
};