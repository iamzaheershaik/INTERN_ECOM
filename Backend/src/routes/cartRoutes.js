import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all cart routes
router.use(authenticate);

// GET /api/cart - Get user's cart
router.get('/', getCart);

// POST /api/cart/add - Add Cart to Product
router.post('/add', addToCart);

// PUT /api/cart/update - Update the cart in product
router.put('/update', updateCartItem);

// DELETE /api/cart/remove/:id - Remove item from cart (id is productId)
router.delete('/remove/:id', removeFromCart);

export default router;
