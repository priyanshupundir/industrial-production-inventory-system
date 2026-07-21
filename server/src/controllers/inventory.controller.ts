import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { TransactionType } from '@prisma/client';

export const getInventoryItems = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, search, lowStock } = req.query;

    const where: any = {};
    if (category) {
      where.category = category as any;
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { itemCode: { contains: search as string, mode: 'insensitive' } },
        { batchNumber: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const items = await prisma.inventory.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });

    const filteredItems = lowStock === 'true' 
      ? items.filter(item => item.quantity <= item.minThreshold)
      : items;

    return res.status(200).json({
      count: filteredItems.length,
      items: filteredItems
    });
  } catch (error) {
    console.error('Fetch inventory error:', error);
    return res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
};

export const updateStockQuantity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { type, quantity, referenceOrder, notes } = req.body;

    if (!type || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid transaction type and quantity are required' });
    }

    const item = await prisma.inventory.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    let newQuantity = item.quantity;
    if (type === TransactionType.STOCK_IN) {
      newQuantity += Number(quantity);
    } else if (type === TransactionType.STOCK_OUT) {
      if (item.quantity < Number(quantity)) {
        return res.status(400).json({ error: 'Insufficient stock quantity' });
      }
      newQuantity -= Number(quantity);
    } else if (type === TransactionType.ADJUSTMENT) {
      newQuantity = Number(quantity);
    }

    const updatedItem = await prisma.$transaction(async (tx) => {
      const inv = await tx.inventory.update({
        where: { id },
        data: { quantity: newQuantity }
      });

      await tx.inventoryTransactions.create({
        data: {
          inventoryId: id,
          type: type as TransactionType,
          quantity: Number(quantity),
          referenceOrder,
          notes,
          performedById: req.user!.userId
        }
      });

      await tx.auditLog.create({
        data: {
          userId: req.user!.userId,
          action: `STOCK_${type}`,
          entity: 'Inventory',
          entityId: id,
          metadata: JSON.stringify({ itemCode: item.itemCode, prevQty: item.quantity, newQty: newQuantity })
        }
      });

      return inv;
    });

    return res.status(200).json({
      message: 'Stock updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Update stock error:', error);
    return res.status(500).json({ error: 'Failed to update stock quantity' });
  }
};
