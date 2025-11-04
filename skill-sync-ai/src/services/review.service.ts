/**
 * Review Service
 * Handles all review-related API calls
 */

import apiClient from '@/lib/api-client';
import { Review, CreateReviewData } from '@/types';

/**
 * Create a new review
 */
export const createReview = async (data: CreateReviewData): Promise<Review> => {
  const response = await apiClient.post<Review>('/reviews', data);
  return response.data;
};

/**
 * Get reviews for a user
 */
export const getUserReviews = async (userId: number): Promise<Review[]> => {
  const response = await apiClient.get<Review[]>(`/reviews/user/${userId}`);
  return response.data;
};

/**
 * Get review by ID
 */
export const getReviewById = async (reviewId: number): Promise<Review> => {
  const response = await apiClient.get<Review>(`/reviews/${reviewId}`);
  return response.data;
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: number): Promise<void> => {
  await apiClient.delete(`/reviews/${reviewId}`);
};
