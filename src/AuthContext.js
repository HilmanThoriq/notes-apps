import React, { createContext, useContext, useState, useEffect } from 'react';
//import { loginUser, registerUser, logoutUser } from './apiServices';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setUser({ token });
      navigate('/dashboard');
    }
    setLoading(false);
  }, [navigate]);

  const register = async (userData) => {
    try {
      const response = await axios.post('https://gdgoc-noteapp.my.id/register', userData, {
        headers: {
          'Accept': 'application/json', // Pastikan untuk menambahkan header ini
        },
      });
      const token = response.data.token;
      localStorage.setItem('auth_token', token);
      setUser({ token });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during registration:', error);
      if (error.response) {
        // Jika ada respons dari server
        throw new Error(error.response.data.message || 'Pendaftaran gagal. Silakan coba lagi.');
      } else {
        // Jika tidak ada respons dari server
        throw new Error('Terjadi kesalahan jaringan. Silakan coba lagi.');
      }
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('https://gdgoc-noteapp.my.id/login', credentials);
      setUser({ token: response.data.token });
      localStorage.setItem('auth_token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Login gagal. Silakan coba lagi.');
      } else {
        throw new Error('Terjadi kesalahan jaringan. Silakan coba lagi.');
      }
    }
  };

  const logout = async () => {
    try {
      await axios.post('https://gdgoc-noteapp.my.id/logout');
      localStorage.removeItem('auth_token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Terjadi kesalahan saat logout. Silakan coba lagi.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};