import styles from "./AuthScreen.module.css";
import ThemeToggleButton from "../components/ThemeToggleButton.jsx";
import { useState } from "react";
import { login } from "../apis/authServiceApi.js";
import FormError from "../components/FormError.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function AuthScreen() {
  const { setAuthToken, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await login({ email, password });
      const { token, user } = response.data;
      setAuthToken(token);
      setUser(user);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message ||
        "Login failed";
      setErrorMessage(message);
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.toolbar}>
        <ThemeToggleButton />
      </div>
      <section className={styles.loginCard} aria-label="Login form">
        <div className={styles.cardHeader}>
          <h2>Welcome back</h2>
          <p>Sign in to manage your workspaces.</p>
        </div>
        <form className={styles.loginForm} onSubmit={onLoginSubmit}>
          <FormError message={errorMessage} />
          <label className={styles.field}>
            Work email
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className={styles.field}>
            Password
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <div className={styles.fieldRow}>
            <button type="button" className={styles.textButton}>
              Forgot password?
            </button>
          </div>
          <button type="submit" className={styles.primaryButton}>
            Sign in
          </button>
        </form>
        <p className={styles.footnote}>
          New here? <button type="button">Create an account</button>
        </p>
      </section>
    </div>
  );
}

export default AuthScreen;
