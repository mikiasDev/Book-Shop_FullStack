// @desc    Get staff profile (self)
// @route   GET /api/staff/profile
// @access  Private (staff or admin)
const getStaffProfile = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  const staff = await Staff.findById(req.user._id || req.user.id);
  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }
  res.json({
    _id: staff._id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    status: staff.status,
    profileImage: staff.profileImage,
    createdAt: staff.createdAt,
    updatedAt: staff.updatedAt,
  });
});

// @desc    Update staff profile (self)
// @route   PUT /api/staff/profile
// @access  Private (staff or admin)
const updateStaffProfile = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.user._id || req.user.id);
  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }
  staff.name = req.body.name || staff.name;
  staff.email = req.body.email || staff.email;
  if (req.body.password) {
    staff.password = req.body.password;
  }
  if (req.file && req.file.path) {
    staff.profileImage = req.file.path;
  }
  staff.updatedAt = Date.now();
  await staff.save();
  res.json({
    _id: staff._id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    status: staff.status,
    profileImage: staff.profileImage,
    createdAt: staff.createdAt,
    updatedAt: staff.updatedAt,
  });
});
import asyncHandler from '../middleware/asyncHandler.js';
import Staff from '../models/Staff.js';
import generateToken from '../utils/generateToken.js';
// @desc    Staff Login
// @route   POST /api/staff/login
// @access  Public
const loginStaff = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }
  // Password validation (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    res.status(400);
    throw new Error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
  }
  const staff = await Staff.findOne({ email });
  if (staff && (await staff.matchPassword(password))) {
    generateToken(res, staff._id);
    res.json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      status: staff.status,
      profileImage: staff.profileImage,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
// Password strength validation helper
function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

// @desc    Staff Forgot Password - send reset link
// @route   POST /api/staff/forgot-password
// @access  Public
const forgotStaffPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const staff = await Staff.findOne({ email });
  if (!staff) {
    res.status(404);
    throw new Error('No staff found with that email');
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  staff.passwordResetToken = resetTokenHash;
  staff.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await staff.save();
  const resetUrl = `${process.env.FRONTEND_URL}/staff/reset-password/${resetToken}`;
  const message = `
    <h1>Password Reset</h1>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p>If you did not request this, please ignore this email.</p>
  `;
  try {
    await sendEmail({
      email: staff.email,
      subject: 'Staff Password Reset Request',
      message: message,
      html: message,
    });
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    staff.passwordResetToken = undefined;
    staff.passwordResetExpires = undefined;
    await staff.save();
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Staff Reset Password
// @route   POST /api/staff/reset-password/:token
// @access  Public
const resetStaffPassword = asyncHandler(async (req, res) => {
  const resetTokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const staff = await Staff.findOne({
    passwordResetToken: resetTokenHash,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!staff) {
    res.status(400);
    throw new Error('Invalid or expired password reset token');
  }
  if (!isStrongPassword(req.body.password)) {
    res.status(400);
    throw new Error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
  }
  staff.password = req.body.password;
  staff.passwordResetToken = undefined;
  staff.passwordResetExpires = undefined;
  await staff.save();
  res.json({ message: 'Password has been reset successfully' });
});
// For file upload
import upload from '../config/cloudinary.js';

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private/Admin
const getStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.find({});
  res.json(staff);
});

// @desc    Add staff
// @route   POST /api/staff
// @access  Private/Admin
const addStaff = asyncHandler(async (req, res) => {
  // If using multer, req.file will be available
  const { name, email, role, status } = req.body;
  let profileImage = '';
  if (req.file && req.file.path) {
    profileImage = req.file.path;
  }
  const exists = await Staff.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Staff with this email already exists');
  }
  const staff = await Staff.create({ name, email, role, status, profileImage });
  res.status(201).json(staff);
});

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private/Admin
const updateStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }
  staff.name = req.body.name || staff.name;
  staff.email = req.body.email || staff.email;
  staff.role = req.body.role || staff.role;
  staff.status = req.body.status || staff.status;
  if (req.file && req.file.path) {
    staff.profileImage = req.file.path;
  }
  staff.updatedAt = Date.now();
  await staff.save();
  res.json(staff);
});

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private/Admin
const deleteStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }
  await staff.deleteOne();
  res.json({ message: 'Staff deleted' });
});

export { getStaff, addStaff, updateStaff, deleteStaff, forgotStaffPassword, resetStaffPassword, loginStaff, getStaffProfile, updateStaffProfile };
