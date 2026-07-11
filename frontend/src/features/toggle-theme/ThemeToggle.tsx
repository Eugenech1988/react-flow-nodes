import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/providers';
import { Button } from '@/shared/ui';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="relative flex items-center justify-center rounded-full border-border bg-card hover:bg-muted cursor-pointer transition-colors"
      title="Toggle theme"
    >
      <Sun
        className={`w-[1.2rem] h-[1.2rem] transition-all duration-300 ${
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      />

      <Moon
        className={`absolute w-[1.2rem] h-[1.2rem] transition-all duration-300 ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};