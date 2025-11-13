/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient, { setAuthToken, setRefreshToken, setUserData, removeAuthToken } from '@/lib/api-client';
import { AuthResponse, LoginCredentials, SignupData, User } from '@/types';

/**
 * User signup
 */
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await apiClient.post<{ 
    success: boolean; 
    data: { 
      token: string; 
      accessToken: string; 
      refreshToken: string; 
      user: User 
    }; 
    message: string 
  }>('/auth/signup', data);
  
  // Extract tokens and user data from the API response
  const { token, accessToken, refreshToken, user } = response.data.data;
  
  // Store tokens and user data (use accessToken if available, fallback to token for compatibility)
  setAuthToken(accessToken || token);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
  setUserData(user);
  
  return { token: accessToken || token, user };
};

/**
 * User login
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<{ 
    success: boolean; 
    data: { 
      token: string; 
      accessToken: string; 
      refreshToken: string; 
      user: User 
    }; 
    message: string 
  }>('/auth/login', credentials);
  
  // Extract tokens and user data from the API response
  const { token, accessToken, refreshToken, user } = response.data.data;
  
  // Store tokens and user data (use accessToken if available, fallback to token for compatibility)
  setAuthToken(accessToken || token);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
  setUserData(user);
  
  return { token: accessToken || token, user };
};

/**
 * User logout
 */
export const logout = async (): Promise<void> => {
  try {
    // Call backend logout endpoint to invalidate refresh token
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Even if backend call fails, clear local storage
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    removeAuthToken();
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<{ success: boolean; data: User; message: string }>('/auth/me');
  
  // Extract the actual data from the API response wrapper
  const user = response.data.data;
  
  // Update stored user data
  setUserData(user);
  
  return user;
};

/**
 * Verify token validity
 */
export const verifyToken = async (): Promise<boolean> => {
  try {
    await getCurrentUser();
    return true;
  } catch (error) {
    removeAuthToken();
    return false;
  }
};
