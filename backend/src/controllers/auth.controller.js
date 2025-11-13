import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler.js';

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
  skillsOffered: z.array(z.string()).optional(),
  skillsWanted: z.array(z.string()).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const authController = {
  /**
   * POST /api/auth/signup
   * Register a new user
   */
  signup: asyncHandler(async (req, res) => {
    // Validate input
    const result = signupSchema.safeParse(req.body);
    
    if (!result.success) {
      const errors = result.error.errors.reduce((acc, err) => {
        const field = err.path[0];
        if (!acc[field]) acc[field] = [];
        acc[field].push(err.message);
        return acc;
      }, {});
      
      return res.status(422).json({
        success: false,
        message: 'Validation failed. Please check your input.',
        errors,
      });
    }

    // Create user
    const { accessToken, refreshToken, user } = await authService.signup(result.data);

    res.status(201).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        token: accessToken, // For backward compatibility
        user,
      },
      message: 'Account created successfully! Welcome to SkillSync.',
    });
  }),

  /**
   * POST /api/auth/login
   * Login user
   */
  login: asyncHandler(async (req, res) => {
    // Validate input
    const result = loginSchema.safeParse(req.body);
    
    if (!result.success) {
      const errors = result.error.errors.reduce((acc, err) => {
        const field = err.path[0];
        if (!acc[field]) acc[field] = [];
        acc[field].push(err.message);
        return acc;
      }, {});
      
      return res.status(422).json({
        success: false,
        message: 'Please provide valid email and password.',
        errors,
      });
    }

    // Login user
    const { email, password } = result.data;
    const { accessToken, refreshToken, user } = await authService.login(email, password);

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        token: accessToken, // For backward compatibility
        user,
      },
      message: `Welcome back, ${user.name}!`,
    });
  }),

  /**
   * POST /api/auth/verify
   * Verify JWT token
   */
  verify: asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = authService.verifyToken(token);

    res.status(200).json({
      success: true,
      data: decoded,
      message: 'Token is valid',
    });
  }),

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  me: asyncHandler(async (req, res) => {
    // req.userId is set by the auth middleware
    const user = await authService.getUserById(req.userId);

    res.status(200).json({
      success: true,
      data: user,
      message: 'User profile retrieved',
    });
  }),

  /**
   * POST /api/auth/refresh
   * Refresh access token using refresh token
   */
  refresh: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const { accessToken } = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        token: accessToken, // For backward compatibility
      },
      message: 'Access token refreshed successfully',
    });
  }),

  /**
   * POST /api/auth/logout
   * Logout user and invalidate refresh token
   */
  logout: asyncHandler(async (req, res) => {
    // req.userId is set by the auth middleware
    await authService.logout(req.userId);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }),
};
