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
    const validatedData = signupSchema.parse(req.body);

    // Create user
    const { token, user } = await authService.signup(validatedData);

    res.status(201).json({
      success: true,
      data: {
        token,
        user,
      },
      message: 'User registered successfully',
    });
  }),

  /**
   * POST /api/auth/login
   * Login user
   */
  login: asyncHandler(async (req, res) => {
    // Validate input
    const { email, password } = loginSchema.parse(req.body);

    // Login user
    const { token, user } = await authService.login(email, password);

    res.status(200).json({
      success: true,
      data: {
        token,
        user,
      },
      message: 'Login successful',
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
};
