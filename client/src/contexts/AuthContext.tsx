import { createContext, useState, useEffect } from "react";
import { api } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (provider: string) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const BACKEND_URL = "http://localhost:5000";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get("/user");
      setUser(response.data);
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = (provider: string) => {
    window.location.href = `${BACKEND_URL}/auth/${provider}`;
  };

  const logout = async () => {
    try {
      await api.get("/logout/google");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const refreshAuth = async () => {
    try {
      await api.post("/refresh");
      await checkAuthStatus();
    } catch (error) {
      console.error("Token refresh failed:", error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
