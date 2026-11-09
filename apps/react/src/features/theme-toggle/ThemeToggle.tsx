import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/providers';
import { Button } from '@pipeline/ui';

export const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="border-border bg-card text-foreground/80 hover:text-foreground hover:bg-foreground/5 hover:border-border/80 relative flex cursor-pointer items-center justify-center rounded-full transition-all duration-200 active:scale-95"
      title="Toggle theme"
    >
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
          isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
