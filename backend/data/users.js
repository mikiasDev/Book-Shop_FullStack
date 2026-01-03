import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'test@gmail.com',
    password: bcrypt.hashSync('Password@123', 10), // Encrypted password
    isAdmin: true,
    isEmailVerified: true,
  },
  {
    name: 'Alemu',
    email: 'alemu@gmail.com',
    password: bcrypt.hashSync('Password@123', 10),
    isAdmin: false,
    isEmailVerified: true,
  },
  {
    name: 'Abebe',
    email: 'abebe@gmail.com',
    password: bcrypt.hashSync('Password@123', 10),
    isAdmin: false,
    isEmailVerified: true,
  },
  {
    name: 'Mikias Mulu',
    email: 'mikiasmulu29@gmail.com',
    password: bcrypt.hashSync('Password@123', 10),
    isAdmin: false,
    isEmailVerified: true,
    avatar: '/images/mikiasmulu.png',
    loyaltyPoints: 0,
    membershipTier: 'Bronze',
    _id: '6956b1316d3c36e233887d69',
  },
];

export default users;