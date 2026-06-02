import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from './errorHandler.js';

// Verify JWT and attach user to req
export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError(401, 'UNAUTHENTICATED', 'Missing or invalid token');
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new AppError(401, 'UNAUTHENTICATED', 'User not found or deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.isOperational) return next(error);
    next(new AppError(401, 'UNAUTHENTICATED', 'Token expired or invalid'));
  }
};

// Role-based authorization — takes allowed roles as arguments
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, 'FORBIDDEN', 'Insufficient permissions'));
    }
    next();
  };
};
