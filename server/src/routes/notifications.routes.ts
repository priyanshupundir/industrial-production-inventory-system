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
router.get('/notifications', getNotifications);
router.get('/notifications/unread-count', getUnreadCount);
router.patch('/notifications/:id/read', markAsRead);
router.patch('/notifications/read-all', markAllAsRead);
router.post('/notifications', requireRole([Role.ADMIN, Role.PRODUCTION_MANAGER]), createNotification);
router.delete('/notifications/:id', deleteNotification);

export default router;
