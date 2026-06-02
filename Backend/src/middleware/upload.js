import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import { AppError } from './errorHandler.js';

// Setup multer memory storage to keep uploads in memory buffer
const storage = multer.memoryStorage();

// File filter to allow only image mime-types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError(400, 'INVALID_FILE_TYPE', 'Only image files are allowed!'), false);
  }
};
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});


export const uploadImage = upload.single('image');


export const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }


    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'ecommerce_products',
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        Readable.from(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    
  
    req.body.image = result.secure_url;
    req.cloudinaryId = result.public_id; 
    
    next();
  } catch (error) {
    next(new AppError(500, 'UPLOAD_FAILED', `Cloudinary upload failed: ${error.message}`));
  }
};
