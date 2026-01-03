import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isEmailVerified: { type: Boolean, required: true, default: true },
    googleId: { type: String },
    githubId: { type: String },
    // Extended Profile Fields
    username: { type: String },
    avatar: { type: String, default: '/images/default-avatar.png' },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say', ''] },
    bio: { type: String },
    address: { type: String },
    // Password reset fields
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    // Preferences
    readingPreferences: {
      genres: [String],
      authors: [String],
    },
    // Membership
    loyaltyPoints: { type: Number, default: 0 },
    membershipTier: { type: String, default: 'Bronze', enum: ['Bronze', 'Silver', 'Gold', 'Platinum'] },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;