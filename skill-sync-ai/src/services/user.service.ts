/**
 * User Service
 * Handles all user-related API calls
 */

import apiClient from '@/lib/api-client';
import { User, UserProfile, ProfileFormData, ApiResponse } from '@/types';

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(`/users/${userId}`);
  return response.data.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<ProfileFormData>): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>('/users/me', data);
  return response.data.data;
};

/**
 * Get user profile with stats
 */
export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const response = await apiClient.get<ApiResponse<UserProfile>>(`/users/${userId}/profile`);
  return response.data.data;
};

/**
 * Search users
 */
export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await apiClient.get<ApiResponse<User[]>>('/users/search', {
    params: { q: query },
  });
  return response.data.data;
};

/**
 * Delete user account
 */
export const deleteAccount = async (): Promise<void> => {
  await apiClient.delete('/users/me');
};
