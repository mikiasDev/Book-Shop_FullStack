import express from 'express';
import { getAuthors, updateAuthor } from '../controllers/authorController.js';
import { protect, staffOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, staffOrAdmin, getAuthors);
router.put('/:name', protect, staffOrAdmin, updateAuthor);

export default router;
