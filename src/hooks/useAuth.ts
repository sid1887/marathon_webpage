import { useState, useEffect } from 'react';

const AUTH_KEY = 'sid-marathon-auth';
const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const { timestamp } = JSON.parse(stored);
      const isExpired = Date.now() - timestamp > AUTH_DURATION;
      if (!isExpired) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (password: string): boolean => {
    // Change this to your password
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, login, logout };
}
