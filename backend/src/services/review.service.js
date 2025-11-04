import prisma from '../prisma/client.js';
import { AppError } from '../middleware/errorHandler.js';
import { userService } from './user.service.js';

export const reviewService = {
  /**
   * Create a new review
   */
  async createReview(reviewerId, data) {
    const { reviewedUserId, swapId, rating, comment } = data;

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    // Check if swap exists and is completed
    const swap = await prisma.skillSwap.findUnique({
      where: { id: swapId },
    });

    if (!swap) {
      throw new AppError('Swap not found', 404);
    }

    if (swap.status !== 'COMPLETED') {
      throw new AppError('Can only review completed swaps', 400);
    }

    // Verify reviewer is part of the swap
    if (swap.requesterId !== reviewerId && swap.receiverId !== reviewerId) {
      throw new AppError('You can only review swaps you participated in', 403);
    }

    // Verify the reviewedUserId is the other party
    const validReviewedUserId =
      swap.requesterId === reviewerId ? swap.receiverId : swap.requesterId;

    if (reviewedUserId !== validReviewedUserId) {
      throw new AppError('Invalid reviewed user for this swap', 400);
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        swapId,
        reviewerId,
        reviewedUserId,
      },
    });

    if (existingReview) {
      throw new AppError('You have already reviewed this swap', 409);
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        reviewerId,
        reviewedUserId,
        swapId,
        rating,
        comment,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        reviewedUser: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update user's average rating
    await userService.updateUserRating(reviewedUserId);

    return review;
  },

  /**
   * Get reviews for a user
   */
  async getUserReviews(userId, filters = {}) {
    const { page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { reviewedUserId: userId },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          swap: {
            select: {
              id: true,
              skillOffered: true,
              skillRequested: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { reviewedUserId: userId },
      }),
    ]);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get review by ID
   */
  async getReviewById(reviewId) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        reviewedUser: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        swap: {
          select: {
            id: true,
            skillOffered: true,
            skillRequested: true,
          },
        },
      },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    return review;
  },
};
