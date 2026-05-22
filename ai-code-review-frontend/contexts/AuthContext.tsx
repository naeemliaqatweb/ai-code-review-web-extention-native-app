"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const response = await api.get('/user');
        setUser(response.data);
      } catch (error) {
        console.error('Session expired or invalid token', error);
        Cookies.remove('auth_token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post<AuthResponse>('/login', credentials);
      const { user, token } = response.data;
      
      // Store token in cookies
      Cookies.set('auth_token', token, { 
        expires: 7, 
        secure: true, 
        sameSite: 'strict',
        path: '/' 
      });
      
      setUser(user);
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await api.post<AuthResponse>('/register', credentials);
      const { user, token } = response.data;
      
      // Store token in cookies
      Cookies.set('auth_token', token, { 
        expires: 7, 
        secure: true, 
        sameSite: 'strict',
        path: '/' 
      });
      
      setUser(user);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout failed on server', error);
    } finally {
      Cookies.remove('auth_token');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

