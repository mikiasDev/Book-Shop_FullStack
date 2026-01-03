import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protect, admin, staffOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, staffOrAdmin, getUsers);

// Get current authenticated user (for session sync)
router.get('/me', protect, (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});
router.post('/logout', logoutUser);
router.post('/login', authUser);

// This is the missing part causing "Resource not found" on Profile
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route('/:id')
  .delete(protect, staffOrAdmin, deleteUser)
  .get(protect, staffOrAdmin, getUserById)
  .put(protect, staffOrAdmin, updateUser);

export default router;