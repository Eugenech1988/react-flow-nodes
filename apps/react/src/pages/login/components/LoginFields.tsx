import type { FC } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input, Label } from '@pipeline/ui'; // Используем базовые компоненты
import type { TLoginInputData } from '@pipeline/contracts';
import { cn } from '@/shared/lib';

interface LoginFieldsProps {
  register: UseFormRegister<TLoginInputData>;
  errors: FieldErrors<TLoginInputData>;
  error?: boolean;
}

export const LoginFields: FC<LoginFieldsProps> = ({ register, errors, error }) => {

  const inputClasses =
    'h-11 w-full rounded-md border bg-white/5 px-3.5 py-2 text-sm text-white transition-colors focus-visible:ring-1 focus-visible:outline-none ' +
    '[&:-webkit-autofill]:shadow-[inset_0_0_0_100px_#050505]! ' +
    '[&:-webkit-autofill]:[-webkit-text-fill-color:white]! ' +
    '[&:-webkit-autofill]:outline-none! ' +
    '[&:-webkit-autofill:hover]:shadow-[inset_0_0_0_100px_#050505]! ' +
    '[&:-webkit-autofill:focus]:shadow-[inset_0_0_0_100px_#050505]!';


  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label
          htmlFor="email"
          className="text-xs font-medium text-zinc-400"
        >
          Email Address
        </Label>
        <Input
          id="email"
          type="text"
          autoComplete="email"
          {...register('email')}
          className={cn(
            inputClasses,
            error || errors.email
              ? 'border-rose-500/50 focus-visible:border-rose-500 focus-visible:ring-rose-500/50'
              : 'border-white/10 focus-visible:border-teal-500 focus-visible:ring-teal-500/50'
          )}
        />
        {(error || errors.email) && (
          <p className="text-xs text-rose-400">
            {errors.email?.message || 'Invalid email'}
          </p>
        )}
      </div>

      {/* Поле Password */}
      <div className="space-y-1.5">
        <Label
          htmlFor="password"
          className="text-xs font-medium text-zinc-400"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          className={cn(
            inputClasses,
            error || errors.password
              ? 'border-rose-500/50 focus-visible:border-rose-500 focus-visible:ring-rose-500/50'
              : 'border-white/10 focus-visible:border-teal-500 focus-visible:ring-teal-500/50'
          )}
        />
        {(error || errors.password) && (
          <p className="text-xs text-rose-400">
            {errors.password?.message || 'Invalid password'}
          </p>
        )}
      </div>
    </div>
  );
};