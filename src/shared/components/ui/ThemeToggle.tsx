import { HiMoon, HiSun } from "react-icons/hi2";
import { useThemeStore } from "../../store";

const ThemeToggle = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-ring hover:text-foreground"
    >
      {isDark ? <HiSun className="text-lg" /> : <HiMoon className="text-lg" />}
    </button>
  );
};

export default ThemeToggle;
