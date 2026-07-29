import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getSuppliers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        purchaseOrders: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ count: suppliers.length, suppliers });
  } catch (error) {
    console.error('Fetch suppliers error:', error);
    return res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};

export const createSupplier = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, code, contactEmail, phone, address } = req.body;

    if (!name || !code || !contactEmail) {
      return res.status(400).json({ error: 'Name, code, and contact email are required' });
    }

    const existing = await prisma.supplier.findUnique({ where: { code } });
    if (existing) {
      return res.status(409).json({ error: 'Supplier code already exists' });
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        name,
        code,
        contactEmail,
        phone: phone || null,
        address: address || null
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'CREATE_SUPPLIER',
        entity: 'Supplier',
        entityId: newSupplier.id,
        metadata: JSON.stringify({ name, code })
      }
    });

    return res.status(201).json({ message: 'Supplier created', supplier: newSupplier });
  } catch (error) {
    console.error('Create supplier error:', error);
    return res.status(500).json({ error: 'Failed to create supplier' });
  }
};

export const getPurchaseOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) where.status = status as string;

    const orders = await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    console.error('Fetch purchase orders error:', error);
    return res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
};

export const createPurchaseOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { supplierId, itemsJson, totalAmount, expectedDate } = req.body;

    if (!supplierId || !itemsJson) {
      return res.status(400).json({ error: 'Supplier ID and items are required' });
    }

    const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const poCount = await prisma.purchaseOrder.count();
    const poNumber = `PO-2026-${String(poCount + 801).padStart(3, '0')}`;

    const newPO = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId,
        itemsJson: typeof itemsJson === 'string' ? itemsJson : JSON.stringify(itemsJson),
        totalAmount: Number(totalAmount) || 0,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        status: 'PENDING'
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'CREATE_PURCHASE_ORDER',
        entity: 'PurchaseOrder',
        entityId: newPO.id,
        metadata: JSON.stringify({ poNumber, supplierId, totalAmount })
      }
    });

    return res.status(201).json({ message: 'Purchase order created', order: newPO });
  } catch (error) {
    console.error('Create purchase order error:', error);
    return res.status(500).json({ error: 'Failed to create purchase order' });
  }
};

export const updatePurchaseOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Purchase order ID is required' });
    }

    const validStatuses = ['PENDING', 'ORDERED', 'RECEIVED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const existing = await prisma.purchaseOrder.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    const updated = await prisma.purchaseOrder.update({
      where: { id },
      data: { status }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'UPDATE_PURCHASE_ORDER_STATUS',
        entity: 'PurchaseOrder',
        entityId: id,
        metadata: JSON.stringify({ prevStatus: existing.status, newStatus: status })
      }
    });

    return res.status(200).json({ message: 'Purchase order status updated', order: updated });
  } catch (error) {
    console.error('Update purchase order status error:', error);
    return res.status(500).json({ error: 'Failed to update purchase order status' });
  }
};
