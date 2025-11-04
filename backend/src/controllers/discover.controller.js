import { discoverService } from '../services/discover.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const discoverController = {
  /**
   * GET /api/discover
   * Discover users with filtering and search
   */
  discoverUsers: asyncHandler(async (req, res) => {
    const { q, skill, page, limit, sortBy } = req.query;

    const result = await discoverService.discoverUsers({
      q,
      skill,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 12,
      sortBy,
    });

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  }),

  /**
   * GET /api/discover/skills
   * Get popular skills
   */
  getPopularSkills: asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;

    const skills = await discoverService.getPopularSkills(limit);

    res.status(200).json({
      success: true,
      data: skills,
      count: skills.length,
    });
  }),
};
