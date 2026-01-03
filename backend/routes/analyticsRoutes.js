import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Book from '../models/Book.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/analytics/summary
// @desc    Get admin analytics summary (sales, users, downloads, top books)
// @access  Private/Admin
router.get('/summary', protect, admin, async (req, res) => {
  const totalSales = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const sales = totalSales[0]?.total || 0;

  const userCount = await User.countDocuments();
  const orderCount = await Order.countDocuments();
  const bookCount = await Book.countDocuments();

  // Top 5 books by sales
  const topBooks = await Order.aggregate([
    { $unwind: '$orderItems' },
    { $group: {
      _id: '$orderItems.product',
      name: { $first: '$orderItems.name' },
      totalSold: { $sum: '$orderItems.qty' },
      totalRevenue: { $sum: '$orderItems.price' },
    }},
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  // Downloads: count of orders with downloadable books
  const downloadCount = await Order.aggregate([
    { $unwind: '$orderItems' },
    { $lookup: {
      from: 'books',
      localField: 'orderItems.product',
      foreignField: '_id',
      as: 'book',
    }},
    { $unwind: '$book' },
    { $match: { 'book.fileUrl': { $exists: true, $ne: '' } } },
    { $count: 'downloads' },
  ]);

  res.json({
    sales,
    userCount,
    orderCount,
    bookCount,
    downloadCount: downloadCount[0]?.downloads || 0,
    topBooks,
  });
});

export default router;
