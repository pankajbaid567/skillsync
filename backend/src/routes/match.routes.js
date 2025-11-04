import express from 'express';
import { matchController } from '../controllers/match.controller.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/match
 * @desc    Get AI-powered matches (public or authenticated)
 * @access  Public/Private
 */
router.post('/', optionalAuthMiddleware, matchController.getMatches);

/**
 * @route   GET /api/match/me
 * @desc    Get matches for authenticated user
 * @access  Private
 */
router.get('/me', authMiddleware, matchController.getMyMatches);

export default router;
