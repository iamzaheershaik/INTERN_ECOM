import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

// Helper: generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, phone } = req.body;

    if (password !== confirmPassword) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Passwords do not match');
    }

    const user = await User.create({ firstName, lastName, email, password, phone });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Email and password are required');
    }

    // +password because select: false in schema
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new AppError(403, 'FORBIDDEN', 'Account is deactivated. Contact admin.');
    }

    const token = generateToken(user._id, user.role);

    res.json({
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return 200 — don't reveal if email exists
    if (!user) {
      return res.json({ data: { message: 'If that email exists, a reset link has been sent' } });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    
    console.log(`\n📧 PASSWORD RESET TOKEN for ${email}: ${resetToken}\n`);

    res.json({ data: { message: 'If that email exists, a reset link has been sent' } });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Token and new password are required');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError(400, 'INVALID_TOKEN', 'Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ data: { message: 'Password reset successful' } });
  } catch (error) {
    next(error);
  }
};
