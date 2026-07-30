import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { Role } from '@prisma/client';
import {
  getMachines,
  createMachine,
  updateMachineStatus,
  createMaintenanceLog,
  getMaintenanceLogs
} from '../controllers/machines.controller.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Machine routes
router.get('/', getMachines);
router.post('/', requireRole([Role.ADMIN, Role.PRODUCTION_MANAGER]), createMachine);
router.patch('/:id/status', requireRole([Role.ADMIN, Role.PRODUCTION_MANAGER]), updateMachineStatus);

// Maintenance Log routes
router.get('/maintenance-logs', getMaintenanceLogs);
router.post('/maintenance-logs', requireRole([Role.ADMIN, Role.PRODUCTION_MANAGER]), createMaintenanceLog);

export default router;
