import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users - Get all users (Admin only)
router.get('/', authenticate, authorize('admin'), getUsers);

// GET /api/users/:id - Get single user (Admin or user themselves)
router.get('/:id', authenticate, getUserById);

// PUT /api/users/:id - Update user (Admin or user themselves)
router.put('/:id', authenticate, updateUser);

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;
