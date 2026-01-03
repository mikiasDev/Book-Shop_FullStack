
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();
// No need to call cloudinary.config() if CLOUDINARY_URL is set in env

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mern-bookstore',
    allowed_formats: ['jpeg', 'png', 'jpg'],
  },
});

const upload = multer({ storage });

export default upload;