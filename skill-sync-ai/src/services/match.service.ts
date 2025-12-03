/**
 * Match Service
 * Handles AI matching and discovery API calls
 */

import apiClient from '@/lib/api-client';
import { MatchResult, User, DiscoveryFilters, ApiResponse } from '@/types';

/**
 * Get AI-powered matches for current user
 */
export const getMatches = async (): Promise<MatchResult[]> => {
  const response = await apiClient.get<ApiResponse<MatchResult[]>>('/match/me');
  return response.data.data;
};

/**
 * Discover users with filters
 */
export const discoverUsers = async (filters?: DiscoveryFilters): Promise<User[]> => {
  const response = await apiClient.get<ApiResponse<User[]>>('/discover', {
    params: filters,
  });
  return response.data.data;
};

/**
 * Get recommended users based on skills
 */
export const getRecommendations = async (): Promise<User[]> => {
  const response = await apiClient.get<ApiResponse<User[]>>('/discover/recommendations');
  return response.data.data;
};
