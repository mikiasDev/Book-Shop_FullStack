import express from 'express';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Serve preview files securely (PDF/image)
router.get('/:filename', protect, async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join('frontend/public/uploads/previews', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Preview file not found' });
  }
  res.sendFile(path.resolve(filePath));
});

export default router;
