import asyncHandler from '../middleware/asyncHandler.js';
import Book from '../models/Book.js';
import fs from 'fs';
import path from 'path';

// @desc    Fetch all books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  // Advanced filter params
  const {
    keyword,
    author,
    category,
    language,
    minPrice,
    maxPrice,
    pageNumber,
  } = req.query;

  let filter = {};

  // Keyword search (name, category, brand, description)
  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } },
      { brand: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  // Author (brand)
  if (author) {
    filter.brand = { $regex: author, $options: 'i' };
  }

  // Category
  if (category) {
    filter.category = { $regex: category, $options: 'i' };
  }

  // Language
  if (language) {
    filter.language = { $regex: language, $options: 'i' };
  }

  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Pagination
  if (pageNumber) {
    const pageSize = 5;
    const page = Number(pageNumber) || 1;

    const count = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ books, page, pages: Math.ceil(count / pageSize) });
  } else {
    const books = await Book.find(filter);
    res.json(books);
  }
});

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    return res.json(book);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    description,
    isbn,
    publisher,
    language,
    pages,
    publishedDate,
    fileUrl,
    previewUrl,
  } = req.body;

  // Check if all required fields are present
  if (!name || !price || !brand || !category || !description) {
    // Fallback for backward compatibility or if user wants to create sample
    if (Object.keys(req.body).length === 0) {
       const book = new Book({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
      });
      const createdBook = await book.save();
      return res.status(201).json(createdBook);
    } else {
      res.status(400);
      throw new Error('Please fill all required fields');
    }
  }

  const book = new Book({
    name,
    price,
    user: req.user._id,
    image: image || '/images/sample.jpg',
    brand,
    category,
    countInStock: countInStock || 0,
    numReviews: 0,
    description,
    isbn,
    publisher,
    language,
    pages,
    publishedDate,
    fileUrl,
    previewUrl,
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    isbn,
    publisher,
    language,
    pages,
    publishedDate,
    fileUrl,
    previewUrl,
  } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.name = name;
    book.price = price;
    book.description = description;
    book.image = image;
    book.brand = brand;
    book.category = category;
    book.countInStock = countInStock;
    book.isbn = isbn;
    book.publisher = publisher;
    book.language = language;
    book.pages = pages;
    book.publishedDate = publishedDate;
    book.fileUrl = fileUrl;
    book.previewUrl = previewUrl;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    // Delete associated image if it's not the sample image
    if (book.image && book.image !== '/images/sample.jpg' && !book.image.startsWith('http')) {
      const imagePath = path.join('frontend/public', book.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete associated PDF file
    if (book.fileUrl && !book.fileUrl.startsWith('http')) {
      const filePath = path.join('frontend/public', book.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Book.deleteOne({ _id: book._id });
    res.json({ message: 'Book removed' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Create new review
// @route   POST /api/books/:id/reviews
// @access  Private
const createBookReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    const alreadyReviewed = book.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Book already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    book.reviews.push(review);

    book.numReviews = book.reviews.length;

    book.rating =
      book.reviews.reduce((acc, item) => item.rating + acc, 0) /
      book.reviews.length;

    await book.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Delete review
// @route   DELETE /api/books/:id/reviews/:reviewId
// @access  Private/Admin
const deleteBookReview = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    const review = book.reviews.find(
      (r) => r._id.toString() === req.params.reviewId.toString()
    );

    if (review) {
      book.reviews = book.reviews.filter(
        (r) => r._id.toString() !== req.params.reviewId.toString()
      );

      book.numReviews = book.reviews.length;

      book.rating =
        book.reviews.length > 0
          ? book.reviews.reduce((acc, item) => item.rating + acc, 0) /
            book.reviews.length
          : 0;

      await book.save();
      res.json({ message: 'Review removed' });
    } else {
      res.status(404);
      throw new Error('Review not found');
    }
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

export {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  createBookReview,
  deleteBookReview,
};