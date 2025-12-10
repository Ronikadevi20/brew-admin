import { useState, createContext, useContext, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string; cafeName: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; cafeName: string } | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login - in production, this would call your API
    if (email && password) {
      setIsAuthenticated(true);
      setUser({ email, cafeName: "Artisan Coffee House" });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
