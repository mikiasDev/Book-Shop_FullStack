import express from 'express';
import { getRecentActivity } from '../controllers/activityController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/activity/recent
router.get('/recent', protect, admin, getRecentActivity);

export default router;
