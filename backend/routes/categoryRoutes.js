import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, staffOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCategories).post(protect, staffOrAdmin, createCategory);
router
  .route('/:id')
  .put(protect, staffOrAdmin, updateCategory)
  .delete(protect, staffOrAdmin, deleteCategory);

export default router;