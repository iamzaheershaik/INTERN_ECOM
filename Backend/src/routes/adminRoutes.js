import express from 'express';
import { getDashboardStats, getAllUsers, updateUserRole } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication + admin role
const adminGuard = [authenticate, authorize('admin')];

// GET  /api/admin/dashboard        - Dashboard stats
router.get('/dashboard', ...adminGuard, getDashboardStats);

// GET  /api/admin/users            - List all users
router.get('/users', ...adminGuard, getAllUsers);

// PATCH /api/admin/users/:id/role  - Promote or demote a user
router.patch('/users/:id/role', ...adminGuard, updateUserRole);

export default router;
