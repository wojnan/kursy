import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import {
  login as apiLogin,
  signup as apiSignup,
  loginWithGoogle as apiGoogleLogin,
  type User as DbUser,
} from '../services/database';

/* =========================
   TYPES
========================= */

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthResponse {
  user: DbUser;
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;

  loginWithGoogleProfile: (profile: GoogleProfile) => Promise<void>;
  logout: () => void;
}

/* =========================
   CONTEXT
========================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =========================
   MAPPERS
========================= */

function mapDbUser(user: DbUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };
}

/* =========================
   PROVIDER
========================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /* Hydrate auth state */
  useEffect(() => {
    const savedUser = localStorage.getItem('learnhub-user');
    const savedToken = localStorage.getItem('token');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);
  }, []);

  const saveAuth = (user: User, token?: string) => {
    setUser(user);
    localStorage.setItem('learnhub-user', JSON.stringify(user));

    if (token) {
      setToken(token);
      localStorage.setItem('token', token);
    }
  };

  /* =========================
     EMAIL/PASSWORD LOGIN
  ========================= */

  const login = async (email: string, password: string) => {
    const res = (await apiLogin(email, password)) as AuthResponse;

    const mappedUser = mapDbUser(res.user);

    saveAuth(mappedUser, res.token);
  };

  const signup = async (email: string, password: string, name: string) => {
    const res = (await apiSignup(email, password, name)) as AuthResponse;

    const mappedUser = mapDbUser(res.user);

    saveAuth(mappedUser, res.token);
  };

  /* =========================
     GOOGLE OAUTH LOGIN
  ========================= */

  const loginWithGoogleProfile = async (profile: GoogleProfile) => {
    try {
     
      const res = await apiGoogleLogin({
        googleId: profile.sub,
        email: profile.email,
        name: profile.name
      });

      const mappedUser = mapDbUser(res.user);

      saveAuth(mappedUser, res.token);
    } catch (error) {
      console.warn('Google login backend failed, using fallback:', error);

      // ⚠️ fallback for dev only
      const fallbackUser: User = {
        id: Number(profile.sub.replace(/\D/g, '').slice(0, 9)) || Date.now(),
        name: profile.name,
        email: profile.email,
        created_at: new Date().toISOString(),
      };

      saveAuth(fallbackUser);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('learnhub-user');
    localStorage.removeItem('token');
  };

  /* =========================
     CONTEXT VALUE
  ========================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,

        login,
        signup,
        loginWithGoogleProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}