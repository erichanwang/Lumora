"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

type Theme = "light" | "dark" | "system";

type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const isSystemRef = useRef(true);

  useEffect(() => {
    const stored = localStorage.getItem("lumora-theme") as Theme | null;
    const initial = stored || "system";
    isSystemRef.current = initial === "system";
    setThemeState(initial);
    const resolved = initial === "system" ? getSystemTheme() : initial;
    setResolvedTheme(resolved);
    // Apply theme without complex strings
    const isDark = initial === "dark" || (initial === "system" && getSystemTheme() === "dark");
    document.documentElement.classList.toggle("dark", isDark);

    // Listen for system preference changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (isSystemRef.current) {
        const sys = getSystemTheme();
        setResolvedTheme(sys);
        document.documentElement.classList.toggle("dark", sys === "dark");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    isSystemRef.current = t === "system";
    setThemeState(t);
    localStorage.setItem("lumora-theme", t);
    const resolved = t === "system" ? getSystemTheme() : t;
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
