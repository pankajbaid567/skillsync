import express from 'express';
import { discoverController } from '../controllers/discover.controller.js';

const router = express.Router();

/**
 * @route   GET /api/discover
 * @desc    Discover users with filtering and search
 * @access  Public
 */
router.get('/', discoverController.discoverUsers);

/**
 * @route   GET /api/discover/skills
 * @desc    Get popular skills
 * @access  Public
 */
router.get('/skills', discoverController.getPopularSkills);

export default router;
