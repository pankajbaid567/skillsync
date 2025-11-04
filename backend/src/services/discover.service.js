import prisma from '../prisma/client.js';

export const discoverService = {
  /**
   * Discover users with advanced filtering and search
   */
  async discoverUsers(filters = {}) {
    const {
      q, // search query
      skill, // specific skill filter
      page = 1,
      limit = 12,
      sortBy = 'rating', // rating, createdAt
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {};

    // Search by name or bio
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { bio: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Filter by skill (offered or wanted)
    if (skill) {
      where.OR = where.OR || [];
      where.OR.push(
        { skillsOffered: { has: skill } },
        { skillsWanted: { has: skill } }
      );
    }

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { rating: 'desc' };
    }

    // Execute query
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          bio: true,
          skillsOffered: true,
          skillsWanted: true,
          rating: true,
          createdAt: true,
          _count: {
            select: {
              swapsRequested: true,
              swapsReceived: true,
              reviewsGot: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get popular skills
   */
  async getPopularSkills(limit = 20) {
    // Get all users' skills
    const users = await prisma.user.findMany({
      select: {
        skillsOffered: true,
        skillsWanted: true,
      },
    });

    // Count skill occurrences
    const skillCounts = {};

    users.forEach((user) => {
      [...user.skillsOffered, ...user.skillsWanted].forEach((skill) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    // Sort and return top skills
    const sortedSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([skill, count]) => ({ skill, count }));

    return sortedSkills;
  },
};
