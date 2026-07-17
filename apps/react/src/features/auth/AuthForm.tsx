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

const authSchema = z
  .object({
    mode: z.enum(['login', 'register']),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    nickName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'register') {
      if (!data.firstName || data.firstName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'First name is required',
          path: ['firstName'],
        });
      }
      if (!data.nickName || data.nickName.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Username must be at least 3 characters long',
          path: ['nickName'],
        });
      }
    }
  });

type FormData = z.infer<typeof authSchema>;

export const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('login');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      mode: 'login',
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
      mode: newMode,
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      nickName: ''
    });
  };

  const onSubmit = async (data: FormData) => {
    if (data.mode === 'login') {
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 font-sans antialiased text-slate-200">
      <Card className="w-full p-5 max-w-md border-zinc-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center space-y-1.5">
          <CardTitle className="text-xl font-medium tracking-tight text-slate-100 font-mono">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
            <button
              type="button"
              onClick={toggleMode}
              className="font-medium text-zinc-200 hover:text-white transition-colors focus:outline-none underline underline-offset-4"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="flex p-5.25 w-full justify-center items-center gap-2 rounded-md border-zinc-800 bg-slate-950 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-900 hover:text-white focus:outline-none"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800/60"/>
            </div>
            <span className="relative bg-slate-950 px-3 text-[10px] uppercase tracking-widest text-zinc-500 font-mono">or</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('mode')} />

            <div className="space-y-4">
              {mode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <FloatingInput
                        {...register('firstName')}
                        type="text"
                        label="First Name"
                        error={!!errors.firstName}
                      />
                      {errors.firstName && (
                        <p className="text-[11px] text-red-400 font-mono">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <FloatingInput
                        {...register('lastName')}
                        type="text"
                        label="Last Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <FloatingInput
                      {...register('nickName')}
                      type="text"
                      label="Username"
                      error={!!errors.nickName}
                    />
                    {errors.nickName && (
                      <p className="text-[11px] text-red-400 font-mono">{errors.nickName.message}</p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-1">
                <FloatingInput
                  {...register('email')}
                  type="email"
                  label="Email Address"
                  className="rounded-sm"
                  error={!!errors.email}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-400 font-mono">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <FloatingInput
                  {...register('password')}
                  type="password"
                  label="Password"
                  error={!!errors.password}
                  className="rounded-sm"
                />
                {errors.password && (
                  <p className="text-[11px] text-red-400 font-mono">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-zinc-100 text-slate-950 hover:bg-white disabled:opacity-50 font-mono"
              >
                {isSubmitting ? 'Processing...' : mode === 'login' ? 'EXECUTE SIGN_IN' : 'EXECUTE REGISTER'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};