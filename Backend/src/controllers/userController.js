import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

// GET /api/users
// Access: Admin only
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
// Access: Admin or the user themselves
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the requester is the user themselves or an admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      throw new AppError(403, 'FORBIDDEN', 'Access denied to this profile');
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id
// Access: Admin or the user themselves
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, role, isActive } = req.body;

    // Check if the requester is the user themselves or an admin
    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user._id.toString() === id;

    if (!isAdmin && !isSelf) {
      throw new AppError(403, 'FORBIDDEN', 'Access denied to update this profile');
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    // Update basic fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;

    // Only Admin can update role and isActive status
    if (isAdmin) {
      if (role !== undefined) user.role = role;
      if (isActive !== undefined) user.isActive = isActive;
    } else {
      if (role !== undefined || isActive !== undefined) {
        throw new AppError(403, 'FORBIDDEN', 'Only administrators can update role or status');
      }
    }

    await user.save();

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id
// Access: Admin only
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    res.json({
      data: {
        message: 'User deleted successfully',
      },
    });
  } catch (error) {
    next(error);
  }
};
