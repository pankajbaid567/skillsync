import express from 'express';
import { messageController } from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/messages/:swapId
 * @desc    Get messages for a swap
 * @access  Private
 */
router.get('/:swapId', messageController.getMessages);

/**
 * @route   POST /api/messages/:swapId
 * @desc    Send a message
 * @access  Private
 */
router.post('/:swapId', messageController.sendMessage);

/**
 * @route   PUT /api/messages/:swapId/read
 * @desc    Mark messages as read
 * @access  Private
 */
router.put('/:swapId/read', messageController.markAsRead);

export default router;
