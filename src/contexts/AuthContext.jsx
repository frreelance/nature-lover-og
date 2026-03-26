"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../api/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [authCheckInProgress, setAuthCheckInProgress] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    if (savedToken) {
      setToken(savedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      if (token && !user && !hasChecked.current) {
        hasChecked.current = true;
        setAuthCheckInProgress(true);
        try {
          const response = await api.get('/api/user/me');
          setUser(response.data.user);
        } catch (error) {
          if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            setToken(null);
            setUser(null);
          }
        } finally {
          setAuthCheckInProgress(false);
        }
      }
    };
    
    if (token) checkAuth();
  }, [token, user]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/user/login', { email, password });
      const { accessToken, user: userData } = response.data;
      localStorage.setItem('accessToken', accessToken);
      setToken(accessToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await api.post('/api/user/register', { name, email, password, phone });
      const { accessToken, user: userData } = response.data;
      localStorage.setItem('accessToken', accessToken);
      setToken(accessToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/user/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const value = {
    user,
    loading: loading || authCheckInProgress,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
