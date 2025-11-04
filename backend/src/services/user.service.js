import prisma from '../prisma/client.js';
import { AppError } from '../middleware/errorHandler.js';

export const userService = {
  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        skillsOffered: true,
        skillsWanted: true,
        rating: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            swapsRequested: true,
            swapsReceived: true,
            reviewsGot: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, data) {
    const { name, bio, avatarUrl, skillsOffered, skillsWanted } = data;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(skillsOffered && { skillsOffered }),
        ...(skillsWanted && { skillsWanted }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        skillsOffered: true,
        skillsWanted: true,
        rating: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return user;
  },

  /**
   * Calculate and update user rating
   */
  async updateUserRating(userId) {
    const reviews = await prisma.review.findMany({
      where: { reviewedUserId: userId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return 0;
    }

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await prisma.user.update({
      where: { id: userId },
      data: { rating: averageRating },
    });

    return averageRating;
  },

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    const [completedSwaps, pendingSwaps, totalReviews] = await Promise.all([
      prisma.skillSwap.count({
        where: {
          OR: [{ requesterId: userId }, { receiverId: userId }],
          status: 'COMPLETED',
        },
      }),
      prisma.skillSwap.count({
        where: {
          OR: [{ requesterId: userId }, { receiverId: userId }],
          status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] },
        },
      }),
      prisma.review.count({
        where: { reviewedUserId: userId },
      }),
    ]);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { rating: true },
    });

    return {
      completedSwaps,
      pendingSwaps,
      totalReviews,
      rating: user?.rating || 0,
    };
  },
};
