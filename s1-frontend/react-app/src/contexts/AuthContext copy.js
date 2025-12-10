import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check localStorage on mount
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Register function
  const register = async (userData) => {
    setError('');
    const result = await ApiService.register(userData);
    
    if (result.success) {
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      setCurrentUser(result.user);
      return { success: true, user: result.user };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  };

  // Login function
  const login = async (email, password) => {
    setError('');
    const result = await ApiService.login({ email, password });
    
    if (result.success) {
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      setCurrentUser(result.user);
      return { success: true, user: result.user };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setError('');
  };

  // Update user data
  const updateUser = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    
    if (score < 3) return { strength: 'Weak', color: 'danger', requirements };
    if (score < 5) return { strength: 'Medium', color: 'warning', requirements };
    return { strength: 'Strong', color: 'success', requirements };
  };

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      error,
      register,
      login,
      logout,
      updateUser,
      checkPasswordStrength,
      validateEmail,
      isAuthenticated: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};