import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "access_token";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasToken = Boolean(window.localStorage.getItem(STORAGE_KEY));
    setIsAuthenticated(hasToken);
  }, []);

  const setAuthToken = (token) => {
    if (typeof window === "undefined") return;

    if (!token) {
      window.localStorage.removeItem(STORAGE_KEY);
      setIsAuthenticated(false);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      setAuthToken,
      logout,
      user,
      setUser,
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
