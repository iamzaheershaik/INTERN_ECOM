import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { AppError } from '../middleware/errorHandler.js';

// GET /api/admin/dashboard
// Access: Admin only
export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Total users count
    const totalUsers = await User.countDocuments();

    // 2. Total active products count (pre-find hook handles excluding isDeleted)
    const totalProducts = await Product.countDocuments();

    // 3. Total orders count
    const totalOrders = await Order.countDocuments();

    // 4. Total revenue (using MongoDB Aggregation Framework)
    const revenueAggregate = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);
    const totalRevenue = revenueAggregate.length > 0 ? revenueAggregate[0].totalRevenue : 0;

    // 5. Fetch top 5 recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'firstName lastName email')
      .sort('-createdAt')
      .limit(5);

    res.json({
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
        },
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
// Access: Admin only — list all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/role
// Access: Admin only — promote or demote a user
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return next(new AppError(400, 'VALIDATION_ERROR', "Role must be 'user' or 'admin'"));
    }

    // Prevent admin from changing their own role
    if (req.params.id === req.user._id.toString()) {
      return next(new AppError(400, 'BAD_REQUEST', 'You cannot change your own role'));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return next(new AppError(404, 'NOT_FOUND', 'User not found'));
    }

    res.json({
      success: true,
      message: `User role updated to '${role}' successfully`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
