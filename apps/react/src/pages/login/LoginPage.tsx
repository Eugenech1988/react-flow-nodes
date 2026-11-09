import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { RegisterFormInputData, TLoginInputData } from '@pipeline/contracts';
import { AuthModeToggle, TwoFactorForm, RecoveryForm, AuthForm } from './components';
import { useTRPC } from '@/shared/api';
import { useAuthStore } from './model/authStore';
import type { TRequestFormData, TResetFormData } from './model';
import Logo from '@/assets/logo.svg';

type TRole = 'USER' | 'CONTENT_MANAGER' | 'SUPER_ADMIN' | string;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const {
    mode, is2faRequired, isLoading, apiError, twoFactorError, recoveryError,
    isRecoverySuccess, isRegistrationSuccess, setRegistrationSuccess, login,
    register: registerAction, verifyTwoFactor, requestPasswordReset, resetPassword,
    toggleMode, resetState,
  } = useAuthStore();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) setIsRecoveryMode(true);
  }, [tokenFromUrl]);

  const currentApiError = apiError || twoFactorError;

  const redirectByRole = (role: TRole | undefined) => {
    resetState();
    if (role === 'CONTENT_MANAGER' || role === 'SUPER_ADMIN') {
      navigate('/admin/jobs', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleSuccessAuth = async () => {
    await queryClient.invalidateQueries(trpc.auth.me.queryFilter());
    const user = await queryClient.fetchQuery(trpc.auth.me.queryOptions());
    redirectByRole((user as { role?: TRole })?.role);
  };

  const handleLogin = async (data: TLoginInputData) => {
    await login(data.email, data.password, handleSuccessAuth);
  };

  const handleRegister = async (data: RegisterFormInputData) => {
    await registerAction(data.email, data.password, () => {});
  };

  const handleToggleMode = () => {
    setRegistrationSuccess(false);
    toggleMode();
  };

  const handleSocialLogin =
    (provider: 'google' | 'github') => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const apiUrl = import.meta.env.VITE_API_URL;
      window.location.href = `${apiUrl}/auth/${provider}`;
    };

  const handleRecoveryRequest = async (data: TRequestFormData) => {
    await requestPasswordReset(data.email);
  };

  const handleResetPassword = async (data: TResetFormData) => {
    if (!tokenFromUrl) {
      useAuthStore.getState().setRecoveryError('Password reset token is missing or invalid.');
      return;
    }
    await resetPassword(tokenFromUrl, data.password, () => {
      setSearchParams({}, { replace: true });
      setIsRecoveryMode(false);
      resetState();
    });
  };

  const handleBackFromRecovery = () => {
    if (tokenFromUrl) setSearchParams({}, { replace: true });
    setIsRecoveryMode(false);
    resetState();
  };

  return (
    <div className="flex min-h-screen w-full bg-[#050505] text-white antialiased">
      <div className="relative hidden w-[60%] flex-col justify-center overflow-hidden border-r border-white/10 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/40 via-[#050505] to-[#050505]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(45,212,191,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,212,191,0.05)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-teal-500/20 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-2xl px-16">
          <h1 className="text-4xl leading-tight font-black tracking-tight text-white uppercase drop-shadow-[0_0_15px_rgba(45,212,191,0.5)] md:text-5xl">
            Pipeline Studio / <br />
            <span className="text-teal-400">Core Admin Access</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400">
            Enter the control nexus of your data pipelines.
          </p>
        </div>
      </div>

      {/* 👇 Правая панель: justify-center и overflow-y-auto */}
      <div className="flex h-screen w-full flex-col items-center justify-center overflow-y-auto px-6 py-12 sm:px-12 lg:w-[40%] xl:px-24">
        {/* 👇 my-auto гарантирует центрирование, даже если контент длиннее экрана */}
        <div className="my-auto w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <img src={Logo} alt="Pipeline Studio" className="mb-4 h-10 w-auto text-teal-400" />
            <h2 className="bg-gradient-to-r from-teal-200 via-teal-400 to-teal-600 bg-clip-text text-2xl font-semibold tracking-tight text-transparent drop-shadow-[0_0_15px_rgba(45,212,191,0.2)]">
              {isRecoveryMode ? 'Reset Password' : is2faRequired ? 'Two-Factor Auth' : 'Welcome to the Pipeline Studio'}
            </h2>

            {!isRecoveryMode && !is2faRequired && (
              <div className="mt-2 text-sm text-zinc-400">
                <AuthModeToggle mode={mode} onToggle={handleToggleMode} />
              </div>
            )}
          </div>

          {isRegistrationSuccess && mode === 'login' && !isRecoveryMode && !is2faRequired && (
            <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-950/50 p-3 text-center text-sm text-emerald-400">
              Registered successfully! Please sign in.
            </div>
          )}

          <div className="mt-2">
            {isRecoveryMode ? (
              <RecoveryForm
                mode={tokenFromUrl ? 'reset' : 'request'}
                error={recoveryError}
                isSuccess={isRecoverySuccess}
                isLoading={isLoading}
                onRequestSubmit={handleRecoveryRequest}
                onResetSubmit={handleResetPassword}
                onBack={handleBackFromRecovery}
              />
            ) : is2faRequired ? (
              <TwoFactorForm
                error={twoFactorError ?? undefined}
                isLoading={isLoading}
                onVerify={(data) => verifyTwoFactor(data, handleSuccessAuth)}
                onBack={resetState}
              />
            ) : (
              <AuthForm
                mode={mode}
                currentApiError={currentApiError}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onSocialLogin={handleSocialLogin}
                onForgotPassword={() => setIsRecoveryMode(true)}
              />
            )}
          </div>

          <div className="mt-12 flex items-center justify-center gap-4 text-xs text-zinc-500">
            <a href="#" className="transition-colors hover:text-white">
              System Terms
            </a>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <a href="#" className="transition-colors hover:text-white">
              Admin Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};