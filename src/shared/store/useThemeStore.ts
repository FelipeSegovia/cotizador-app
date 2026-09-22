import { create } from "zustand";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

const applyThemeClass = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

const readStoredTheme = (): Theme => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const useThemeStore = create<ThemeStore>((set, get) => {
  const theme = readStoredTheme();
  applyThemeClass(theme);

  return {
    theme,
    setTheme: (nextTheme) => {
      try {
        localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch {
        // Ignore storage access errors (private mode, blocked storage, etc.)
      }
      applyThemeClass(nextTheme);
      set({ theme: nextTheme });
    },
    toggleTheme: () => {
      const nextTheme = get().theme === "dark" ? "light" : "dark";
      get().setTheme(nextTheme);
    },
  };
});

export default useThemeStore;
