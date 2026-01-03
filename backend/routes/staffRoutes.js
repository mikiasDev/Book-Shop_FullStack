
import express from 'express';
const router = express.Router();
import { getStaff, addStaff, updateStaff, deleteStaff, forgotStaffPassword, resetStaffPassword, loginStaff, getStaffProfile, updateStaffProfile } from '../controllers/staffController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js';
// Staff self profile routes
router.route('/profile')
  .get(protect, getStaffProfile)
  .put(protect, upload.single('profileImage'), updateStaffProfile);

// Staff login route
router.post('/login', loginStaff);
// Staff password reset routes
router.post('/forgot-password', forgotStaffPassword);
router.post('/reset-password/:token', resetStaffPassword);

router.route('/')
  .get(protect, admin, getStaff)
  .post(protect, admin, upload.single('profileImage'), addStaff);

router.route('/:id')
  .put(protect, admin, upload.single('profileImage'), updateStaff)
  .delete(protect, admin, deleteStaff);

export default router;
