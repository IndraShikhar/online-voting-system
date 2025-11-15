import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // e.g. { id: 1, role: 'admin' } or 'voter'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("authUser"));
    if (saved) setUser(saved);
  }, []);

  const login = (payload) => {
    // payload = { id, role, name, token }
    setUser(payload);
    localStorage.setItem("authUser", JSON.stringify(payload));
  };

  const logout = async () => {
    setLoading(true);
    try {
      // call server to clear httpOnly cookie
      await authService.logout();
    } catch (err) {
      // log but proceed to clear local state
      console.error('Logout request failed', err);
    } finally {
      setUser(null);
      localStorage.removeItem("authUser");
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
