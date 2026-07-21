import { Router } from 'express';
import { getInventoryItems, updateStockQuantity } from '../controllers/inventory.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', authenticateToken, getInventoryItems);
router.patch('/:id/stock', authenticateToken, requireRole([Role.ADMIN, Role.STORE_OFFICER, Role.PRODUCTION_MANAGER]), updateStockQuantity);

export default router;
