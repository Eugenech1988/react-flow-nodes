import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@pipeline/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialLoginButtons } from './SocialLoginButtons';
import { AuthModeToggle } from './AuthModeToggle';
import { RegisterFields } from './RegisterFields';
import { LoginFields } from './LoginFields';
import { TwoFactorForm } from './TwoFactorForm';
import { useQueryClient } from '@tanstack/react-query';
import { SubmitButton } from '@/shared/ui';
import { useAuthStore } from '../model/authStore';
import { loginSchema, registerSchema, type CombinedFormData } from '../model';
import { USER_QUERY_KEY } from '@/shared/lib';

export const AuthForm: React.FC = () => {
  const {
    mode,
    is2faRequired,
    qrCodeImage,
    secretKey,
    isLoading: is2faLoading,
    apiError,
    twoFactorError,
    login,
    register: registerAction,
    verifyTwoFactor,
    toggleMode,
    resetState
  } = useAuthStore();
  const queryClient = useQueryClient();

  const currentApiError = apiError || twoFactorError;
  const isAuthError = currentApiError === 'Unauthorized' || currentApiError?.toLowerCase().includes('invalid');

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting}
  } = useForm<CombinedFormData>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {email: '', password: '', confirmPassword: ''}
  });

  const onSubmit = async (data: CombinedFormData) => {
    if (mode === 'login') {
      await login(data.email, data.password, () => {
        queryClient.invalidateQueries({queryKey: USER_QUERY_KEY});
      });
    } else {
      await registerAction(data.email, data.password, () => {
        reset({email: '', password: '', confirmPassword: ''});
      });
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    queryClient.invalidateQueries({queryKey: USER_QUERY_KEY});
    if (provider === 'google' || provider === 'github') {
      const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.API_URL || 'http://localhost:3000';
      window.location.href = `${apiUrl}/auth/${provider}`;
    }
  };

  return (
    <div
      className="bg-[url('/nodes-bg-light.png')] dark:bg-[url('/nodes-bg-dark.png')] bg-cover bg-center flex min-h-screen items-center justify-center dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 antialiased text-zinc-300 relative overflow-hidden">

      {/* Декоративные размытые световые пятна сзади для создания «жидкого» перелива и объема под стеклом */}
      <div className="absolute w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none -top-10 -left-10 animate-pulse" />
      <div className="absolute w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10" />

      <Card
        className="w-full p-8 max-w-lg rounded-3xl liquid-glass space-y-2 relative z-10 overflow-hidden">

        <CardHeader className="text-center p-0 space-y-2">
          <CardTitle className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {is2faRequired ? 'Two-Factor Authentication' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-sm text-zinc-700 dark:text-zinc-400">
            {is2faRequired ? (
              'Enter the 6-digit code from your authenticator app'
            ) : (
              <AuthModeToggle mode={mode} onToggle={toggleMode}/>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5.5 p-0 mt-6">
          {is2faRequired ? (
            <TwoFactorForm
              qrCodeImage={qrCodeImage}
              secretKey={secretKey}
              error={currentApiError}
              isLoading={is2faLoading}
              onVerify={verifyTwoFactor}
              onBack={resetState}
              inputClasses=''
            />
          ) : (
            <>
              <SocialLoginButtons
                onGoogleClick={handleSocialLogin('google')}
                onGithubClick={handleSocialLogin('github')}
              />

              <div
                className="relative flex w-full items-center justify-center text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 before:h-[1px] before:flex-1 before:bg-slate-300 dark:before:bg-slate-700 after:h-[1px] after:flex-1 after:bg-slate-300 dark:after:bg-slate-700">
                <span className="px-3">or</span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {currentApiError && !isAuthError && (
                  <div
                    className="text-sm font-medium text-red-400 bg-red-950/30 border border-red-900/40 p-3 rounded-xl text-center antialiased">
                    {currentApiError}
                  </div>
                )}

                <div className="w-full space-y-5">
                  {mode === 'register' ? (
                    <RegisterFields
                      register={register}
                      errors={errors}
                    />
                  ) : (
                    <>
                      <LoginFields
                        register={register}
                        errors={errors}
                        error={isAuthError || !!errors.email || !!errors.password}
                      />

                      {isAuthError && (
                        <div className="text-xs text-red-500 antialiased space-y-2 pt-1 pl-1">
                          <p>Incorrect email address or password. Please try again.</p>
                          <div>
                            <a
                              href="/forgot-password"
                              className="text-teal-600 dark:text-teal-400 font-medium transition-colors duration-200 underline underline-offset-4"
                            >
                              Forgot your password?
                            </a>
                          </div>
                        </div>
                      )}
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