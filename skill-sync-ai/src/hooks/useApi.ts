/**
 * Custom React Query Hooks
 * Provides type-safe hooks for all API operations with caching and optimistic updates
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as authService from '@/services/auth.service';
import * as userService from '@/services/user.service';
import * as swapService from '@/services/swap.service';
import * as reviewService from '@/services/review.service';
import * as matchService from '@/services/match.service';
import * as messageService from '@/services/message.service';
import {
  User,
  SkillSwap,
  Review,
  Message,
  MatchResult,
  CreateSwapData,
  UpdateSwapData,
  CreateReviewData,
  ProfileFormData,
  DiscoveryFilters,
} from '@/types';

// ==================== Query Keys ====================
export const queryKeys = {
  user: (id?: number) => (id ? ['user', id] : ['user']),
  users: (query?: string) => ['users', query],
  swaps: ['swaps'],
  swap: (id: number) => ['swap', id],
  reviews: (userId: number) => ['reviews', userId],
  matches: ['matches'],
  discover: (filters?: DiscoveryFilters) => ['discover', filters],
  messages: (swapId: number) => ['messages', swapId],
};

// ==================== User Hooks ====================

/**
 * Get user by ID
 */
export const useUser = (userId: number, options?: UseQueryOptions<User>) => {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => userService.getUserById(userId),
    ...options,
  });
};

/**
 * Update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProfileFormData>) => userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user() });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Update profile error:', error);
    },
  });
};

/**
 * Search users
 */
export const useSearchUsers = (query: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.users(query),
    queryFn: () => userService.searchUsers(query),
    enabled: enabled && query.length > 0,
  });
};

// ==================== Swap Hooks ====================

/**
 * Get all swaps for current user
 */
export const useSwaps = (options?: UseQueryOptions<SkillSwap[]>) => {
  return useQuery({
    queryKey: queryKeys.swaps,
    queryFn: () => swapService.getMySwaps(),
    ...options,
  });
};

/**
 * Get swap by ID
 */
export const useSwap = (swapId: number, options?: UseQueryOptions<SkillSwap>) => {
  return useQuery({
    queryKey: queryKeys.swap(swapId),
    queryFn: () => swapService.getSwapById(swapId),
    ...options,
  });
};

/**
 * Create a new swap
 */
export const useCreateSwap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSwapData) => swapService.createSwap(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.swaps });
      toast.success('Swap request created successfully');
    },
    onError: (error: any) => {
      console.error('Create swap error:', error);
    },
  });
};

/**
 * Update swap status
 */
export const useUpdateSwap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ swapId, data }: { swapId: number; data: UpdateSwapData }) =>
      swapService.updateSwap(swapId, data),
    onSuccess: (updatedSwap) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.swaps });
      queryClient.invalidateQueries({ queryKey: queryKeys.swap(updatedSwap.id) });
      toast.success('Swap updated successfully');
    },
    onError: (error: any) => {
      console.error('Update swap error:', error);
    },
  });
};

/**
 * Delete a swap
 */
export const useDeleteSwap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (swapId: number) => swapService.deleteSwap(swapId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.swaps });
      toast.success('Swap deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete swap error:', error);
    },
  });
};

/**
 * Accept a swap
 */
export const useAcceptSwap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (swapId: number) => swapService.acceptSwap(swapId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.swaps });
      toast.success('Swap accepted!');
    },
  });
};

/**
 * Reject a swap
 */
export const useRejectSwap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (swapId: number) => swapService.rejectSwap(swapId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.swaps });
      toast.success('Swap rejected');
    },
  });
};

/**
 * Complete a swap
 */
export const useCompleteSwap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (swapId: number) => swapService.completeSwap(swapId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.swaps });
      toast.success('Swap completed! 🎉');
    },
  });
};

// ==================== Review Hooks ====================

/**
 * Get reviews for a user
 */
export const useUserReviews = (userId: number, options?: UseQueryOptions<Review[]>) => {
  return useQuery({
    queryKey: queryKeys.reviews(userId),
    queryFn: () => reviewService.getUserReviews(userId),
    ...options,
  });
};

/**
 * Create a review
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewService.createReview(data),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(review.reviewedUserId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.swaps });
      toast.success('Review submitted successfully');
    },
    onError: (error: any) => {
      console.error('Create review error:', error);
    },
  });
};

/**
 * Delete a review
 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review deleted');
    },
  });
};

// ==================== Match Hooks ====================

/**
 * Get AI matches
 */
export const useMatches = (options?: UseQueryOptions<MatchResult[]>) => {
  return useQuery({
    queryKey: queryKeys.matches,
    queryFn: () => matchService.getMatches(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Discover users with filters
 */
export const useDiscoverUsers = (filters?: DiscoveryFilters, options?: UseQueryOptions<User[]>) => {
  return useQuery({
    queryKey: queryKeys.discover(filters),
    queryFn: () => matchService.discoverUsers(filters),
    ...options,
  });
};

/**
 * Get recommendations
 */
export const useRecommendations = (options?: UseQueryOptions<User[]>) => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: () => matchService.getRecommendations(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// ==================== Message Hooks ====================

/**
 * Get messages for a swap
 */
export const useMessages = (swapId: number, options?: UseQueryOptions<Message[]>) => {
  return useQuery({
    queryKey: queryKeys.messages(swapId),
    queryFn: () => messageService.getSwapMessages(swapId),
    ...options,
  });
};

/**
 * Send a message (REST fallback)
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ swapId, content }: { swapId: number; content: string }) =>
      messageService.sendMessage(swapId, content),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(message.swapId) });
    },
  });
};
