import { matchService } from '../services/match.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { z } from 'zod';

// Validation schema
const matchBySkillsSchema = z.object({
  skillsOffered: z.array(z.string()).optional(),
  skillsWanted: z.array(z.string()).optional(),
});

export const matchController = {
  /**
   * POST /api/match
   * Get AI-powered matches for current user or by specified skills
   */
  getMatches: asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;

    // If user is authenticated, find matches for them
    if (req.user) {
      const matches = await matchService.findMatches(req.user.id, { limit });

      return res.status(200).json({
        success: true,
        data: matches,
        count: matches.length,
        message: 'Matches found based on your profile',
      });
    }

    // Otherwise, find matches by provided skills
    const { skillsOffered, skillsWanted } = matchBySkillsSchema.parse(req.body);

    if (!skillsOffered?.length && !skillsWanted?.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skillsOffered or skillsWanted',
      });
    }

    const matches = await matchService.findMatchesBySkills(
      skillsOffered || [],
      skillsWanted || [],
      { limit }
    );

    res.status(200).json({
      success: true,
      data: matches,
      count: matches.length,
      message: 'Matches found based on provided skills',
    });
  }),

  /**
   * GET /api/match/me
   * Get matches for authenticated user
   */
  getMyMatches: asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;

    const matches = await matchService.findMatches(req.user.id, { limit });

    res.status(200).json({
      success: true,
      data: matches,
      count: matches.length,
    });
  }),
};
