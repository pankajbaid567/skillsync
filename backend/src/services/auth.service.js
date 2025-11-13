import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';
import { AppError } from '../middleware/errorHandler.js';

const SALT_ROUNDS = 10;

export const authService = {
  /**
   * Register a new user
   */
  async signup(data) {
    const { email, password, name, bio, skillsOffered, skillsWanted } = data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens({ 
      id: null, // Will be updated after user creation
      email 
    });

    // Create user with refresh token
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        bio: bio || null,
        skillsOffered: skillsOffered || [],
        skillsWanted: skillsWanted || [],
        refreshToken,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        skillsOffered: true,
        skillsWanted: true,
        rating: true,
        isVerified: true,
        createdAt: true,
      },
    });

    // Generate final tokens with correct user ID
    const tokens = this.generateTokens({ id: user.id, email: user.email });

    // Update refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return { 
      accessToken: tokens.accessToken, 
      refreshToken: tokens.refreshToken,
      user 
    };
  },

  /**
   * Login user
   */
  async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate both access and refresh tokens
    const { accessToken, refreshToken } = this.generateTokens({ 
      id: user.id, 
      email: user.email 
    });

    // Store refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Return user without password and refreshToken
    const { passwordHash, refreshToken: _, ...userWithoutSensitiveData } = user;

    return { 
      accessToken, 
      refreshToken,
      user: userWithoutSensitiveData 
    };
  },

  /**
   * Generate Access Token (short-lived)
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '7d',
    });
  },

  /**
   * Generate Refresh Token (long-lived)
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d',
    });
  },

  /**
   * Generate both access and refresh tokens
   */
  generateTokens(payload) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  },

  /**
   * Legacy method for backward compatibility
   */
  generateToken(payload) {
    return this.generateAccessToken(payload);
  },

  /**
   * Verify JWT token (works for both access and refresh tokens)
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken) {
    // Verify refresh token
    const decoded = this.verifyToken(refreshToken);

    // Find user and verify refresh token matches
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new access token
    const accessToken = this.generateAccessToken({ 
      id: user.id, 
      email: user.email 
    });

    return { accessToken };
  },

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        skillsOffered: true,
        skillsWanted: true,
        rating: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  },

  /**
   * Logout user by invalidating refresh token
   */
  async logout(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Logged out successfully' };
  },
};
