import { messageService } from '../services/message.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { z } from 'zod';

// Validation schemas
const createMessageSchema = z.object({
    content: z.string().min(1, 'Message content is required'),
});

export const messageController = {
    /**
     * GET /api/messages/:swapId
     * Get messages for a swap
     */
    getMessages: asyncHandler(async (req, res) => {
        const swapId = parseInt(req.params.swapId);

        if (isNaN(swapId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid swap ID',
            });
        }

        const messages = await messageService.getSwapMessages(swapId, req.user.id);

        res.status(200).json({
            success: true,
            data: messages,
        });
    }),

    /**
     * POST /api/messages/:swapId
     * Send a message
     */
    sendMessage: asyncHandler(async (req, res) => {
        const swapId = parseInt(req.params.swapId);

        if (isNaN(swapId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid swap ID',
            });
        }

        const { content } = createMessageSchema.parse(req.body);

        const message = await messageService.createMessage(swapId, req.user.id, content);

        res.status(201).json({
            success: true,
            data: message,
        });
    }),

    /**
     * PUT /api/messages/:swapId/read
     * Mark messages as read
     */
    markAsRead: asyncHandler(async (req, res) => {
        const swapId = parseInt(req.params.swapId);

        if (isNaN(swapId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid swap ID',
            });
        }

        await messageService.markMessagesAsRead(swapId, req.user.id);

        res.status(200).json({
            success: true,
            message: 'Messages marked as read',
        });
    }),
};
