import { swapService } from '../services/swap.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { z } from 'zod';

// Validation schemas
const createSwapSchema = z.object({
  receiverId: z.number().int().positive(),
  skillOffered: z.string().min(1),
  skillRequested: z.string().min(1),
});

const updateSwapSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED']),
});

export const swapController = {
  /**
   * POST /api/swaps
   * Create a new skill swap request
   */
  createSwap: asyncHandler(async (req, res) => {
    // Validate input
    const validatedData = createSwapSchema.parse(req.body);

    // Create swap
    const swap = await swapService.createSwap(req.user.id, validatedData);

    res.status(201).json({
      success: true,
      data: swap,
      message: 'Swap request created successfully',
    });
  }),

  /**
   * GET /api/swaps/:id
   * Get swap by ID
   */
  getSwapById: asyncHandler(async (req, res) => {
    const swapId = parseInt(req.params.id);

    if (isNaN(swapId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid swap ID',
      });
    }

    const swap = await swapService.getSwapById(swapId, req.user.id);

    res.status(200).json({
      success: true,
      data: swap,
    });
  }),

  /**
   * GET /api/swaps
   * Get all swaps for the current user
   */
  getUserSwaps: asyncHandler(async (req, res) => {
    const { status, role } = req.query;

    const swaps = await swapService.getUserSwaps(req.user.id, { status, role });

    res.status(200).json({
      success: true,
      data: swaps,
      count: swaps.length,
    });
  }),

  /**
   * PUT /api/swaps/:id
   * Update swap status
   */
  updateSwapStatus: asyncHandler(async (req, res) => {
    const swapId = parseInt(req.params.id);

    if (isNaN(swapId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid swap ID',
      });
    }

    // Validate input
    const { status } = updateSwapSchema.parse(req.body);

    // Update swap
    const swap = await swapService.updateSwapStatus(swapId, req.user.id, status);

    res.status(200).json({
      success: true,
      data: swap,
      message: 'Swap status updated successfully',
    });
  }),

  /**
   * DELETE /api/swaps/:id
   * Delete/cancel a swap
   */
  deleteSwap: asyncHandler(async (req, res) => {
    const swapId = parseInt(req.params.id);

    if (isNaN(swapId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid swap ID',
      });
    }

    const result = await swapService.deleteSwap(swapId, req.user.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }),
};
