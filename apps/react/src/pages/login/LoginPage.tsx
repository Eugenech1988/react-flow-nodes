import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@pipeline/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  SocialLoginButtons,
  AuthModeToggle,
  RegisterFields,
  LoginFields,
  TwoFactorForm,
  RecoveryForm
} from './components';
import { SubmitButton } from '@/shared/ui';
import { useTRPC, api } from '@/shared/api';
import { useAuthStore } from './model/authStore';
import { loginInputSchema, registerInputSchema } from '@pipeline/contracts';
import type { RequestFormData, ResetFormData } from '@/pages/login/components';

export const registerFormInputSchema = registerInputSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginInputData = z.infer<typeof loginInputSchema>;
type RegisterFormInputData = z.infer<typeof registerFormInputSchema>;
type LoginCombinedFormData = LoginInputData & Partial<RegisterFormInputData>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const {
    mode,
    is2faRequired,
    isLoading: is2faLoading,
    apiError,
    twoFactorError,
    login,
    register: registerAction,
    verifyTwoFactor,
    toggleMode,
    resetState
  } = useAuthStore();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Состояния для работы режима восстановления
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [isRecoverySuccess, setIsRecoverySuccess] = useState(false);
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);

  // Если в URL передан token (например, клик из письма), автоматически переключаем в сброс пароля
  useEffect(() => {
    if (tokenFromUrl) {
      setIsRecoveryMode(true);
    }
  }, [tokenFromUrl]);

  const currentApiError = apiError || twoFactorError;
  const isAuthError = currentApiError === 'Unauthorized' || currentApiError?.toLowerCase().includes('invalid');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<LoginCombinedFormData>({
    resolver: zodResolver(mode === 'login' ? loginInputSchema : registerFormInputSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '', confirmPassword: '' }
  });

  const handleSuccessAuth = async () => {
    await queryClient.invalidateQueries(trpc.auth.me.queryFilter());
    resetState();
    navigate('/', { replace: true });
  };

  const onSubmit = async (data: LoginCombinedFormData) => {
    if (mode === 'login') {
      await login(data.email, data.password, handleSuccessAuth);
    } else {
      await registerAction(data.email, data.password, () => {
        reset({ email: '', password: '', confirmPassword: '' });
      });
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (provider === 'google' || provider === 'github') {
      const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.API_URL || 'http://localhost:3000';
      window.location.href = `${apiUrl}/auth/${provider}`;
    }
  };

  const handleRecoveryRequest = async (data: RequestFormData) => {
    setRecoveryError(null);
    setIsRecoverySuccess(false);
    setIsRecoveryLoading(true);

    try {
      await api.post('/auth/recovery', { email: data.email });
      setIsRecoverySuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setRecoveryError(err.message);
      } else {
        setRecoveryError('Failed to send recovery email. Please try again.');
      }
    } finally {
      setIsRecoveryLoading(false);
    }
  };

  // Обработка установки нового пароля
  const handleResetPassword = async (data: ResetFormData) => {
    if (!tokenFromUrl) {
      setRecoveryError('Reset token is missing or invalid.');
      return;
    }

    setRecoveryError(null);
    setIsRecoveryLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token: tokenFromUrl,
        password: data.password,
      });

      setSearchParams({}, { replace: true });
      setIsRecoveryMode(false);
      resetState();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setRecoveryError(err.message);
      } else {
        setRecoveryError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsRecoveryLoading(false);
    }
  };

  const handleBackFromRecovery = () => {
    if (tokenFromUrl) {
      setSearchParams({}, { replace: true });
    }
    setIsRecoveryMode(false);
    setRecoveryError(null);
    setIsRecoverySuccess(false);
  };

  const getTitle = () => {
    if (isRecoveryMode) {
      return tokenFromUrl ? 'Set New Password' : 'Reset Password';
    }
    if (is2faRequired) {
      return 'Two-Factor Authentication';
    }
    return mode === 'login' ? 'Sign In' : 'Create Account';
  };

  return (
    <div className="bg-[url('/nodes-bg-light.png')] dark:bg-[url('/nodes-bg-dark.png')] bg-cover bg-center flex min-h-screen items-center justify-center dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 antialiased text-zinc-300 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none -top-10 -left-10 animate-pulse" />
      <div className="absolute w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10" />

      <Card className="w-full p-8 max-w-lg rounded-3xl liquid-glass space-y-2 relative z-10 overflow-hidden">
        <CardHeader className="text-center p-0 space-y-2">
          <CardTitle className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {getTitle()}
          </CardTitle>
          <CardDescription className="text-sm text-zinc-700 dark:text-zinc-400">
            {isRecoveryMode ? (
              tokenFromUrl
                ? 'Enter your new password below'
                : 'Enter your email address to receive a recovery link'
            ) : is2faRequired ? (
              'Enter the 6-digit code from your authenticator app'
            ) : (
              <AuthModeToggle mode={mode} onToggle={toggleMode} />
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5.5 p-0 pt-2">
          {isRecoveryMode ? (
            <RecoveryForm
              mode={tokenFromUrl ? 'reset' : 'request'}
              error={recoveryError}
              isSuccess={isRecoverySuccess}
              isLoading={isRecoveryLoading}
              onRequestSubmit={handleRecoveryRequest}
              onResetSubmit={handleResetPassword}
              onBack={handleBackFromRecovery}
            />
          ) : is2faRequired ? (
            <TwoFactorForm
              error={twoFactorError ?? undefined}
              isLoading={is2faLoading}
              onVerify={(data) => verifyTwoFactor(data, handleSuccessAuth)}
              onBack={resetState}
              inputClasses=""
            />
          ) : (
            <>
              <SocialLoginButtons
                onGoogleClick={handleSocialLogin('google')}
                onGithubClick={handleSocialLogin('github')}
              />

              <div className="relative flex w-full items-center justify-center text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 before:h-[1px] before:flex-1 before:bg-slate-300 dark:before:bg-slate-700 after:h-[1px] after:flex-1 after:bg-slate-300 dark:after:bg-slate-700">
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
                    <RegisterFields register={register} errors={errors} />
                  ) : (
                    <>
                      <LoginFields
                        register={register}
                        errors={errors}
                        error={isAuthError || !!errors.email || !!errors.password}
                      />

                      <div className="flex items-center justify-between pt-1 pl-1">
                        {isAuthError ? (
                          <p className="text-xs text-red-500 antialiased">
                            Incorrect email address or password.
                          </p>
                        ) : <span />}

                        <button
                          type="button"
                          onClick={() => setIsRecoveryMode(true)}
                          className="text-xs text-teal-600 dark:text-teal-400 font-medium transition-colors duration-200 hover:underline focus:outline-none ml-auto"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <SubmitButton
                  isPending={isSubmitting}
                  text={mode === 'login' ? 'Sign In' : 'Register'}
                  pendingText="Processing..."
                  icon={null}
                  className="w-full text-base h-11 rounded-xl tracking-wide shadow-[0_0_25px_rgba(20,184,166,0.3)]"
                />
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;