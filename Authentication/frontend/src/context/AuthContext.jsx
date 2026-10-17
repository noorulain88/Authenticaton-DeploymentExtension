import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("learnhub_user") || "null"); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("learnhub_token")));

  useEffect(() => {
    const token = localStorage.getItem("learnhub_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("learnhub_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("learnhub_token");
        localStorage.removeItem("learnhub_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (data) => {
    localStorage.setItem("learnhub_token", data.token);
    localStorage.setItem("learnhub_user", JSON.stringify(data.user));
    setUser(data.user);
  };
  const logout = () => {
    localStorage.removeItem("learnhub_token");
    localStorage.removeItem("learnhub_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
