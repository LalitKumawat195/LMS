import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch fresh user data from server instead of using localStorage
      fetchUserData();
    }
    setLoading(false);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Fallback to localStorage if API fails
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (!parsedUser.role) {
          parsedUser.role = 'Member';
          localStorage.setItem('user', JSON.stringify(parsedUser));
        }
        setUser(parsedUser);
      }
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch complete user profile including profile picture
      try {
        const profileResponse = await axios.get('/api/user/profile');
        const completeUser = profileResponse.data;
        setUser(completeUser);
        localStorage.setItem('user', JSON.stringify(completeUser));
      } catch (profileError) {
        // Fallback to login response user data
        setUser(user);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, role = 'Member', department = '', phone = '') => {
    try {
      // Basic validation
      if (!name.trim() || !email.trim() || !password.trim()) {
        return { success: false, message: 'All fields are required' };
      }
      
      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }
      
      const response = await axios.post('/api/auth/register', { 
        name: name.trim(), 
        email: email.toLowerCase().trim(), 
        password,
        role,
        department: department.trim(),
        phone: phone.trim()
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};