import prisma from '../prisma/client.js';
import { AppError } from '../middleware/errorHandler.js';

export const messageService = {
    /**
     * Get messages for a swap
     */
    async getSwapMessages(swapId, userId) {
        // Verify user is part of the swap
        const swap = await prisma.skillSwap.findUnique({
            where: { id: swapId },
        });

        if (!swap) {
            throw new AppError('Swap not found', 404);
        }

        if (swap.requesterId !== userId && swap.receiverId !== userId) {
            throw new AppError('Unauthorized access to this swap', 403);
        }

        const messages = await prisma.message.findMany({
            where: { swapId },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        return messages;
    },

    /**
     * Create a new message
     */
    async createMessage(swapId, senderId, content) {
        // Verify user is part of the swap
        const swap = await prisma.skillSwap.findUnique({
            where: { id: swapId },
        });

        if (!swap) {
            throw new AppError('Swap not found', 404);
        }

        if (swap.requesterId !== senderId && swap.receiverId !== senderId) {
            throw new AppError('Unauthorized access to this swap', 403);
        }

        const message = await prisma.message.create({
            data: {
                swapId,
                senderId,
                content,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        return message;
    },

    /**
     * Mark messages as read
     */
    async markMessagesAsRead(swapId, userId) {
        // Verify user is part of the swap
        const swap = await prisma.skillSwap.findUnique({
            where: { id: swapId },
        });

        if (!swap) {
            throw new AppError('Swap not found', 404);
        }

        if (swap.requesterId !== userId && swap.receiverId !== userId) {
            throw new AppError('Unauthorized access to this swap', 403);
        }

        // Update all messages in this swap that were NOT sent by the current user
        await prisma.message.updateMany({
            where: {
                swapId,
                senderId: { not: userId },
                read: false,
            },
            data: {
                read: true,
            },
        });

        return { success: true };
    },
};
