/**
 * Authentication Context
 * Provides global authentication state management
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { getUserData, isAuthenticated as checkAuth, removeAuthToken } from '@/lib/api-client';
import * as authService from '@/services/auth.service';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (checkAuth()) {
          // Try to get user data from localStorage first
          const storedUser = getUserData();
          if (storedUser) {
            setUser(storedUser);
          }

          // Verify token and refresh user data
          await refreshUser();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        removeAuthToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      setUser(response.user);
      toast.success(`Welcome back, ${response.user.name}!`);
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Error is already handled by API client interceptor
      // But we can add additional context here if needed
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      
      // Only show toast if it wasn't already shown by interceptor
      if (error.response?.status !== 401 && error.response?.status !== 422) {
        toast.error(errorMessage);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signup new user
   */
  const signup = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.signup({ name, email, password });
      setUser(response.user);
      toast.success(`Welcome to SkillSync, ${response.user.name}! 🎉`);
    } catch (error: any) {
      console.error('Signup failed:', error);
      
      // Error is already handled by API client interceptor
      // But we can add additional context here if needed
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      
      // Only show toast if it wasn't already shown by interceptor
      if (error.response?.status !== 409 && error.response?.status !== 422) {
        toast.error(errorMessage);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      removeAuthToken();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
