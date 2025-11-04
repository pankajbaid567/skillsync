import prisma from '../prisma/client.js';

export const matchService = {
  /**
   * Find matching users based on skills
   * This is a placeholder implementation. In production, you would use:
   * - Vector embeddings for semantic matching
   * - ML models for better compatibility scoring
   * - User behavior and preferences
   */
  async findMatches(userId, options = {}) {
    const { limit = 5 } = options;

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        skillsOffered: true,
        skillsWanted: true,
      },
    });

    if (!currentUser) {
      return [];
    }

    // Find users where:
    // - Their skillsOffered overlap with user's skillsWanted
    // - Their skillsWanted overlap with user's skillsOffered
    const potentialMatches = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          {
            OR: [
              // They offer what user wants
              {
                skillsOffered: {
                  hasSome: currentUser.skillsWanted,
                },
              },
              // They want what user offers
              {
                skillsWanted: {
                  hasSome: currentUser.skillsOffered,
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        skillsOffered: true,
        skillsWanted: true,
        rating: true,
        _count: {
          select: {
            swapsRequested: true,
            swapsReceived: true,
          },
        },
      },
      take: limit * 2, // Get more to calculate scores
    });

    // Calculate match scores
    const matchesWithScores = potentialMatches.map((match) => {
      let score = 0;

      // Skills they offer that user wants
      const offeredMatchCount = match.skillsOffered.filter((skill) =>
        currentUser.skillsWanted.includes(skill)
      ).length;

      // Skills they want that user offers
      const wantedMatchCount = match.skillsWanted.filter((skill) =>
        currentUser.skillsOffered.includes(skill)
      ).length;

      // Calculate compatibility score (0-100)
      const maxPossibleMatches = Math.max(
        currentUser.skillsWanted.length,
        currentUser.skillsOffered.length,
        1
      );

      score = Math.round(
        ((offeredMatchCount + wantedMatchCount) / maxPossibleMatches) * 100
      );

      // Bonus for mutual matches (both offer and want each other's skills)
      if (offeredMatchCount > 0 && wantedMatchCount > 0) {
        score = Math.min(score + 20, 100);
      }

      // Bonus for higher rating
      score += Math.round(match.rating * 2);
      score = Math.min(score, 100);

      return {
        user: match,
        score,
        offeredSkills: match.skillsOffered.filter((skill) =>
          currentUser.skillsWanted.includes(skill)
        ),
        wantedSkills: match.skillsWanted.filter((skill) =>
          currentUser.skillsOffered.includes(skill)
        ),
        mutualMatch: offeredMatchCount > 0 && wantedMatchCount > 0,
      };
    });

    // Sort by score and return top matches
    const topMatches = matchesWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return topMatches;
  },

  /**
   * Get match by specific skills (public endpoint)
   */
  async findMatchesBySkills(skillsOffered, skillsWanted, options = {}) {
    const { limit = 10 } = options;

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            skillsOffered: {
              hasSome: skillsWanted,
            },
          },
          {
            skillsWanted: {
              hasSome: skillsOffered,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        skillsOffered: true,
        skillsWanted: true,
        rating: true,
      },
      take: limit,
      orderBy: {
        rating: 'desc',
      },
    });

    return users;
  },
};

// Placeholder for future AI-based matching
// export async function getAIMatches(userId) {
//   // TODO: Implement AI-based matching using:
//   // - OpenAI embeddings for semantic skill matching
//   // - User behavior analysis
//   // - Collaborative filtering
//   // - Success rate of past swaps
//   return [];
// }
