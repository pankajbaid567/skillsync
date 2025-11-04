/**
 * User Service
 * Handles all user-related API calls
 */

import apiClient from '@/lib/api-client';
import { User, UserProfile, ProfileFormData } from '@/types';

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${userId}`);
  return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<ProfileFormData>): Promise<User> => {
  const response = await apiClient.put<User>('/users/profile', data);
  return response.data;
};

/**
 * Get user profile with stats
 */
export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>(`/users/${userId}/profile`);
  return response.data;
};

/**
 * Search users
 */
export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users/search', {
    params: { q: query },
  });
  return response.data;
};

/**
 * Delete user account
 */
export const deleteAccount = async (): Promise<void> => {
  await apiClient.delete('/users/profile');
};
