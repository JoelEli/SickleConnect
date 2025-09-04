import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { User, AuthContextType, SignUpData, ProfileUpdateData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await apiClient.auth.me();
      setUser(data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await apiClient.auth.login({ email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const result = await apiClient.auth.register(data);
      localStorage.setItem('token', result.token);
      setUser(result.user);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    
    try {
      await apiClient.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    try {
      const result = await apiClient.auth.updateProfile(data);
      setUser(result.user);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
