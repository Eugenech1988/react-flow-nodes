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

import { SocialLoginButtons } from './SocialLoginButtons';
import { AuthModeToggle } from './AuthModeToggle';
import { RegisterFields } from './RegisterFields';
import { LoginFields } from './LoginFields';
import { TwoFactorForm } from './TwoFactorForm';
import { api } from '@/shared/api';
import { cn } from '@/shared/lib';
import { useTwoFactorAuth } from '../hooks/useTwoFactorAuth';

type FormMode = 'login' | 'register';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password is required'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
export type CombinedFormData = LoginFormData & Partial<RegisterFormData>;

const INPUT_CLASSES = cn(
  'block w-full bg-transparent text-sm outline-none transition-all duration-200',
  '[transition:background-color_99999s_ease-in-out_0s] autofill:[transition:background-color_99999s_ease-in-out_0s]',
  'autofill:text-sm text-zinc-200 placeholder:text-zinc-600 !focus:text-slate-400 !focus-visible:text-slate-400 [-webkit-text-fill-color:zinc-200] autofill:![-webkit-text-fill-color:theme(colors.slate.400)]'
);

export const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('login');
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    is2faRequired,
    qrCodeImage,
    secretKey,
    error: twoFactorError,
    isLoading: is2faLoading,
    handleLoginResponse,
    verifyTwoFactor,
    resetState: reset2faState,
  } = useTwoFactorAuth(() => {
    window.location.href = '/';
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CombinedFormData>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const toggleMode = () => {
    setApiError(null);
    reset2faState();
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    reset({ email: '', password: '', confirmPassword: '' });
  };

  const onSubmit = async (data: CombinedFormData) => {
    setApiError(null);
    try {
      if (mode === 'login') {
        const response = await api.post('/auth/login', {
          email: data.email,
          password: data.password
        });

        const requires2fa = handleLoginResponse(response);
        if (!requires2fa) {
          window.location.href = '/';
        }
      } else {
        await api.post('/auth/register', {
          email: data.email,
          password: data.password,
        });
        toggleMode();
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

  const handleSocialLogin = (provider: 'google' | 'github') => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.API_URL || 'http://localhost:3000';
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  const currentApiError = apiError || twoFactorError;
  const isAuthError = currentApiError === 'Unauthorized' || currentApiError?.toLowerCase().includes('invalid');

  return (
    <div className="bg-[url('/nodes-bg.png')] bg-cover bg-center flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 antialiased text-zinc-300">
      <Card className="w-full p-8 max-w-lg rounded-2xl border border-zinc-800/60 bg-slate-950/70 backdrop-blur-md shadow-2xl space-y-2 overflow-hidden">
        <CardHeader className="text-center p-0 space-y-2">
          <CardTitle className="text-3xl font-normal tracking-tight text-white">
            {is2faRequired ? 'Two-Factor Authentication' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-sm text-zinc-400">
            {is2faRequired ? (
              'Enter the 6-digit code from your authenticator app'
            ) : (
              <AuthModeToggle mode={mode} onToggle={toggleMode} />
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5.5 p-0">
          {is2faRequired ? (
            <TwoFactorForm
              qrCodeImage={qrCodeImage}
              secretKey={secretKey}
              error={currentApiError}
              isLoading={is2faLoading}
              onVerify={verifyTwoFactor}
              onBack={reset2faState}
              inputClasses={INPUT_CLASSES}
            />
          ) : (
            <>
              <SocialLoginButtons
                onGoogleClick={handleSocialLogin('google')}
                onGithubClick={handleSocialLogin('github')}
              />

              <div className="relative flex w-full items-center justify-center text-xs uppercase tracking-widest text-slate-400 before:h-[1px] before:flex-1 before:bg-slate-400 after:h-[1px] after:flex-1 after:bg-slate-400">
                <span className="px-3">or</span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {currentApiError && !isAuthError && (
                  <div className="text-sm font-medium text-red-400 bg-red-950/30 border border-red-900/40 p-3 rounded-xl text-center antialiased">
                    {currentApiError}
                  </div>
                )}

                <div className="w-full space-y-5">
                  {mode === 'register' ? (
                    <RegisterFields
                      register={register}
                      errors={errors}
                      inputClasses={INPUT_CLASSES}
                    />
                  ) : (
                    <>
                      <LoginFields
                        register={register}
                        errors={errors}
                        inputClasses={INPUT_CLASSES}
                        error={isAuthError || !!errors.email || !!errors.password}
                      />

                      {isAuthError && (
                        <div className="text-xs text-red-500 antialiased space-y-2 pt-1 pl-1">
                          <p>Incorrect email address or password. Please try again.</p>
                          <div>
                            <a
                              href="/forgot-password"
                              className="text-teal-500 hover:text-teal-400 font-medium transition-colors duration-200 underline underline-offset-4"
                            >
                              Forgot your password?
                            </a>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer w-full h-12 rounded-xl bg-teal-600 text-base font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-500 hover:shadow-[0_0_25px_rgba(20,184,166,0.3)] active:scale-[0.98]"
                  >
                    {isSubmitting ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Register'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};