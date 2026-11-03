import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

// Thème clair / sombre, sur le modèle de Moovi : classe `light` ou `dark` sur <html>, choix gardé dans le
// localStorage, « system » suit le réglage de l'appareil (et ses changements).
// Pour éviter un flash au chargement, index.html applique la classe avant React (voir apps/web/index.html).

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'gai2e-theme';

type ThemeProviderState = {
  theme: Theme;
  // Thème réellement affiché (system résolu)
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | null>(null);

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

function readStoredTheme(storageKey: string, fallback: Theme): Theme {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : fallback;
  } catch {
    return fallback;
  }
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = THEME_STORAGE_KEY,
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme(storageKey, defaultTheme));
  const [systemDark, setSystemDark] = useState(() => darkQuery().matches);

  // Suit le réglage de l'appareil
  useEffect(() => {
    const query = darkQuery();
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const resolvedTheme: ResolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (next: Theme) => {
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        // Stockage indisponible (navigation privée) : le choix vaut pour la session
      }
      setThemeState(next);
    },
    [storageKey],
  );

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);
  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export function useTheme(): ThemeProviderState {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error('useTheme doit être utilisé sous <ThemeProvider>');
  return context;
}
