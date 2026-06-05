import { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { authAPI } from '../api-new';

export const useAuth = () => {
  const auth = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      const { token, refreshToken, user } = response.data;
      auth.login(user, token, refreshToken);
      return { success: true, user };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(name, email, password, role);
      const { token, refreshToken, user } = response.data;
      auth.login(user, token, refreshToken);
      return { success: true, user };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      auth.logout();
    }
  };

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
};

export const useRequireAuth = (redirect = '/login') => {
  const auth = useAuthStore();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      window.location.href = redirect;
    }
  }, [auth.isAuthenticated, redirect]);

  return auth;
};

export const useRole = (requiredRole) => {
  const auth = useAuthStore();

  return {
    hasRole: auth.user?.role === requiredRole,
    isAdmin: auth.user?.role === 'ADMIN',
    isAgency: auth.user?.role === 'AGENCY',
    isUser: auth.user?.role === 'USER',
    role: auth.user?.role,
  };
};
