/**
 * Skill Swap Service
 * Handles all skill swap-related API calls
 */

import apiClient from '@/lib/api-client';
import { SkillSwap, CreateSwapData, UpdateSwapData, SwapStatus, ApiResponse } from '@/types';

/**
 * Create a new skill swap request
 */
export const createSwap = async (data: CreateSwapData): Promise<SkillSwap> => {
  const response = await apiClient.post<ApiResponse<SkillSwap>>('/swaps', data);
  return response.data.data;
};

/**
 * Get all swaps for the current user
 */
export const getMySwaps = async (): Promise<SkillSwap[]> => {
  const response = await apiClient.get<ApiResponse<SkillSwap[]>>('/swaps');
  return response.data.data;
};

/**
 * Get swap by ID
 */
export const getSwapById = async (swapId: number): Promise<SkillSwap> => {
  const response = await apiClient.get<ApiResponse<SkillSwap>>(`/swaps/${swapId}`);
  return response.data.data;
};

/**
 * Update swap status
 */
export const updateSwap = async (
  swapId: number,
  data: UpdateSwapData
): Promise<SkillSwap> => {
  const response = await apiClient.put<ApiResponse<SkillSwap>>(`/swaps/${swapId}`, data);
  return response.data.data;
};

/**
 * Update swap status (convenience method)
 */
export const updateSwapStatus = async (
  swapId: number,
  status: SwapStatus
): Promise<SkillSwap> => {
  return updateSwap(swapId, { status });
};

/**
 * Delete a swap
 */
export const deleteSwap = async (swapId: number): Promise<void> => {
  await apiClient.delete(`/swaps/${swapId}`);
};

/**
 * Accept a swap request
 */
export const acceptSwap = async (swapId: number): Promise<SkillSwap> => {
  return updateSwap(swapId, { status: SwapStatus.ACCEPTED });
};

/**
 * Reject a swap request
 */
export const rejectSwap = async (swapId: number): Promise<SkillSwap> => {
  return updateSwap(swapId, { status: SwapStatus.REJECTED });
};

/**
 * Complete a swap
 */
export const completeSwap = async (swapId: number): Promise<SkillSwap> => {
  return updateSwap(swapId, { status: SwapStatus.COMPLETED });
};

/**
 * Cancel a swap
 */
export const cancelSwap = async (swapId: number): Promise<SkillSwap> => {
  return updateSwap(swapId, { status: SwapStatus.CANCELLED });
};
