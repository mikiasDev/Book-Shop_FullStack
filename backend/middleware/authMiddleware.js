import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/User.js';
import Staff from '../models/Staff.js';

// Protect routes (User or Staff)
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Try User first
      let user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        // Try Staff
        user = await Staff.findById(decoded.userId).select('-password');
        if (user) user.isAdmin = user.role === 'admin';
      }
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin middleware (User.isAdmin or Staff.role === 'admin')
const admin = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as admin');
  }
};

// Staff or Admin middleware (User.isAdmin or Staff.role === 'admin'|'manager'|'support')
const staffOrAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.isAdmin || req.user.role === 'admin' || req.user.role === 'manager' || req.user.role === 'support')
  ) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as staff or admin');
  }
};

export { protect, admin, staffOrAdmin };