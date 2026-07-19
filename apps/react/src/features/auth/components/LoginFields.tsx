import React from 'react';
import type { FieldErrors } from 'react-hook-form';
import { FloatingInput } from '@/shared/ui';

type LoginFormData = {
  email: string;
  password: string;
};

interface LoginFieldsProps {
  register: any;
  errors: FieldErrors<LoginFormData>;
}

export const LoginFields: React.FC<LoginFieldsProps> = ({ register, errors }) => {
  const inputClasses =
    'block w-full rounded-md border border-zinc-800 bg-slate-950/90 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-0 focus:shadow-[0_0_15px_rgba(255,255,255,0.03)] outline-none transition-all';

  return (
    <>
      <div className="space-y-1">
        <FloatingInput
          {...register('email')}
          type="email"
          label="Email Address"
          placeholder="Email Address"
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
          label="Password"
          placeholder="Password"
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