import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, saveToken, removeToken } from '../services/tokenService';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile as apiGetProfile } from '../services/authService';

interface User {
  id: number;
  name: string;
  email: string;
  counts?: {
    text: number;
    code: number;
    resume: number;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token on mount
    const loadToken = async () => {
      try {
        const token = await getToken();
        if (token) {
          const userData = await apiGetProfile();
          setUser(userData);
        }
      } catch (e) {
        console.error('Failed to load token or user', e);
        await removeToken(); // Clear invalid token
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('[Auth] Attempting sign-in for:', email);
    const data = await apiLogin(email, password);
    // Data has { token, user } or { access_token, user }
    const token = data.token || data.access_token;
    console.log('[Auth] Token received:', token ? `${token.substring(0, 10)}...` : 'NONE');
    
    if (token) {
      await saveToken(token);
      setUser(data.user);
    } else {
      console.warn('[Auth] No token found in login response');
    }
  };

  const signUp = async (formData: any) => {
    const data = await apiRegister(formData);
    const token = data.token || data.access_token;
    await saveToken(token);
    setUser(data.user);
  };

  const signOut = async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.error('Logout error on server', e);
    } finally {
      await removeToken();
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await apiGetProfile();
      setUser(userData);
    } catch (e) {
      console.error('Failed to refresh user profile', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
