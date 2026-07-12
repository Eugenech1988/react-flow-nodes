import { useTheme } from '@/app/providers';

export const useThemeSync = (): string => {
  const { theme } = useTheme();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return isDark ? '#374151' : '#cbd5e1';
};