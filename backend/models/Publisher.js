import mongoose from 'mongoose';

const publisherSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String },
}, { timestamps: true });

const Publisher = mongoose.model('Publisher', publisherSchema);
export default Publisher;
