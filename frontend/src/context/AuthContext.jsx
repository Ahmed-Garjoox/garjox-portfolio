import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch current user details from profile endpoint
  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('auth/user/me/');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }

    // Set up global listener for API logout signal (if token refresh fails)
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth_logout', handleLogout);
    return () => {
      window.removeEventListener('auth_logout', handleLogout);
    };
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('auth/token/', { username, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Immediately fetch user profile
      const userResponse = await api.get('auth/user/me/');
      setUser(userResponse.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      return {
        success: false,
        error: error.response?.data?.detail || 'Invalid username or password.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
