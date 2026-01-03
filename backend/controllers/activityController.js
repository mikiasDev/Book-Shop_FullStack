import ActivityLog from '../models/ActivityLog.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get recent activity logs
// @route   GET /api/activity/recent
// @access  Private/Admin
export const getRecentActivity = asyncHandler(async (req, res) => {
  const logs = await ActivityLog.find({})
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(logs);
});

// @desc    Log a new activity (utility, not exposed as public route)
export const logActivity = async ({ action, user, meta }) => {
  await ActivityLog.create({ action, user, meta });
};
