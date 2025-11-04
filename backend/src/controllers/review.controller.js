import { reviewService } from '../services/review.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { z } from 'zod';

// Validation schemas
const createReviewSchema = z.object({
  reviewedUserId: z.number().int().positive(),
  swapId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const reviewController = {
  /**
   * POST /api/reviews
   * Create a new review
   */
  createReview: asyncHandler(async (req, res) => {
    // Validate input
    const validatedData = createReviewSchema.parse(req.body);

    // Create review
    const review = await reviewService.createReview(req.user.id, validatedData);

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully',
    });
  }),

  /**
   * GET /api/reviews/user/:userId
   * Get reviews for a specific user
   */
  getUserReviews: asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await reviewService.getUserReviews(userId, { page, limit });

    res.status(200).json({
      success: true,
      data: result.reviews,
      pagination: result.pagination,
    });
  }),

  /**
   * GET /api/reviews/:id
   * Get review by ID
   */
  getReviewById: asyncHandler(async (req, res) => {
    const reviewId = parseInt(req.params.id);

    if (isNaN(reviewId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID',
      });
    }

    const review = await reviewService.getReviewById(reviewId);

    res.status(200).json({
      success: true,
      data: review,
    });
  }),
};
