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
import { cn } from '@/shared/lib';
import { useAuthStore } from '../model/authStore';
import { loginSchema, registerSchema, type CombinedFormData } from '../model';
import { USER_QUERY_KEY } from '@/shared/lib';

const INPUT_CLASSES = cn(
  'block w-full bg-transparent text-sm outline-none transition-all duration-200',
  '[transition:background-color_99999s_ease-in-out_0s] autofill:[transition:background-color_99999s_ease-in-out_0s]',
  'autofill:text-sm text-zinc-200 placeholder:text-zinc-600 !focus:text-slate-400 !focus-visible:text-slate-400 [-webkit-text-fill-color:zinc-200] autofill:![-webkit-text-fill-color:theme(colors.slate.400)]'
);

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
    resetState,
  } = useAuthStore();
  const queryClient = useQueryClient();

  const currentApiError = apiError || twoFactorError;
  const isAuthError = currentApiError === 'Unauthorized' || currentApiError?.toLowerCase().includes('invalid');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CombinedFormData>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: CombinedFormData) => {
    if (mode === 'login') {
      await login(data.email, data.password, () => {
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      });
    } else {
      await registerAction(data.email, data.password, () => {
        reset({ email: '', password: '', confirmPassword: '' });
      });
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    if (provider === 'google' || provider === 'github') {
      const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.API_URL || 'http://localhost:3000';
      window.location.href = `${apiUrl}/auth/${provider}`;
    }
  };

  return (
    <div className="bg-[url('/nodes-bg-light.png')] dark:bg-[url('/nodes-bg-dark.png)] bg-cover bg-center flex min-h-screen items-center justify-center dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 antialiased text-zinc-300">
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
              onBack={resetState}
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
                  <SubmitButton
                    isPending={isSubmitting}
                    text={mode === 'login' ? 'Sign In' : 'Register'}
                    pendingText="Processing..."
                    icon={null}
                    className="w-full h-11 rounded-xl tracking-wide shadow-[0_0_25px_rgba(20,184,166,0.3)]"
                  />
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};