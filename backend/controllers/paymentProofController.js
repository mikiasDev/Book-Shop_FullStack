import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';
import path from 'path';
import fs from 'fs';

// @desc    Upload payment proof and mark order as pending verification
// @route   POST /api/orders/:id/payment-proof
// @access  Private
const uploadPaymentProof = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only allow the user who owns the order
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to upload payment proof for this order');
  }

  // File upload (req.file)
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // Save file path and payment info to order
  order.paymentProof = {
    url: `/uploads/payment-proofs/${req.file.filename}`,
    originalName: req.file.originalname,
    paymentId: req.body.paymentId,
    paymentMethod: req.body.paymentMethod,
    status: 'Verified',
    uploadedAt: new Date(),
  };
  order.isPaid = true;
  order.paidAt = new Date();
  order.isDelivered = true;
  order.deliveredAt = new Date();
  await order.save();

  res.status(200).json({ message: 'Payment proof uploaded and order marked as paid and delivered.' });
});

export { uploadPaymentProof };
