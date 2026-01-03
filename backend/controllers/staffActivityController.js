import asyncHandler from '../middleware/asyncHandler.js';
import StaffActivity from '../models/StaffActivity.js';

// @desc    Get recent staff activity logs
// @route   GET /api/staff/activity
// @access  Private/Admin
const getStaffActivity = asyncHandler(async (req, res) => {
  const logs = await StaffActivity.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('staffId', 'name email role');
  res.json(logs);
});

// @desc    Log a staff activity
// @route   POST /api/staff/activity
// @access  Private/Admin
const logStaffActivity = asyncHandler(async (req, res) => {
  const { staffId, action, performedBy, details } = req.body;
  const log = await StaffActivity.create({ staffId, action, performedBy, details });
  res.status(201).json(log);
});

export { getStaffActivity, logStaffActivity };
