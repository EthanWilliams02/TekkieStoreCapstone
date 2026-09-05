import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/profile';
import { authService, RegisterPayload } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
}

const STORAGE_KEY = 'tekkie_store_auth';
const TOKEN_KEY = 'tekkie_token';

export const DEFAULT_USER: UserProfile = {
  firstName: 'Marcus',
  lastName: 'Redelinghuys',
  email: 'marcus.red@example.com',
  phone: '+27 82 555 1234',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      if (saved && token) {
        const parsed = JSON.parse(saved);
        return {
          isAuthenticated: Boolean(parsed.isAuthenticated),
          user: parsed.user || null,
        };
      }
    } catch (error) {
      console.error('Failed to load auth from localStorage', error);
    }
    return {
      isAuthenticated: false,
      user: null,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    } catch (error) {
      console.error('Failed to persist auth state', error);
    }
  }, [authState]);

  const login = async (email: string, password?: string) => {
    const response = await authService.login(email, password);
    localStorage.setItem(TOKEN_KEY, response.token);

    let first = '';
    let last = '';
    if (response.name) {
      const parts = response.name.trim().split(/\s+/);
      first = parts[0] || '';
      last = parts.slice(1).join(' ') || '';
    }

    const realUser: UserProfile = {
      firstName: first || 'Member',
      lastName: last,
      email: response.email,
      phone: '',
    };

    setAuthState({
      isAuthenticated: true,
      user: realUser,
    });
  };

  const signup = async (data: RegisterPayload) => {
    const response = await authService.register(data);
    localStorage.setItem(TOKEN_KEY, response.token);

    let first = data.firstName || '';
    let last = data.lastName || '';

    if (!first && response.name) {
      const parts = response.name.trim().split(/\s+/);
      first = parts[0] || '';
      last = parts.slice(1).join(' ') || '';
    }

    const realUser: UserProfile = {
      firstName: first || 'Member',
      lastName: last,
      email: response.email,
      phone: data.phone || data.mobileNumber || '',
    };

    setAuthState({
      isAuthenticated: true,
      user: realUser,
    });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    setAuthState((prev) => {
      if (!prev.user) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          ...updatedData,
        },
      };
    });
  };

  const value: AuthContextType = {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
