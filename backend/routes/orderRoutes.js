import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  createPaymentIntent,
  getOrders,
  updateOrderToDelivered,
} from '../controllers/orderController.js';
import { uploadPaymentProof } from '../controllers/paymentProofController.js';
import upload from '../middleware/uploadPaymentProof.js';
import { protect, admin, staffOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, staffOrAdmin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
// Manual payment proof upload
router.route('/:id/payment-proof').post(protect, upload.single('paymentProof'), uploadPaymentProof);
router.route('/:id/deliver').put(protect, staffOrAdmin, updateOrderToDelivered);

// Route for Bybit Card / Stripe Payment Intent
router.route('/stripe/payment').post(protect, createPaymentIntent);

export default router;