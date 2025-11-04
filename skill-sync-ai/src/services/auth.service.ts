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
  const response = await apiClient.post<AuthResponse>('/auth/signup', data);
  
  // Store token and user data
  setAuthToken(response.data.token);
  setUserData(response.data.user);
  
  return response.data;
};

/**
 * User login
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  
  // Store token and user data
  setAuthToken(response.data.token);
  setUserData(response.data.user);
  
  return response.data;
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
  const response = await apiClient.get<User>('/auth/me');
  
  // Update stored user data
  setUserData(response.data);
  
  return response.data;
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
