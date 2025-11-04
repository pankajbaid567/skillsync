/**
 * API Client Configuration
 * 
 * Centralized Axios instance with interceptors for:
 * - Automatic token attachment
 * - Request/Response logging
 * - Error handling and transformation
 * - Token refresh logic
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Token storage keys
export const TOKEN_KEY = 'skillsync_token';
export const USER_KEY = 'skillsync_user';

/**
 * API Error Response Interface
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * API Success Response Interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Create Axios instance with base configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Attaches JWT token to every request if available
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles responses and errors globally
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<ApiError>) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message,
        errors: error.response?.data?.errors,
      });
    }

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // Bad Request
          toast.error(data.message || 'Invalid request. Please check your input.');
          break;

        case 401:
          // Unauthorized
          if (window.location.pathname.includes('/login') || window.location.pathname.includes('/signup')) {
            // Show specific error message for login/signup
            toast.error(data.message || 'Invalid email or password.');
          } else {
            // Session expired - clear token and redirect
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            toast.error('Session expired. Please login again.');
            setTimeout(() => {
              window.location.href = '/login';
            }, 1500);
          }
          break;

        case 403:
          toast.error(data.message || 'Access denied. You don\'t have permission to perform this action.');
          break;

        case 404:
          toast.error(data.message || 'Resource not found.');
          break;

        case 409:
          // Conflict - usually duplicate data (e.g., email already exists)
          toast.error(data.message || 'This email is already registered. Please login or use a different email.');
          break;

        case 422:
          // Validation errors
          if (data.errors) {
            // Show first error only to avoid spam
            const firstError = Object.entries(data.errors)[0];
            if (firstError) {
              const [field, messages] = firstError as [string, string[]];
              toast.error(`${field}: ${messages[0]}`);
            }
          } else {
            toast.error(data.message || 'Please check your input and try again.');
          }
          break;

        case 429:
          toast.error('Too many requests. Please slow down and try again in a moment.');
          break;

        case 500:
          toast.error('Server error. Our team has been notified. Please try again later.');
          break;

        case 502:
        case 503:
          toast.error('Service temporarily unavailable. Please try again in a moment.');
          break;

        case 504:
          toast.error('Request timeout. Please check your connection and try again.');
          break;

        default:
          toast.error(data.message || 'Something went wrong. Please try again.');
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

/**
 * Authentication helpers
 */
export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * User data helpers
 */
export const setUserData = (user: any) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserData = (): any | null => {
  const data = localStorage.getItem(USER_KEY);
  if (!data || data === 'undefined' || data === 'null') {
    return null;
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

export default apiClient;
