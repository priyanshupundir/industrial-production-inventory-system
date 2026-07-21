import { Router } from 'express';
import { getProductionOrders, createProductionOrder, updateOrderStatus } from '../controllers/production.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', authenticateToken, getProductionOrders);
router.post('/', authenticateToken, requireRole([Role.ADMIN, Role.PRODUCTION_MANAGER]), createProductionOrder);
router.patch('/:id/status', authenticateToken, requireRole([Role.ADMIN, Role.PRODUCTION_MANAGER, Role.QUALITY_INSPECTOR]), updateOrderStatus);

export default router;
