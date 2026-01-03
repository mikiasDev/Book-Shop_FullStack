import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js'; // We will create this small file too
import books from './data/books.js';
import User from './models/User.js';
import Book from './models/Book.js'; 
import Order from './models/Order.js';
import connectDB from './config/database.js';

dotenv.config();

// Connect to DB
const connect = async () => {
  await connectDB();
};
connect();

const importData = async () => {
  try {
    // 1. Wipe existing data
    await Order.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    // 2. Create Users
    const createdUsers = await User.insertMany(users);
    
    // 3. Get the Admin User ID (First user in our list will be admin)
    const adminUser = createdUsers[0]._id;

    // 4. Add the Admin ID to every book
    const sampleBooks = books.map((book) => {
      return { ...book, user: adminUser };
    });

    // 5. Insert Books
    await Book.insertMany(sampleBooks);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}