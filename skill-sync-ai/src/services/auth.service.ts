/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient, { setAuthToken, setUserData, removeAuthToken } from '@/lib/api-client';
import { AuthResponse, LoginCredentials, SignupData, User } from '@/types';

/**
 * User signup
 */
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await apiClient.post<{ success: boolean; data: AuthResponse; message: string }>('/auth/signup', data);
  
  // Extract the actual data from the API response wrapper
  const { token, user } = response.data.data;
  
  // Store token and user data
  setAuthToken(token);
  setUserData(user);
  
  return { token, user };
};

/**
 * User login
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<{ success: boolean; data: AuthResponse; message: string }>('/auth/login', credentials);
  
  // Extract the actual data from the API response wrapper
  const { token, user } = response.data.data;
  
  // Store token and user data
  setAuthToken(token);
  setUserData(user);
  
  return { token, user };
};

/**
 * User logout
 */
export const logout = async (): Promise<void> => {
  // Clear local storage
  removeAuthToken();
  
  // Optional: Call backend logout endpoint if you implement it
  // await apiClient.post('/auth/logout');
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
