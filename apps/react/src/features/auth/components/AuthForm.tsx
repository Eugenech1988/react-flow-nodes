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
import { api } from '@/shared/api';
import { cn } from '@/shared/lib';

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

export const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('login');
  const [apiError, setApiError] = useState<string | null>(null);

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

  const inputClasses = cn(
    'block w-full bg-transparent text-sm outline-none transition-all duration-200',
    '[transition:background-color_99999s_ease-in-out_0s] autofill:[transition:background-color_99999s_ease-in-out_0s]',
    'autofill:text-sm text-zinc-200 placeholder:text-zinc-600 !focus:text-slate-400 !focus-visible:text-slate-400 [-webkit-text-fill-color:zinc-200] autofill:![-webkit-text-fill-color:theme(colors.slate.400)]'
  );

  const toggleMode = () => {
    setApiError(null);
    const newMode = mode === 'login' ? 'register' : 'login';
    setMode(newMode);
    reset({
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const onSubmit = async (data: CombinedFormData) => {
    setApiError(null);
    try {
      if (mode === 'login') {
        await api.post('/auth/login', {
          email: data.email,
          password: data.password
        });
        window.location.href = '/dashboard';
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

  const handleGoogleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const apiUrl = import.meta.env.API_URL || 'http://localhost:3000';
    window.location.href = `${apiUrl}/auth/google`;
  };

  const handleGithubLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const apiUrl = import.meta.env.API_URL || 'http://localhost:3000';
    window.location.href = `${apiUrl}/auth/github`;
  };

  const isAuthError = apiError === 'Unauthorized' || apiError?.toLowerCase().includes('invalid');

  return (
    <div className="bg-[url('/nodes-bg.png')] bg-cover bg-center flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 antialiased text-zinc-300">
      <Card className="w-full p-8 max-w-lg rounded-2xl border border-zinc-800/60 bg-slate-950/70 backdrop-blur-md shadow-2xl space-y-2 overflow-hidden">
        <CardHeader className="text-center p-0 space-y-2">
          <CardTitle className="text-3xl font-normal tracking-tight text-white">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-sm text-zinc-400">
            <AuthModeToggle mode={mode} onToggle={toggleMode} />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5.5 p-0">
          <SocialLoginButtons
            onGoogleClick={handleGoogleLogin}
            onGithubClick={handleGithubLogin}
          />

          <div className="relative flex w-full items-center justify-center text-xs uppercase tracking-widest text-slate-400 before:h-[1px] before:flex-1 before:bg-slate-400 after:h-[1px] after:flex-1 after:bg-slate-400">
            <span className="px-3">or</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {apiError && !isAuthError && (
              <div className="text-sm font-medium text-red-400 bg-red-950/30 border border-red-900/40 p-3 rounded-xl text-center antialiased">
                {apiError}
              </div>
            )}

            <div className="w-full space-y-5">
              {mode === 'register' ? (
                <RegisterFields
                  register={register}
                  errors={errors}
                  inputClasses={inputClasses}
                />
              ) : (
                <>
                  <LoginFields
                    register={register}
                    errors={errors}
                    inputClasses={inputClasses}
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
        </CardContent>
      </Card>
    </div>
  );
};