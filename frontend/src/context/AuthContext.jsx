import React, { createContext, useState, useEffect } from 'react';
import api from '../lib/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('magranchal_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/api/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token: userToken, ...userData } = res.data;

    localStorage.setItem('magranchal_token', userToken);
    setToken(userToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    const { token: userToken, ...userData } = res.data;

    localStorage.setItem('magranchal_token', userToken);
    setToken(userToken);
    setUser(userData);
    return userData;
  };

  const googleLogin = async (googlePayload) => {
    const res = await api.post('/api/auth/google', googlePayload);
    const { token: userToken, ...userData } = res.data;

    localStorage.setItem('magranchal_token', userToken);
    setToken(userToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('magranchal_token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
