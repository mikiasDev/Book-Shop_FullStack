import mongoose from 'mongoose';

const staffActivitySchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  action: { type: String, required: true }, // e.g., 'created', 'updated', 'deleted'
  performedBy: { type: String }, // admin name/email
  details: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const StaffActivity = mongoose.model('StaffActivity', staffActivitySchema);
export default StaffActivity;
