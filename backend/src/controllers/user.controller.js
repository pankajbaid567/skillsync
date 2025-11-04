import { userService } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { z } from 'zod';

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  skillsOffered: z.array(z.string()).optional(),
  skillsWanted: z.array(z.string()).optional(),
});

export const userController = {
  /**
   * GET /api/users/me
   * Get current user profile
   */
  getMe: asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  /**
   * PUT /api/users/me
   * Update current user profile
   */
  updateMe: asyncHandler(async (req, res) => {
    // Validate input
    const validatedData = updateProfileSchema.parse(req.body);

    // Update profile
    const user = await userService.updateProfile(req.user.id, validatedData);

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  }),

  /**
   * GET /api/users/:id
   * Get public user profile
   */
  getUserById: asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const user = await userService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  /**
   * GET /api/users/:id/stats
   * Get user statistics
   */
  getUserStats: asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const stats = await userService.getUserStats(userId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  }),
};
