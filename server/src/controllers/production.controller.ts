import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { OrderStatus, Priority } from '@prisma/client';

export const getProductionOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, priority } = req.query;

    const where: any = {};
    if (status) where.status = status as OrderStatus;
    if (priority) where.priority = priority as Priority;

    const orders = await prisma.productionOrder.findMany({
      where,
      include: {
        machine: true,
        inspections: true,
        steps: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    console.error('Fetch production orders error:', error);
    return res.status(500).json({ error: 'Failed to fetch production orders' });
  }
};

export const createProductionOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productName, targetQuantity, priority, machineId, dueDate } = req.body;

    if (!productName || !targetQuantity) {
      return res.status(400).json({ error: 'Product name and target quantity are required' });
    }

    const orderCount = await prisma.productionOrder.count();
    const orderNumber = `PRD-2026-${String(orderCount + 101).padStart(3, '0')}`;

    const newOrder = await prisma.productionOrder.create({
      data: {
        orderNumber,
        productName,
        targetQuantity: Number(targetQuantity),
        priority: priority || Priority.MEDIUM,
        machineId: machineId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: OrderStatus.PENDING
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'CREATE_PRODUCTION_ORDER',
        entity: 'ProductionOrder',
        entityId: newOrder.id,
        metadata: JSON.stringify({ orderNumber, productName, targetQuantity })
      }
    });

    return res.status(201).json({ message: 'Production order created', order: newOrder });
  } catch (error) {
    console.error('Create production order error:', error);
    return res.status(500).json({ error: 'Failed to create production order' });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { status, completedQuantity } = req.body;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Production order id is required' });
    }

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ error: 'Valid OrderStatus is required' });
    }

    const existing = await prisma.productionOrder.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Production order not found' });
    }

    const updateData: any = { status };
    if (completedQuantity !== undefined) {
      updateData.completedQuantity = Number(completedQuantity);
    }
    if (status === OrderStatus.IN_PROGRESS && !existing.startDate) {
      updateData.startDate = new Date();
    }

    const updated = await prisma.productionOrder.update({
      where: { id },
      data: updateData
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'UPDATE_PRODUCTION_ORDER_STATUS',
        entity: 'ProductionOrder',
        entityId: id,
        metadata: JSON.stringify({ prevStatus: existing.status, newStatus: status })
      }
    });

    return res.status(200).json({ message: 'Order status updated', order: updated });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
};
