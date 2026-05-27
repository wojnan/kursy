import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import { login as apiLogin, signup as apiSignup, type User as DbUser } from '../services/database';

// ✅ Frontend User now matches DB
interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔁 Normalize DB user → frontend user (future-proof layer)
function mapDbUser(user: DbUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('learnhub-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, name?: string) => {
    // Try real API login first
    try {
      const res = await apiLogin(email, password);

      const mappedUser = mapDbUser(res.user);

      setUser(mappedUser);
      localStorage.setItem('learnhub-user', JSON.stringify(mappedUser));
      return;
    } catch (err) {
      // fallback (optional dev mode)
      console.warn('Login API failed, falling back to mock:', err);

      if (!name) {
        throw new Error('Name required for mock login fallback');
      }

      const fallbackUser: User = {
        id: Date.now(),
        name,
        email,
        created_at: new Date().toISOString(),
      };

      setUser(fallbackUser);
      localStorage.setItem('learnhub-user', JSON.stringify(fallbackUser));
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('learnhub-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}