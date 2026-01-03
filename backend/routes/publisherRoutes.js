import express from 'express';
import { getPublishers, createPublisher, updatePublisher, deletePublisher } from '../controllers/publisherController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getPublishers)
  .post(protect, admin, createPublisher);

router.route('/:id')
  .put(protect, admin, updatePublisher)
  .delete(protect, admin, deletePublisher);

export default router;
