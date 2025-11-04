import prisma from '../prisma/client.js';
import { AppError } from '../middleware/errorHandler.js';

export const swapService = {
  /**
   * Create a new skill swap request
   */
  async createSwap(requesterId, data) {
    const { receiverId, skillOffered, skillRequested } = data;

    // Prevent self-swap
    if (requesterId === receiverId) {
      throw new AppError('Cannot create swap with yourself', 400);
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new AppError('Receiver user not found', 404);
    }

    // Create swap
    const swap = await prisma.skillSwap.create({
      data: {
        requesterId,
        receiverId,
        skillOffered,
        skillRequested,
        status: 'PENDING',
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            rating: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            rating: true,
          },
        },
      },
    });

    return swap;
  },

  /**
   * Get swap by ID
   */
  async getSwapById(swapId, userId) {
    const swap = await prisma.skillSwap.findUnique({
      where: { id: swapId },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            rating: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            rating: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!swap) {
      throw new AppError('Swap not found', 404);
    }

    // Check if user is part of the swap
    if (swap.requesterId !== userId && swap.receiverId !== userId) {
      throw new AppError('Unauthorized access to this swap', 403);
    }

    return swap;
  },

  /**
   * Get all swaps for a user
   */
  async getUserSwaps(userId, filters = {}) {
    const { status, role } = filters;

    const where = {
      OR: [{ requesterId: userId }, { receiverId: userId }],
    };

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by role (requested or received)
    if (role === 'requested') {
      delete where.OR;
      where.requesterId = userId;
    } else if (role === 'received') {
      delete where.OR;
      where.receiverId = userId;
    }

    const swaps = await prisma.skillSwap.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            rating: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            rating: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return swaps;
  },

  /**
   * Update swap status
   */
  async updateSwapStatus(swapId, userId, status) {
    const swap = await prisma.skillSwap.findUnique({
      where: { id: swapId },
    });

    if (!swap) {
      throw new AppError('Swap not found', 404);
    }

    // Verify user is part of the swap
    if (swap.requesterId !== userId && swap.receiverId !== userId) {
      throw new AppError('Unauthorized access to this swap', 403);
    }

    // Validate status transitions
    const validStatuses = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    // Business logic for status transitions
    if (status === 'ACCEPTED' && swap.receiverId !== userId) {
      throw new AppError('Only the receiver can accept a swap', 403);
    }

    if (status === 'REJECTED' && swap.receiverId !== userId) {
      throw new AppError('Only the receiver can reject a swap', 403);
    }

    if (status === 'CANCELLED' && swap.requesterId !== userId) {
      throw new AppError('Only the requester can cancel a swap', 403);
    }

    // Update swap
    const updatedSwap = await prisma.skillSwap.update({
      where: { id: swapId },
      data: { status },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            rating: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            rating: true,
          },
        },
      },
    });

    return updatedSwap;
  },

  /**
   * Delete/cancel a swap
   */
  async deleteSwap(swapId, userId) {
    const swap = await prisma.skillSwap.findUnique({
      where: { id: swapId },
    });

    if (!swap) {
      throw new AppError('Swap not found', 404);
    }

    // Only requester can delete, and only if status is PENDING
    if (swap.requesterId !== userId) {
      throw new AppError('Only the requester can delete a swap', 403);
    }

    if (swap.status !== 'PENDING') {
      throw new AppError('Can only delete pending swaps', 400);
    }

    await prisma.skillSwap.delete({
      where: { id: swapId },
    });

    return { message: 'Swap deleted successfully' };
  },
};
