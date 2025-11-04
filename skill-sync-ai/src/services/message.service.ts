/**
 * Message Service
 * Handles message-related API calls (REST)
 */

import apiClient from '@/lib/api-client';
import { Message } from '@/types';

/**
 * Get messages for a swap
 */
export const getSwapMessages = async (swapId: number): Promise<Message[]> => {
  const response = await apiClient.get<Message[]>(`/messages/${swapId}`);
  return response.data;
};

/**
 * Send a message (REST fallback)
 */
export const sendMessage = async (swapId: number, content: string): Promise<Message> => {
  const response = await apiClient.post<Message>(`/messages/${swapId}`, { content });
  return response.data;
};
