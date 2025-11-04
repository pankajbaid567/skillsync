import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware, userController.getMe);

/**
 * @route   PUT /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me', authMiddleware, userController.updateMe);

/**
 * @route   GET /api/users/:id
 * @desc    Get public user profile by ID
 * @access  Public
 */
router.get('/:id', userController.getUserById);

/**
 * @route   GET /api/users/:id/stats
 * @desc    Get user statistics
 * @access  Public
 */
router.get('/:id/stats', userController.getUserStats);

export default router;
