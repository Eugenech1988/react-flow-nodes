import React, { useState } from 'react';
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

type FormMode = 'login' | 'register';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password is required')
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  nickName: z.string().min(3, 'Username must be at least 3 characters long')
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type CombinedFormData = LoginFormData & Partial<RegisterFormData>;

export const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('login');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CombinedFormData>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
    values: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      nickName: ''
    }
  });

  const toggleMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    setMode(newMode);
    reset({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      nickName: ''
    });
  };

  const onSubmit = async (data: CombinedFormData) => {
    if (mode === 'login') {
      console.log('Login data:', { email: data.email, password: data.password });
    } else {
      console.log('Registration data:', data);
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

  const inputClasses = 'block w-full rounded-md border border-zinc-700 bg-slate-950/80 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-0 focus:shadow-[0_0_15px_rgba(255,255,255,0.03)] outline-none transition-all';
  const labelClasses = '';

  return (
    <div className="bg-[url('/nodes-bg.png')] bg-cover bg-center flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 antialiased text-zinc-300">
      <Card className="w-full p-8 max-w-lg rounded-2xl border border-zinc-600/80 bg-slate-950/60 backdrop-blur-sm shadow-2xl space-y-2">
        <CardHeader className="text-center p-0 space-y-2">
          <CardTitle className="text-3xl font-normal tracking-tight text-white">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-sm text-zinc-400">
            {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
            <Button
              type="button"
              onClick={toggleMode}
              className="cursor-pointer bg-transparent font-medium text-zinc-200 hover:text-white transition-colors focus:outline-none hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </Button>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 p-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="cursor-pointer h-12 w-full gap-3 border border-zinc-600/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-md text-base font-medium text-zinc-100 transition-all duration-300 hover:border-zinc-300 hover:from-slate-700/70 hover:to-slate-800/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] active:scale-[0.98]"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleGithubLogin}
            className="cursor-pointer h-12 w-full gap-3 border border-zinc-600/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-md text-base font-medium text-zinc-100 transition-all duration-300 hover:border-zinc-300 hover:from-slate-700/70 hover:to-slate-800/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] active:scale-[0.98]"
          >
            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Continue with GitHub</span>
          </Button>

          <div className="relative flex w-full items-center justify-center text-xs uppercase tracking-widest text-zinc-500 before:h-[1px] before:flex-1 before:bg-slate-600 after:h-[1px] after:flex-1 after:bg-slate-600">
            <span className="px-3">or</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              {mode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <FloatingInput
                        {...register('firstName')}
                        type="text"
                        label="First Name"
                        className={inputClasses}
                        labelClasses={labelClasses}
                        error={!!errors.firstName}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-400 pt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <FloatingInput
                        {...register('lastName')}
                        type="text"
                        label="Last Name"
                        className={inputClasses}
                        labelClasses={labelClasses}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <FloatingInput
                      {...register('nickName')}
                      type="text"
                      label="Username"
                      className={inputClasses}
                      labelClasses={labelClasses}
                      error={!!errors.nickName}
                    />
                    {errors.nickName && (
                      <p className="text-xs text-red-400 pt-1">
                        {errors.nickName.message}
                      </p>
                    )}
                  </div>
                </>
              )}

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
                  <p className="text-xs text-red-400 pt-1">
                    {errors.email.message}
                  </p>
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
                  <p className="text-xs text-red-400 pt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full h-12 border border-emerald-400/50 bg-gradient-to-r from-teal-600 to-emerald-600 text-base font-bold tracking-widest text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 hover:from-teal-500 hover:to-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-[0.97]"
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