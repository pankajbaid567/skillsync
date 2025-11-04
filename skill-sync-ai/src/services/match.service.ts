/**
 * Match Service
 * Handles AI matching and discovery API calls
 */

import apiClient from '@/lib/api-client';
import { MatchResult, User, DiscoveryFilters } from '@/types';

/**
 * Get AI-powered matches for current user
 */
export const getMatches = async (): Promise<MatchResult[]> => {
  const response = await apiClient.get<MatchResult[]>('/matches');
  return response.data;
};

/**
 * Discover users with filters
 */
export const discoverUsers = async (filters?: DiscoveryFilters): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/discover', {
    params: filters,
  });
  return response.data;
};

/**
 * Get recommended users based on skills
 */
export const getRecommendations = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/discover/recommendations');
  return response.data;
};
