import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('user');
    
    if (auth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
    }
  }, []);

  const login = (username: string) => {
    setIsAuthenticated(true);
    setUser(username);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', username);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
