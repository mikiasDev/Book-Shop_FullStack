import express from 'express';
import { getStaffActivity, logStaffActivity } from '../controllers/staffActivityController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getStaffActivity)
  .post(protect, admin, logStaffActivity);

export default router;
