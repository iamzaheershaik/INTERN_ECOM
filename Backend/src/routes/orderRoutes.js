import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();


router.use(authenticate);

// POST /api/orders - Create an order (Checkout cart)
router.post('/', createOrder);

// GET /api/orders - Get orders (Admin gets all, User gets self history)
router.get('/', getOrders);

// GET /api/orders/:id - Get specific order details (Admin or buyer only)
router.get('/:id', getOrderById);

// PATCH /api/orders/:id/status - Update order status (Admin only)
router.patch('/:id/status', authorize('admin'), updateOrderStatus);

export default router;
