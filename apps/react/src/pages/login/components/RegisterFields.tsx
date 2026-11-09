import type { FC } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FloatingInput } from '@/shared/ui';
import type { RegisterFormInputData } from '@pipeline/contracts';

interface RegisterFieldsProps {
  register: UseFormRegister<RegisterFormInputData>;
  errors: FieldErrors<RegisterFormInputData>;
}

export const RegisterFields: FC<RegisterFieldsProps> = ({ register, errors }) => {
  const labelClasses = "text-zinc-400 peer-focus:text-teal-400 peer-not-placeholder-shown:text-teal-400 [&]:peer-[:autofill]:text-teal-400 [&]:peer-[:autofill]:top-0 [&]:peer-[:autofill]:-translate-y-1/2 [&]:peer-[:autofill]:text-[10px]";
  const fieldsetClasses = "border-white/10 peer-focus:border-teal-500 peer-not-placeholder-shown:border-teal-500 peer-[:autofill]:border-teal-500";
  const inputClasses = "text-white [&:-webkit-autofill]:shadow-[inset_0_0_0_100px_#050505]! [&:-webkit-autofill]:[-webkit-text-fill-color:white]!";

  return (
    <div className="space-y-4">
      <FloatingInput
        {...register('email')}
        type="email"
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
        autoComplete="new-password"
        label="Password"
        error={!!errors.password}
        errorMessage={errors.password?.message}
        labelClasses={labelClasses}
        fieldsetClasses={fieldsetClasses}
        className={inputClasses}
        rounded="md"
      />

      <FloatingInput
        {...register('confirmPassword')}
        type="password"
        autoComplete="new-password"
        label="Confirm Password"
        error={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
        labelClasses={labelClasses}
        fieldsetClasses={fieldsetClasses}
        className={inputClasses}
        rounded="md"
      />
    </div>
  );
};