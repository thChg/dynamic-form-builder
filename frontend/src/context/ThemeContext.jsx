import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "theme-preference";

export function ThemeProvider({ children }) {
  const [themePreference, setThemePreference] = useState(() => {
    if (typeof window === "undefined") return "system";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const effectiveTheme = useMemo(() => {
    if (themePreference === "system") {
      return systemPrefersDark ? "dark" : "light";
    }
    return themePreference;
  }, [systemPrefersDark, themePreference]);

  const applyThemeClass = (isDark) => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("dark", isDark);
  };

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    if (themePreference === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        setSystemPrefersDark(media.matches);
        applyThemeClass(media.matches);
      };

      handleChange();
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    applyThemeClass(effectiveTheme === "dark");
    return undefined;
  }, [effectiveTheme, themePreference]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (themePreference === "system") {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, themePreference);
  }, [themePreference]);

  const toggleTheme = () => {
    const next = effectiveTheme === "dark" ? "light" : "dark";
    setThemePreference(next);
  };

  const value = useMemo(
    () => ({
      themePreference,
      setThemePreference,
      systemPrefersDark,
      effectiveTheme,
      toggleTheme,
    }),
    [effectiveTheme, systemPrefersDark, themePreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
