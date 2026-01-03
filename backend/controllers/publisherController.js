import asyncHandler from '../middleware/asyncHandler.js';
import Publisher from '../models/Publisher.js';

// @desc    Get paginated publishers
// @route   GET /api/publishers
// @access  Private/Admin
const getPublishers = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 5;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Publisher.countDocuments();
  const publishers = await Publisher.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ name: 1 });
  res.json({ publishers, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Create a publisher
// @route   POST /api/publishers
// @access  Private/Admin
const createPublisher = asyncHandler(async (req, res) => {
  const { name, country } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Publisher name is required');
  }
  const exists = await Publisher.findOne({ name });
  if (exists) {
    res.status(400);
    throw new Error('Publisher already exists');
  }
  const publisher = new Publisher({ name, country });
  await publisher.save();
  res.status(201).json(publisher);
});

// @desc    Update a publisher
// @route   PUT /api/publishers/:id
// @access  Private/Admin
const updatePublisher = asyncHandler(async (req, res) => {
  const publisher = await Publisher.findById(req.params.id);
  if (!publisher) {
    res.status(404);
    throw new Error('Publisher not found');
  }
  publisher.name = req.body.name || publisher.name;
  publisher.country = req.body.country || publisher.country;
  await publisher.save();
  res.json(publisher);
});

// @desc    Delete a publisher
// @route   DELETE /api/publishers/:id
// @access  Private/Admin
const deletePublisher = asyncHandler(async (req, res) => {
  const publisher = await Publisher.findById(req.params.id);
  if (!publisher) {
    res.status(404);
    throw new Error('Publisher not found');
  }
  await publisher.remove();
  res.json({ message: 'Publisher removed' });
});

export { getPublishers, createPublisher, updatePublisher, deletePublisher };
