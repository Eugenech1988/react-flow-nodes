import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getStoredTheme = (storageKey: string, defaultTheme: Theme): Theme => {
  try {
    const storedTheme = localStorage.getItem(storageKey);

    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
      return storedTheme;
    }
  } catch {
    // Ignore localStorage access errors.
  }

  return defaultTheme;
};

export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme(storageKey, defaultTheme));

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme);

      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch {
        // Ignore localStorage access errors.
      }
    },
    [storageKey],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;

      const nextTheme = event.newValue;

      if (nextTheme === 'light' || nextTheme === 'dark' || nextTheme === 'system') {
        setThemeState(nextTheme);
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [storageKey]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
