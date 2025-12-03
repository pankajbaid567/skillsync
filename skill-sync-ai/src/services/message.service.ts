/**
 * Message Service
 * Handles message-related API calls (REST)
 */

import apiClient from '@/lib/api-client';
import { Message, ApiResponse } from '@/types';

/**
 * Get messages for a swap
 */
export const getSwapMessages = async (swapId: number): Promise<Message[]> => {
  const response = await apiClient.get<ApiResponse<Message[]>>(`/messages/${swapId}`);
  return response.data.data;
};

/**
 * Send a message (REST fallback)
 */
export const sendMessage = async (swapId: number, content: string): Promise<Message> => {
  const response = await apiClient.post<ApiResponse<Message>>(`/messages/${swapId}`, { content });
  return response.data.data;
};
