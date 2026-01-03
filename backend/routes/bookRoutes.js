import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  createBookReview,
  deleteBookReview,
} from '../controllers/bookController.js';
import { protect, admin, staffOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getBooks).post(protect, staffOrAdmin, createBook);
router.route('/:id/reviews').post(protect, createBookReview);
router.route('/:id/reviews/:reviewId').delete(protect, staffOrAdmin, deleteBookReview);
router
  .route('/:id')
  .get(getBookById)
  .put(protect, staffOrAdmin, updateBook)
  .delete(protect, staffOrAdmin, deleteBook);

export default router;