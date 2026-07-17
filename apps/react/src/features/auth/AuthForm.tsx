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
      console.log('Логин данные:', { email: formData.email, password: formData.password });
      // Твой fetch/axios запрос на /auth/login
    } else {
      console.log('Регистрация данные:', formData);
      // Твой fetch/axios запрос на /auth/register
    }
  };

  const handleGoogleLogin = () => {
    // Редирект на эндпоинт NestJS, который инициирует Google OAuth паспорт-стратегию
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">

        {/* Шапка формы */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {mode === 'login' ? 'Войти в аккаунт' : 'Регистрация'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-medium text-indigo-600 hover:text-indigo-500 underline focus:outline-none"
            >
              {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>

        {/* Кнопка Google OAuth */}
        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full justify-center items-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
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
            <span>Войти через Google</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <span className="relative bg-white px-3 text-sm text-gray-500">или</span>
        </div>

        {/* Форма */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3 rounded-md">

            {/* Поля, которые видны ТОЛЬКО при регистрации */}
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="sr-only">Имя</label>
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Имя"
                      className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                    />
                  </div>
                  <div>
                    <label className="sr-only">Фамилия</label>
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Фамилия (опц.)"
                      className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="sr-only">Никнейм</label>
                  <input
                    name="nickName"
                    type="text"
                    value={formData.nickName}
                    onChange={handleChange}
                    placeholder="Никнейм"
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  />
                </div>
              </>
            )}

            {/* Поля, общие для обоих режимов */}
            <div>
              <label className="sr-only">Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email адрес"
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>

            <div>
              <label className="sr-only">Пароль</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Пароль"
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>

          {/* Кнопка отправки формы */}
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};