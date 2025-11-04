import express from 'express';
import { swapController } from '../controllers/swap.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/swaps
 * @desc    Create a new skill swap request
 * @access  Private
 */
router.post('/', swapController.createSwap);

/**
 * @route   GET /api/swaps
 * @desc    Get all swaps for the current user
 * @access  Private
 */
router.get('/', swapController.getUserSwaps);

/**
 * @route   GET /api/swaps/:id
 * @desc    Get swap by ID
 * @access  Private
 */
router.get('/:id', swapController.getSwapById);

/**
 * @route   PUT /api/swaps/:id
 * @desc    Update swap status
 * @access  Private
 */
router.put('/:id', swapController.updateSwapStatus);

/**
 * @route   DELETE /api/swaps/:id
 * @desc    Delete/cancel a swap
 * @access  Private
 */
router.delete('/:id', swapController.deleteSwap);

export default router;
