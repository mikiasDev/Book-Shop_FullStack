import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { downloadBookFile } from '../controllers/downloadController.js';

const router = express.Router();

// Secure download route
router.get('/book/:bookId', protect, downloadBookFile);

export default router;
