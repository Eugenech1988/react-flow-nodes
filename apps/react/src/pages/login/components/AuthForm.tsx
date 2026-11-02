import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  loginInputSchema,
  registerFormInputSchema,
  type TLoginInputData,
  type RegisterFormInputData,
} from '@pipeline/contracts';
import { AppButton } from '@/shared/ui';
import { SocialLoginButtons } from './SocialLoginButtons';
import { LoginFields } from './LoginFields';
import { RegisterFields } from './RegisterFields';

interface AuthFormProps {
  mode: 'login' | 'register';
  currentApiError?: string | null;
  onLogin: (data: TLoginInputData) => Promise<void>;
  onRegister: (data: RegisterFormInputData) => Promise<void>;
  onSocialLogin: (
    provider: 'google' | 'github',
  ) => (e: React.MouseEvent<HTMLButtonElement>) => void;
  onForgotPassword: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  currentApiError,
  onLogin,
  onRegister,
  onSocialLogin,
  onForgotPassword,
}) => {
  const isAuthError =
    currentApiError === 'Unauthorized' || currentApiError?.toLowerCase().includes('invalid');

  const isLogin = mode === 'login';

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<TLoginInputData>({
    resolver: zodResolver(loginInputSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
  } = useForm<RegisterFormInputData>({
    resolver: zodResolver(registerFormInputSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const isSubmitting = isLogin ? isLoginSubmitting : isRegisterSubmitting;

  return (
    <>
      <SocialLoginButtons
        onGoogleClick={onSocialLogin('google')}
        onGithubClick={onSocialLogin('github')}
      />

      <div className="relative flex w-full items-center justify-center text-xs tracking-widest text-slate-200 uppercase before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-300 dark:text-slate-400 dark:before:bg-slate-700 dark:after:bg-slate-700">
        <span className="px-3">or</span>
      </div>

      <form
        onSubmit={isLogin ? handleLoginSubmit(onLogin) : handleRegisterSubmit(onRegister)}
        className="space-y-6"
      >
        {currentApiError && !isAuthError && (
          <div className="rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-center text-sm font-medium text-red-400 antialiased">
            {currentApiError}
          </div>
        )}

        <div className="w-full space-y-5">
          {isLogin ? (
            <>
              <LoginFields
                register={loginRegister}
                errors={loginErrors}
                error={isAuthError || !!loginErrors.email || !!loginErrors.password}
              />

              <div className="flex items-center justify-between pt-1 pl-1">
                {isAuthError ? (
                  <p className="text-xs text-red-500 antialiased">
                    Incorrect email address or password.
                  </p>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="ml-auto cursor-pointer text-xs font-medium text-teal-600 transition-colors duration-200 hover:underline focus:outline-none dark:text-teal-400"
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            <RegisterFields register={registerRegister} errors={registerErrors} />
          )}
        </div>

        <AppButton
          type="submit"
          variant="primary"
          isPending={isSubmitting}
          text={isLogin ? 'Sign In' : 'Register'}
          pendingText="Processing..."
          icon={null}
          className="h-11.5 w-full rounded-xl text-base tracking-wide shadow-[0_0_25px_rgba(20,184,166,0.3)] transition-all"
        />
      </form>
    </>
  );
};
