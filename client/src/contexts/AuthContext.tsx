import { createContext, useEffect, useState } from "react";
import { api } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  login: (provider: string) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const BACKEND_URL = "http://localhost:5000";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get("/auth/status");
      setUser(response.data.user);
      console.log("Response Data: ", response.data);
      
    } catch (error) {
      console.error("Failed to check auth status:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
