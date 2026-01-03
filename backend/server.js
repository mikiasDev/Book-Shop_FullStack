import passwordRoutes from './routes/passwordRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from './config/passport.js';
import connectDB from './config/database.js'; 
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import generateToken from './utils/generateToken.js';
import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import publisherRoutes from './routes/publisherRoutes.js';

// Connect to Database and start server only after successful connection
const app = express();
connectDB().then(() => {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('Failed to connect to MongoDB. Server not started.');
});

// CORS middleware to allow frontend requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());
app.use(cookieParser());

// OAuth routes
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'placeholder') {
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }), (req, res) => {
    generateToken(res, req.user._id);
    res.redirect(process.env.FRONTEND_URL);
  });
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'placeholder') {
  app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }), (req, res) => {
    generateToken(res, req.user._id);
    res.redirect(process.env.FRONTEND_URL);
  });
}

// Routes

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/publishers', publisherRoutes);

import downloadRoutes from './routes/downloadRoutes.js';
import uploadBookRoutes from './routes/uploadBookRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/upload/book', uploadBookRoutes);


// --- REQUIRED FOR FRONTEND PAYMENT ---
app.get('/api/config/stripe', (req, res) => {
  res.send({ 
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '' 
  });
});
// -------------------------------------


// Static Folder (serve backend/uploads for profile images, books, etc.)
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);
