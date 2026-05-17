"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEFAULT_THEME,
  THEME_COOKIE_KEY,
  THEME_COOKIE_MAX_AGE,
  THEME_STORAGE_KEY,
  ThemeId,
  isThemeId,
} from "@/lib/portfolio-data";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  initialTheme: ThemeId;
  children: ReactNode;
}

export function ThemeProvider({ initialTheme, children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeId>(initialTheme);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemeId(stored) && stored !== theme) {
        // Reconcile drift: server rendered with cookie value (or default), but the
        // pre-paint script flipped the DOM attribute to match localStorage. Sync
        // React state, the cookie, and the attribute back together.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setThemeState(stored);
        document.documentElement.dataset.theme = stored;
        document.cookie = `${THEME_COOKIE_KEY}=${stored}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
      }
    } catch {
      // localStorage may be disabled; fall back to initialTheme
    }
    // run once on mount to reconcile cookie/localStorage drift
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = id;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      // ignore quota / disabled
    }
    try {
      document.cookie = `${THEME_COOKIE_KEY}=${id}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
    } catch {
      // ignore
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

export const themeInitScript = `
(function() {
  try {
    var key = '${THEME_STORAGE_KEY}';
    var match = document.cookie.match(/(?:^|; )${THEME_COOKIE_KEY}=([^;]+)/);
    var cookieValue = match ? decodeURIComponent(match[1]) : null;
    var stored = localStorage.getItem(key);
    var theme = cookieValue || stored || '${DEFAULT_THEME}';
    if (theme !== 'terminal' && theme !== 'executive' && theme !== 'editorial') {
      theme = '${DEFAULT_THEME}';
    }
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = '${DEFAULT_THEME}';
  }
})();
`;
