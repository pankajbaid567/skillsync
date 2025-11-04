import express from 'express';
import { reviewController } from '../controllers/review.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private
 */
router.post('/', authMiddleware, reviewController.createReview);

/**
 * @route   GET /api/reviews/user/:userId
 * @desc    Get reviews for a specific user
 * @access  Public
 */
router.get('/user/:userId', reviewController.getUserReviews);

/**
 * @route   GET /api/reviews/:id
 * @desc    Get review by ID
 * @access  Public
 */
router.get('/:id', reviewController.getReviewById);

export default router;
