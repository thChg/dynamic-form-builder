import "./App.css";
import { useTheme } from "./context/ThemeContext.jsx";

function App() {
  const { effectiveTheme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <div>
            <p className="brand-title">Dynamic Form Builder</p>
            <p className="brand-subtitle">Starter UI with theme support.</p>
          </div>
        </div>
        <button type="button" className="theme-toggle" onClick={toggleTheme}>
          {effectiveTheme === "dark" ? "Switch to Light" : "Switch to Dark"}
        </button>
      </header>

      <main className="app-body">
        <h1>Dark mode is ready.</h1>
        <p>
          Your theme follows the system setting by default and can be overridden
          using the toggle.
        </p>
      </main>
    </div>
  );
}

export default App;
