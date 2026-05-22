import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { storage } from '../services/storage';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { token } = await storage.get('token');
      if (token) {
        const userData = await api.getCurrentUser();
        setUser(userData);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      // If token is invalid, clear it
      await storage.remove('token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await api.login(email, password);
      await storage.set({ token });
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function register(name, email, password) {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await api.register(name, email, password);
      await storage.set({ token });
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await storage.remove('token');
    setUser(null);
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
