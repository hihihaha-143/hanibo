import { useEffect, useState, type ReactNode } from "react";
import type { Theme } from "../types/theme";
import { ThemeContext } from "./ThemeContext";

const STORAGE_KEY = "hanibo-theme";

function getInitialTheme(): Theme {
  // 1. Сохранённый выбор
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  // 2. Системная тема
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Применяем тему к <html> и сохраняем в localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Реагируем на смену системной темы, если пользователь не выбирал вручную
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setThemeState(e.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (next: Theme) => {
    setThemeState(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
