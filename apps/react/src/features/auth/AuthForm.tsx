import React, { useState } from 'react';

type FormMode = 'login' | 'register';

export const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickName: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      console.log('Login data:', { email: formData.email, password: formData.password });
    } else {
      console.log('Registration data:', formData);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),transparent)] px-4 py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="w-full max-w-md space-y-6 rounded-md border border-white/[0.08] bg-white/[0.02] backdrop-blur-md p-8 shadow-2xl shadow-black/50">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-medium tracking-tight text-white font-mono">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-xs text-neutral-400">
            {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full justify-center items-center gap-2 rounded-md border border-white/[0.08] bg-black px-4 py-2 text-xs font-medium text-neutral-200 transition-all duration-150 hover:bg-neutral-900 hover:border-white/20 active:scale-[0.98] focus:outline-none"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
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
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.06]" />
          </div>
          <span className="relative bg-[#050914] px-3 text-[10px] uppercase tracking-widest text-neutral-500 font-mono">or</span>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="block w-full rounded-md border border-white/[0.08] bg-black/40 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 transition-all duration-150 focus:border-indigo-500/80 focus:bg-black/80 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="block w-full rounded-md border border-white/[0.08] bg-black/40 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 transition-all duration-150 focus:border-indigo-500/80 focus:bg-black/80 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <input
                    name="nickName"
                    type="text"
                    value={formData.nickName}
                    onChange={handleChange}
                    placeholder="Username"
                    className="block w-full rounded-md border border-white/[0.08] bg-black/40 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 transition-all duration-150 focus:border-indigo-500/80 focus:bg-black/80 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="block w-full rounded-md border border-white/[0.08] bg-black/40 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 transition-all duration-150 focus:border-indigo-500/80 focus:bg-black/80 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>

            <div>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="block w-full rounded-md border border-white/[0.08] bg-black/40 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 transition-all duration-150 focus:border-indigo-500/80 focus:bg-black/80 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-indigo-500 shadow-lg shadow-indigo-600/10 active:scale-[0.98] focus:outline-none"
            >
              {mode === 'login' ? 'Confirm & Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};