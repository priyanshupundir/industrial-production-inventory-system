import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { OrderStatus, MachineStatus } from '@prisma/client';

export const getDashboardMetrics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalInventoryItems = await prisma.inventory.count();
    const inventoryItems = await prisma.inventory.findMany();
    const lowStockCount = inventoryItems.filter(item => item.quantity <= item.minThreshold).length;

    const totalOrders = await prisma.productionOrder.count();
    const activeOrders = await prisma.productionOrder.count({
      where: { status: OrderStatus.IN_PROGRESS }
    });
    const pendingInspections = await prisma.productionOrder.count({
      where: { status: OrderStatus.INSPECTION }
    });
    const completedOrders = await prisma.productionOrder.count({
      where: { status: OrderStatus.COMPLETED }
    });

    const totalMachines = await prisma.machine.count();
    const activeMachines = await prisma.machine.count({
      where: { status: MachineStatus.OPERATIONAL }
    });

    // Chart Data Generators
    const monthlyProduction = [
      { month: 'Jan', target: 120, completed: 115 },
      { month: 'Feb', target: 140, completed: 138 },
      { month: 'Mar', target: 160, completed: 152 },
      { month: 'Apr', target: 180, completed: 175 },
      { month: 'May', target: 200, completed: 198 },
      { month: 'Jun', target: 220, completed: 210 },
      { month: 'Jul', target: 250, completed: 242 },
    ];

    const categoryDistribution = [
      { name: 'Raw Material', count: inventoryItems.filter(i => i.category === 'RAW_MATERIAL').length },
      { name: 'Component', count: inventoryItems.filter(i => i.category === 'COMPONENT').length },
      { name: 'Finished Good', count: inventoryItems.filter(i => i.category === 'FINISHED_GOOD').length },
      { name: 'Spare Part', count: inventoryItems.filter(i => i.category === 'SPARE_PART').length },
    ];

    return res.status(200).json({
      metrics: {
        totalInventoryItems,
        lowStockCount,
        totalOrders,
        activeOrders,
        pendingInspections,
        completedOrders,
        totalMachines,
        activeMachines
      },
      charts: {
        monthlyProduction,
        categoryDistribution
      }
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return res.status(500).json({ error: 'Failed to retrieve dashboard metrics' });
  }
};
