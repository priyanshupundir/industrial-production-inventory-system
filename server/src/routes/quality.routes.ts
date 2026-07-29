import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { Role } from '@prisma/client';
import {
  getQualityInspections,
  createQualityInspection,
  updateQualityInspection,
  getInspectionStats
} from '../controllers/quality.controller.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Quality Inspection routes
router.get('/inspections', getQualityInspections);
router.get('/inspections/stats', getInspectionStats);
router.post('/inspections', requireRole([Role.ADMIN, Role.QUALITY_INSPECTOR, Role.PRODUCTION_MANAGER]), createQualityInspection);
router.patch('/inspections/:id', requireRole([Role.ADMIN, Role.QUALITY_INSPECTOR]), updateQualityInspection);

export default router;
