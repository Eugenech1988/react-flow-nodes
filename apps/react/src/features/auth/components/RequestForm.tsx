import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button
} from '@pipeline/ui';

import { FloatingInput } from '@/shared/ui';
import { api } from '@/shared/api';
import { cn } from '@/shared/lib';

type RecoveryMode = 'request' | 'reset';

const requestSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const resetSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RequestFormData = z.infer<typeof requestSchema>;
type ResetFormData = z.infer<typeof resetSchema>;
type CombinedRecoveryData = RequestFormData & Partial<ResetFormData>;

interface RecoveryFormProps {
  initialMode?: RecoveryMode;
  token?: string;
}

export const RecoveryForm: React.FC<RecoveryFormProps> = ({ initialMode = 'request', token }) => {
  const [mode, setMode] = useState<RecoveryMode>(initialMode);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CombinedRecoveryData>({
    resolver: zodResolver(mode === 'request' ? requestSchema : resetSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const inputClasses = cn(
    'block w-full bg-transparent text-sm outline-none transition-all duration-200',
    '[transition:background-color_99999s_ease-in-out_0s] autofill:[transition:background-color_99999s_ease-in-out_0s]',
    'autofill:text-sm text-zinc-200 placeholder:text-zinc-600 !focus:text-slate-400 !focus-visible:text-slate-400 [-webkit-text-fill-color:zinc-200] autofill:![-webkit-text-fill-color:theme(colors.slate.400)]'
  );

  const onSubmit = async (data: CombinedRecoveryData) => {
    setApiError(null);
    setIsSuccess(false);
    try {
      if (mode === 'request') {
        await api.post('/auth/forgot-password', { email: data.email });
        setIsSuccess(true);
      } else {
        await api.post('/auth/reset-password', {
          token,
          password: data.password,
        });
        window.location.href = '/login?reset=success';
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        setApiError(String((error as { message: unknown }).message));
      } else {
        setApiError('Something went wrong');
      }
    }
  };

  return (
    <div className="bg-[url('/nodes-bg.png')] bg-cover bg-center flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 antialiased text-zinc-300">
      <Card className="w-full p-8 max-w-lg rounded-2xl border border-zinc-800/60 bg-slate-950/70 backdrop-blur-md shadow-2xl space-y-2 overflow-hidden">
        <CardHeader className="text-center p-0 space-y-2">
          <CardTitle className="text-3xl font-normal tracking-tight text-white">
            {mode === 'request' ? 'Reset Password' : 'New Password'}
          </CardTitle>
          <CardDescription className="text-sm text-zinc-400">
            {mode === 'request'
              ? 'Enter your email to receive a password reset link'
              : 'Please enter your new secure password'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5.5 p-0 pt-4">
          {isSuccess ? (
            <div className="text-sm font-medium text-teal-400 bg-teal-950/30 border border-teal-900/40 p-4 rounded-xl text-center antialiased space-y-3">
              <p>Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.</p>
              <div>
                <a href="/login" className="text-white hover:underline text-xs tracking-wide">Back to Sign In</a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {apiError && (
                <div className="text-sm font-medium text-red-400 bg-red-950/30 border border-red-900/40 p-3 rounded-xl text-center antialiased">
                  {apiError}
                </div>
              )}

              <div className="w-full space-y-5">
                {mode === 'request' ? (
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
                ) : (
                  <>
                    <div className="space-y-1">
                      <FloatingInput
                        {...register('password')}
                        type="password"
                        autoComplete="new-password"
                        label="New Password"
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
                        label="Confirm New Password"
                        className={inputClasses}
                        error={!!errors.confirmPassword}
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-400 pt-1">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2 space-y-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full h-12 rounded-xl bg-teal-600 text-base font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-500 hover:shadow-[0_0_25px_rgba(20,184,166,0.3)] active:scale-[0.98]"
                >
                  {isSubmitting ? 'Processing...' : mode === 'request' ? 'Send Reset Link' : 'Update Password'}
                </Button>

                <div className="text-center">
                  <a
                    href="/login"
                    className="text-xs text-zinc-500 hover:text-slate-400 transition-colors duration-200 underline underline-offset-4"
                  >
                    Back to Sign In
                  </a>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};