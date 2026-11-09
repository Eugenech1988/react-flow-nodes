import type { FC } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FloatingInput } from '@/shared/ui';
import type { TLoginInputData } from '@pipeline/contracts';

interface LoginFieldsProps {
  register: UseFormRegister<TLoginInputData>;
  errors: FieldErrors<TLoginInputData>;
}

export const LoginFields: FC<LoginFieldsProps> = ({ register, errors }) => {
  // Общие классы для всех полей, чтобы не дублировать
  const labelClasses =
    'text-zinc-400 peer-focus:text-teal-400 peer-not-placeholder-shown:text-teal-400 [&]:peer-[:autofill]:text-teal-400';
  const fieldsetClasses =
    'border-white/10 peer-focus:border-teal-500 peer-not-placeholder-shown:border-teal-500 peer-[:autofill]:border-teal-500';
  const inputClasses =
    'text-white [&:-webkit-autofill]:shadow-[inset_0_0_0_100px_#050505]! [&:-webkit-autofill]:[-webkit-text-fill-color:white]!';

  return (
    <div className="space-y-4">
      <FloatingInput
        {...register('email')}
        type="text"
        autoComplete="email"
        label="Email Address"
        error={!!errors.email}
        errorMessage={errors.email?.message}
        labelClasses={labelClasses}
        fieldsetClasses={fieldsetClasses}
        className={inputClasses}
        rounded="md"
      />

      <FloatingInput
        {...register('password')}
        type="password"
        autoComplete="current-password"
        label="Password"
        error={!!errors.password}
        errorMessage={errors.password?.message}
        labelClasses={labelClasses}
        fieldsetClasses={fieldsetClasses}
        className={inputClasses}
        rounded="md"
      />
    </div>
  );
};
