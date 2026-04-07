"use client";

import * as React from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "assignbridge-theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;

    let initialTheme: Theme = "light";

    if (savedTheme === "light" || savedTheme === "dark") {
      initialTheme = savedTheme;
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      initialTheme = prefersDark ? "dark" : "light";
    }

    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setThemeState((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme]
  );

  if (!mounted) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }

  return context;
}