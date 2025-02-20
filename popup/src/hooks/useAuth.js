import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authAPI } from '../services/api';

export function useAuth() {
  const context = useApp();
  if (!context) {
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: () => {},
      register: () => {},
      logout: () => {}
    };
  }

  const { state, dispatch } = context;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        dispatch({ type: 'SET_USER', payload: response.user });
        return true;
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        dispatch({ type: 'SET_USER', payload: response.user });
        return true;
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'SET_USER', payload: null });
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading || loading,
    error,
    login,
    register,
    logout
  };
} 