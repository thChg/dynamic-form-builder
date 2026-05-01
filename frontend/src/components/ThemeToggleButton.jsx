import { useTheme } from "../context/ThemeContext.jsx";
import styles from "./ThemeToggleButton.module.css";

function ThemeToggleButton() {
  const { effectiveTheme, toggleTheme } = useTheme();
  const label =
    effectiveTheme === "dark" ? "Switch to light" : "Switch to dark";

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggleTheme}
      aria-pressed={effectiveTheme === "dark"}
      aria-label={label}
    >
      {label}
    </button>
  );
}

export default ThemeToggleButton;
