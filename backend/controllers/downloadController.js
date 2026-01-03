import path from 'path';
import Book from '../models/Book.js';
import Order from '../models/Order.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Download book file if user has purchased
// @route   GET /api/download/book/:bookId
// @access  Private
const downloadBookFile = asyncHandler(async (req, res) => {
  // Only allow download if user has a paid and delivered order for this book
  const Book = (await import('../models/Book.js')).default;
  const Order = (await import('../models/Order.js')).default;
  const bookId = req.params.bookId;
  const userId = req.user._id;
  // Find an order for this user that contains this book and is paid and delivered
  const order = await Order.findOne({
    user: userId,
    isPaid: true,
    isDelivered: true,
    'orderItems.product': bookId,
  });
  if (!order) {
    res.status(403);
    throw new Error('You must purchase and receive this book to download it.');
  }
  const book = await Book.findById(bookId);
  let filePath, filename;
  if (book && book.fileUrl) {
    filePath = path.resolve('uploads/books', book.fileUrl);
    filename = book.fileUrl;
    // Check if file exists
    const fs = await import('fs');
    if (!fs.existsSync(filePath)) {
      filePath = path.resolve('uploads/books/alexander-hamilton.pdf');
      filename = 'sample.pdf';
    }
  } else {
    filePath = path.resolve('uploads/books/alexander-hamilton.pdf');
    filename = 'sample.pdf';
  }
  res.download(filePath, filename);
});

export { downloadBookFile };
