import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { unreadOnly } = req.query;

    const where: any = { userId: req.user!.userId };
    if (unreadOnly === 'true') where.isRead = false;

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ count: notifications.length, notifications });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Notification ID is required' });
    }

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== req.user!.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    return res.status(200).json({ message: 'Notification marked as read', notification: updated });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user!.userId,
        isRead: false
      },
      data: { isRead: true }
    });

    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

export const createNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, title, message, type } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ error: 'User ID, title, and message are required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: type || 'INFO'
      }
    });

    return res.status(201).json({ message: 'Notification created', notification });
  } catch (error) {
    console.error('Create notification error:', error);
    return res.status(500).json({ error: 'Failed to create notification' });
  }
};

export const deleteNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Notification ID is required' });
    }

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== req.user!.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.notification.delete({ where: { id } });

    return res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(500).json({ error: 'Failed to delete notification' });
  }
};

export const getUnreadCount = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId: req.user!.userId,
        isRead: false
      }
    });

    return res.status(200).json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    return res.status(500).json({ error: 'Failed to get unread count' });
  }
};
