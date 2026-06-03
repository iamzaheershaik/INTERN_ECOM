import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';

// POST /api/products
// Access: Admin only
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, category, image, status } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      category,
      image,
      status,
    });

    res.status(201).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/categories
// Access: Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isDeleted: { $ne: true } });
    res.json({
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products
// Access: Public
export const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search, category, sort } = req.query;

    const query = {};

    // Filter by Category
    if (category) {
      query.category = category;
    }

    // Search by name or category (case-insensitive regex)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build query builder
    let queryBuilder = Product.find(query);

    // Sorting
    if (sort) {
      // E.g. sort=price (asc), sort=-price (desc)
      const sortBy = sort.split(',').join(' ');
      queryBuilder = queryBuilder.sort(sortBy);
    } else {
      queryBuilder = queryBuilder.sort('-createdAt'); // Default: newest first
    }

    // Execute query
    const products = await queryBuilder.skip(skip).limit(limitNum);

    // Get total document count for pagination info
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);

    res.json({
      data: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
// Access: Public
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      throw new AppError(404, 'NOT_FOUND', 'Product not found');
    }

    res.json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
// Access: Admin only
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, category, image, status } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      throw new AppError(404, 'NOT_FOUND', 'Product not found');
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;
    if (category !== undefined) product.category = category;
    if (image !== undefined) product.image = image;
    if (status !== undefined) product.status = status;

    await product.save();

    res.json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
// Access: Admin only
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      throw new AppError(404, 'NOT_FOUND', 'Product not found');
    }

    // Soft delete 
    product.isDeleted = true;
    product.status = 'inactive';
    await product.save();

    res.json({
      data: {
        message: 'Product soft-deleted successfully',
      },
    });
  } catch (error) {
    next(error);
  }
};
