// @desc    Update author name (all books)
// @route   PUT /api/authors/:name
// @access  Private/Admin
const updateAuthor = asyncHandler(async (req, res) => {
  const oldName = req.params.name;
  const { name: newName } = req.body;
  if (!newName) {
    res.status(400);
    throw new Error('New author name is required');
  }
  const result = await Book.updateMany({ brand: oldName }, { $set: { brand: newName } });
  res.json({ message: 'Author updated', modifiedCount: result.modifiedCount });
});
import asyncHandler from '../middleware/asyncHandler.js';
import Book from '../models/Book.js';

// @desc    Get paginated authors
// @route   GET /api/authors
// @access  Private/Admin
const getAuthors = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 5;
  const page = Number(req.query.pageNumber) || 1;

  // Aggregate authors from books
  const authorsAgg = await Book.aggregate([
    { $group: { _id: '$brand', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const count = authorsAgg.length;
  const authors = authorsAgg.slice((page - 1) * pageSize, page * pageSize);

  res.json({
    authors: authors.map(a => ({ name: a._id, count: a.count })),
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

export { getAuthors, updateAuthor };
