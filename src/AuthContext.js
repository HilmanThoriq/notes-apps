import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from './apiServices';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // mengambil data pengguna jika diperlukan
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      const token = response.data.token;
      localStorage.setItem('auth_token', token);
      setUser({ token });
    } catch (error) {
      console.error('Login gagal:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      const token = response.data.token;
      localStorage.setItem('auth_token', token);
      setUser({ token });
    } catch (error) {
      console.error('Pendaftaran gagal:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('auth_token');
      setUser(null);
    } catch (error) {
      console.error('Logout gagal:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};