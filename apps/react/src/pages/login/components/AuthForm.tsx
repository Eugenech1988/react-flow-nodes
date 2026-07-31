import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  loginInputSchema,
  registerFormInputSchema,
  type LoginInputData,
  type RegisterFormInputData,
} from '@pipeline/contracts';
import { AppButton } from '@/shared/ui';
import { SocialLoginButtons } from './SocialLoginButtons';
import { LoginFields } from './LoginFields';
import { RegisterFields } from './RegisterFields';

interface AuthFormProps {
  mode: 'login' | 'register';
  currentApiError?: string | null;
  onLogin: (data: LoginInputData) => Promise<void>;
  onRegister: (data: RegisterFormInputData) => Promise<void>;
  onSocialLogin: (provider: 'google' | 'github') => (e: React.MouseEvent<HTMLButtonElement>) => void;
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
    currentApiError === 'Unauthorized' ||
    currentApiError?.toLowerCase().includes('invalid');

  const isLogin = mode === 'login';

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginInputData>({
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

      <div className="relative flex w-full items-center justify-center text-xs uppercase tracking-widest text-slate-200 dark:text-slate-400 before:h-px before:flex-1 before:bg-slate-200 dark:before:bg-slate-700 after:h-px after:flex-1 after:bg-slate-300 dark:after:bg-slate-700">
        <span className="px-3">or</span>
      </div>

      <form
        onSubmit={
          isLogin
            ? handleLoginSubmit(onLogin)
            : handleRegisterSubmit(onRegister)
        }
        className="space-y-6"
      >
        {currentApiError && !isAuthError && (
          <div className="text-sm font-medium text-red-400 bg-red-950/30 border border-red-900/40 p-3 rounded-xl text-center antialiased">
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
                  className="text-xs cursor-pointer text-teal-600 dark:text-teal-400 font-medium transition-colors duration-200 hover:underline focus:outline-none ml-auto"
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            <RegisterFields
              register={registerRegister}
              errors={registerErrors}
            />
          )}
        </div>

        <AppButton
          type="submit"
          variant="primary"
          isPending={isSubmitting}
          text={isLogin ? 'Sign In' : 'Register'}
          pendingText="Processing..."
          icon={null}
          className="w-full text-base transition-all h-11.5 rounded-xl tracking-wide shadow-[0_0_25px_rgba(20,184,166,0.3)]"
        />
      </form>
    </>
  );
};