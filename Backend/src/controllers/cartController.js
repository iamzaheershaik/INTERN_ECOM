import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';

// GET /api/cart
// Access: Authenticated User
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    res.json({
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/cart/add
// Access: Authenticated User
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Product ID is required');
    }

    if (quantity <= 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Quantity must be greater than 0');
    }

    // Verify product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError(404, 'NOT_FOUND', 'Product not found');
    }

    // Check available stock
    if (product.quantity < quantity) {
      throw new AppError(400, 'INSUFFICIENT_STOCK', `Insufficient stock. Only ${product.quantity} units available.`);
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      
      // Check stock for combined quantity
      if (product.quantity < newQuantity) {
        throw new AppError(400, 'INSUFFICIENT_STOCK', `Cannot add. Total cart quantity (${newQuantity}) exceeds available stock (${product.quantity}).`);
      }
      
      cart.items[itemIndex].quantity = newQuantity;
      cart.items[itemIndex].price = product.price; // Update price snapshot in cart
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json({
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/cart/update
// Access: Authenticated User
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Product ID and quantity are required');
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex === -1) {
      throw new AppError(404, 'NOT_FOUND', 'Product not found in cart');
    }

    // If quantity is 0 or less, remove the item
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Verify product exists and check stock levels
      const product = await Product.findById(productId);
      if (!product) {
        throw new AppError(404, 'NOT_FOUND', 'Product not found');
      }

      if (product.quantity < quantity) {
        throw new AppError(400, 'INSUFFICIENT_STOCK', `Insufficient stock. Only ${product.quantity} units available.`);
      }

      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = product.price; // Update price snapshot
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json({
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/remove/:id
// Access: Authenticated User
export const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params; // Product ID

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== id);

    await cart.save();
    await cart.populate('items.productId');

    res.json({
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
