import React, { createContext, useContext, useState, useEffect } from 'react';
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
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser({ token, ...JSON.parse(userData) });
        } catch (error) {
          console.error('Error checking auth status:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const register = async (userData) => {
    try {
      const response = await axios.post('https://gdgoc-noteapp.my.id/register', userData, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.data.success) {
        // Hanya mengembalikan response, tidak menyimpan token atau melakukan navigasi
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed. Please try again.');
      } else {
        throw new Error('Network error occurred. Please try again.');
      }
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('https://gdgoc-noteapp.my.id/login', credentials, {
        headers: {
          'Accept': 'application/json',
        },
      });

      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser({ token, ...user });
        navigate('/dashboard');
        return response.data;
      } else {
        throw new Error('Login failed - No token received');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed. Please try again.');
      } else {
        throw new Error('Network error occurred. Please try again.');
      }
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await axios.post('https://gdgoc-noteapp.my.id/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Selalu bersihkan state lokal, terlepas dari respons server
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/login');
    }
  };

  const checkAuth = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;