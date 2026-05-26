import { useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark';
  storageKey?: string;
}

export function ThemeProvider({ children, defaultTheme = 'light', storageKey = 'crm-theme' }: ThemeProviderProps) {
  useEffect(() => {
    const root = window.document.documentElement;

    // Check localStorage or default
    const stored = localStorage.getItem(storageKey);
    const themeToApply = stored === 'dark' || stored === 'light' ? stored : defaultTheme;

    // Apply theme class
    if (themeToApply === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem(storageKey, themeToApply);
  }, [defaultTheme, storageKey]);

  return <>{children}</>;
}