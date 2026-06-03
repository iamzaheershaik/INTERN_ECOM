import express from 'express';
import {
  createProduct,
  getCategories,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadImage, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();


router.post('/', authenticate, authorize('admin'), uploadImage, uploadToCloudinary, createProduct);

// GET /api/products - Get paginated list of products (Public)
router.get('/', getProducts);

// GET /api/products/categories - Get distinct list of product categories (Public)
router.get('/categories', getCategories);

// GET /api/products/:id - Get single product details (Public)
router.get('/:id', getProductById);

// PUT /api/products/:id - Update product details (Admin only)
router.put('/:id', authenticate, authorize('admin'), uploadImage, uploadToCloudinary, updateProduct);


// DELETE /api/products/:id - Soft-delete product (Admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default router;
