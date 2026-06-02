import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';

// POST /api/orders
// Access: Authenticated User (Checkout)
export const createOrder = async (req, res, next) => {
  try {
    // 1. Fetch user's cart
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Your cart is empty');
    }

    // 2. Validate stock levels for all items in cart first
    for (const item of cart.items) {
      const product = item.productId;
      if (!product || product.isDeleted) {
        throw new AppError(400, 'VALIDATION_ERROR', `Product with ID ${item.productId} is no longer available.`);
      }

      if (product.quantity < item.quantity) {
        throw new AppError(400, 'INSUFFICIENT_STOCK', `Insufficient stock for product "${product.name}". Only ${product.quantity} units available.`);
      }
    }

    // 3. Subtract quantities from product stock levels and build order items
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.productId;

      // Decrement stock
      product.quantity -= item.quantity;
      await product.save();

      // Push to order list with current snapshot price/name
      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    // 4. Create the Order
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      status: 'pending',
    });

    // 5. Clear the user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders
// Access: Authenticated User (self history) / Admin (all system orders)
export const getOrders = async (req, res, next) => {
  try {
    let orders;

    if (req.user.role === 'admin') {
      // Admins see all orders in reverse chronological order, with buyer details populated
      orders = await Order.find()
        .populate('userId', 'firstName lastName email')
        .sort('-createdAt');
    } else {
      // Standard users only see their own order history
      orders = await Order.find({ userId: req.user._id })
        .sort('-createdAt');
    }

    res.json({
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
// Access: Authenticated User (owner) / Admin (any order)
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('userId', 'firstName lastName email');
    if (!order) {
      throw new AppError(404, 'NOT_FOUND', 'Order not found');
    }

    // Access check: must be admin or the order owner
    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user._id.toString()) {
      throw new AppError(403, 'FORBIDDEN', 'Access denied to this order details');
    }

    res.json({
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
