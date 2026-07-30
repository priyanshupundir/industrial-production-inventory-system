import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getSuppliers,
  createSupplier,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus
} from '../controllers/suppliers.controller.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Supplier routes
router.get('/', getSuppliers);
router.post('/', createSupplier);

// Purchase Order routes
router.get('/purchase-orders', getPurchaseOrders);
router.post('/purchase-orders', createPurchaseOrder);
router.patch('/purchase-orders/:id/status', updatePurchaseOrderStatus);

export default router;
