import { createContext, useContext, useEffect, useState } from "react";

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
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
