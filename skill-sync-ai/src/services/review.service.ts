/**
 * Review Service
 * Handles all review-related API calls
 */

import apiClient from '@/lib/api-client';
import { Review, CreateReviewData, ApiResponse } from '@/types';

/**
 * Create a new review
 */
export const createReview = async (data: CreateReviewData): Promise<Review> => {
  const response = await apiClient.post<ApiResponse<Review>>('/reviews', data);
  return response.data.data;
};

/**
 * Get reviews for a user
 */
export const getUserReviews = async (userId: number): Promise<Review[]> => {
  const response = await apiClient.get<ApiResponse<Review[]>>(`/reviews/user/${userId}`);
  return response.data.data;
};

/**
 * Get review by ID
 */
export const getReviewById = async (reviewId: number): Promise<Review> => {
  const response = await apiClient.get<ApiResponse<Review>>(`/reviews/${reviewId}`);
  return response.data.data;
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: number): Promise<void> => {
  await apiClient.delete(`/reviews/${reviewId}`);
};
