import mongoose from 'mongoose';


const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


// Pre-validate hook to always generate a valid slug from name
categorySchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = this.name
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  if (!this.slug || this.slug.trim() === '') {
    return next(new Error('Category slug is required and must be generated from name.'));
  }
  next();
});

// Ensure slug is always unique and required
categorySchema.path('slug').validate(async function(value) {
  if (!value || value.trim() === '') return false;
  const count = await this.constructor.countDocuments({ slug: value, _id: { $ne: this._id } });
  return count === 0;
}, 'Slug must be unique and non-empty.');

const Category = mongoose.model('Category', categorySchema);

export default Category;