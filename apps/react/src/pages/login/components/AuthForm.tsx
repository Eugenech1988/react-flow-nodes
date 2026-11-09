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
  onSocialLogin: (provider: 'google' | 'github') => (e: React.MouseEvent<HTMLButtonElement>) => void;
  onForgotPassword: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
                                                    mode, currentApiError, onLogin, onRegister, onSocialLogin, onForgotPassword,
                                                  }) => {
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
    <div className="space-y-6">
      <SocialLoginButtons
        onGoogleClick={onSocialLogin('google')}
        onGithubClick={onSocialLogin('github')}
      />

      <div className="relative flex w-full items-center justify-center text-xs tracking-widest text-zinc-500 uppercase before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">
        <span className="px-3">or continue with email</span>
      </div>

      <form
        onSubmit={isLogin ? handleLoginSubmit(onLogin) : handleRegisterSubmit(onRegister)}
        className="space-y-6"
      >
        <div className="space-y-5">
          {isLogin ? (
            <>
              <LoginFields
                register={loginRegister}
                errors={loginErrors}
              />

              <div className="flex items-center justify-between pt-1">
                {currentApiError ? (
                  <span className="animate-in fade-in text-xs font-medium text-red-500">
                    {currentApiError}
                  </span>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="cursor-pointer text-xs font-medium text-zinc-400 transition-colors duration-200 hover:text-white focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          ) : (
            <>
              <RegisterFields register={registerRegister} errors={registerErrors} />
              {currentApiError && (
                <span className="block animate-in fade-in text-xs font-medium text-red-500">
                  {currentApiError}
                </span>
              )}
            </>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <AppButton
            type="submit"
            variant="primary"
            isPending={isSubmitting}
            text={isLogin ? 'Authenticate Access' : 'Create Account'}
            pendingText="Processing..."
            icon={null}
            className="h-11 w-full rounded-md bg-teal-600 text-sm font-semibold tracking-wide text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all hover:bg-teal-500"
          />
          {isLogin && !currentApiError && (
            <p className="text-center text-xs text-zinc-500">
              Use your authorized admin credentials.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};