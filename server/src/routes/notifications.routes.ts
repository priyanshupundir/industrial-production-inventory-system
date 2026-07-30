import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { Role } from '@prisma/client';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
  getUnreadCount
} from '../controllers/notifications.controller.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Notification routes
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
// read-all must come before /:id to prevent Express matching "read-all" as :id
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.post('/', requireRole([Role.ADMIN, Role.PRODUCTION_MANAGER]), createNotification);
router.delete('/:id', deleteNotification);

export default router;
