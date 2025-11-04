/**
 * TypeScript Types and Interfaces
 * Matching backend Prisma schema and API responses
 */

// ==================== User Types ====================
export interface User {
  id: number;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  swapsCompleted?: number;
  activeSwaps?: number;
}

// ==================== Authentication Types ====================
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ==================== Skill Swap Types ====================
export enum SwapStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface SkillSwap {
  id: number;
  requesterId: number;
  providerId: number;
  skillOffered: string;
  skillRequested: string;
  description?: string;
  status: SwapStatus;
  createdAt: string;
  updatedAt: string;
  requester?: User;
  provider?: User;
}

export interface CreateSwapData {
  providerId: number;
  skillOffered: string;
  skillRequested: string;
  description?: string;
}

export interface UpdateSwapData {
  status: SwapStatus;
}

// ==================== Review Types ====================
export interface Review {
  id: number;
  swapId: number;
  reviewerId: number;
  reviewedUserId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer?: User;
  reviewedUser?: User;
  swap?: SkillSwap;
}

export interface CreateReviewData {
  swapId: number;
  reviewedUserId: number;
  rating: number;
  comment?: string;
}

// ==================== Message Types ====================
export interface Message {
  id: number;
  swapId: number;
  senderId: number;
  content: string;
  createdAt: string;
  sender?: User;
}

export interface SendMessageData {
  swapId: number;
  content: string;
}

// ==================== Match Types ====================
export interface MatchResult {
  user: User;
  score: number;
  commonSkills: string[];
}

// ==================== Discovery Types ====================
export interface DiscoveryFilters {
  skillsOffered?: string[];
  skillsWanted?: string[];
  location?: string;
  minRating?: number;
  search?: string;
}

// ==================== Pagination Types ====================
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ==================== API Response Types ====================
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// ==================== Socket.IO Event Types ====================
export interface SocketMessage {
  swapId: number;
  senderId: number;
  content: string;
  timestamp: string;
}

export interface TypingEvent {
  swapId: number;
  userId: number;
  isTyping: boolean;
}

export interface JoinRoomData {
  swapId: number;
}

// ==================== Form Types ====================
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  name: string;
  bio?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  avatar?: string;
}

export interface SwapRequestFormData {
  providerId: number;
  skillOffered: string;
  skillRequested: string;
  description?: string;
}

export interface ReviewFormData {
  rating: number;
  comment?: string;
}
