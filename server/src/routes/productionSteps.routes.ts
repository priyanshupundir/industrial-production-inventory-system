import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { Role } from '@prisma/client';
import {
  getProductionSteps,
  createProductionStep,
  updateProductionStep,
  deleteProductionStep,
  createStepsForOrder
} from '../controllers/productionSteps.controller.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Production Step routes
router.get('/', getProductionSteps);
router.post('/', requireRole([Role.ADMIN, Role.PRODUCTION_MANAGER]), createProductionStep);
router.post('/batch', requireRole([Role.ADMIN, Role.PRODUCTION_MANAGER]), createStepsForOrder);
router.patch('/:id', requireRole([Role.ADMIN, Role.PRODUCTION_MANAGER]), updateProductionStep);
router.delete('/:id', requireRole([Role.ADMIN, Role.PRODUCTION_MANAGER]), deleteProductionStep);

export default router;
