import express from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all order routes
router.use(authenticate);

// POST /api/orders - Create an order (Checkout cart)
router.post('/', createOrder);

// GET /api/orders - Get orders (Admin gets all, User gets self list)
router.get('/', getOrders);

// GET /api/orders/:id - Get specific order details (Admin or buyer only)
router.get('/:id', getOrderById);

export default router;
