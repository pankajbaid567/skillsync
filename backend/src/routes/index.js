import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import swapRoutes from './swap.routes.js';
import reviewRoutes from './review.routes.js';
import matchRoutes from './match.routes.js';
import discoverRoutes from './discover.routes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/swaps', swapRoutes);
router.use('/reviews', reviewRoutes);
router.use('/match', matchRoutes);
router.use('/discover', discoverRoutes);

export default router;
