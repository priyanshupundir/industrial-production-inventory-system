import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { InspectionStatus } from '@prisma/client';

export const getQualityInspections = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, productionOrderId } = req.query;

    const where: any = {};
    if (status) where.status = status as InspectionStatus;
    if (productionOrderId) where.productionOrderId = productionOrderId as string;

    const inspections = await prisma.qualityInspection.findMany({
      where,
      include: {
        productionOrder: {
          select: {
            orderNumber: true,
            productName: true
          }
        },
        inspectedBy: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ count: inspections.length, inspections });
  } catch (error) {
    console.error('Fetch quality inspections error:', error);
    return res.status(500).json({ error: 'Failed to fetch quality inspections' });
  }
};

export const createQualityInspection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productionOrderId, batchNumber, sampleSize, passedQty, reworkQty, rejectedQty, status, notes } = req.body;

    if (!productionOrderId || !batchNumber || !sampleSize) {
      return res.status(400).json({ error: 'Production order ID, batch number, and sample size are required' });
    }

    if (passedQty + reworkQty + rejectedQty > sampleSize) {
      return res.status(400).json({ error: 'Sum of passed, rework, and rejected quantities cannot exceed sample size' });
    }

    const productionOrder = await prisma.productionOrder.findUnique({ where: { id: productionOrderId } });
    if (!productionOrder) {
      return res.status(404).json({ error: 'Production order not found' });
    }

    const qcCount = await prisma.qualityInspection.count();
    const inspectionCode = `QC-2026-${String(qcCount + 45).padStart(3, '0')}`;

    const newInspection = await prisma.qualityInspection.create({
      data: {
        inspectionCode,
        productionOrderId,
        batchNumber,
        inspectedById: req.user!.userId,
        sampleSize: Number(sampleSize),
        passedQty: Number(passedQty) || 0,
        reworkQty: Number(reworkQty) || 0,
        rejectedQty: Number(rejectedQty) || 0,
        status: status || InspectionStatus.PASS,
        notes: notes || null
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'CREATE_QUALITY_INSPECTION',
        entity: 'QualityInspection',
        entityId: newInspection.id,
        metadata: JSON.stringify({ inspectionCode, batchNumber, status })
      }
    });

    return res.status(201).json({ message: 'Quality inspection created', inspection: newInspection });
  } catch (error) {
    console.error('Create quality inspection error:', error);
    return res.status(500).json({ error: 'Failed to create quality inspection' });
  }
};

export const updateQualityInspection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { passedQty, reworkQty, rejectedQty, status, notes } = req.body;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Inspection ID is required' });
    }

    const existing = await prisma.qualityInspection.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Quality inspection not found' });
    }

    const updateData: any = {};
    if (passedQty !== undefined) updateData.passedQty = Number(passedQty);
    if (reworkQty !== undefined) updateData.reworkQty = Number(reworkQty);
    if (rejectedQty !== undefined) updateData.rejectedQty = Number(rejectedQty);
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    // Validate quantities don't exceed sample size
    const newPassed = updateData.passedQty ?? existing.passedQty;
    const newRework = updateData.reworkQty ?? existing.reworkQty;
    const newRejected = updateData.rejectedQty ?? existing.rejectedQty;
    
    if (newPassed + newRework + newRejected > existing.sampleSize) {
      return res.status(400).json({ error: 'Sum of quantities cannot exceed sample size' });
    }

    const updated = await prisma.qualityInspection.update({
      where: { id },
      data: updateData
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'UPDATE_QUALITY_INSPECTION',
        entity: 'QualityInspection',
        entityId: id,
        metadata: JSON.stringify({ prevStatus: existing.status, newStatus: updated.status })
      }
    });

    return res.status(200).json({ message: 'Quality inspection updated', inspection: updated });
  } catch (error) {
    console.error('Update quality inspection error:', error);
    return res.status(500).json({ error: 'Failed to update quality inspection' });
  }
};

export const getInspectionStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const inspections = await prisma.qualityInspection.findMany();

    const totalInspections = inspections.length;
    const totalSampleSize = inspections.reduce((sum, i) => sum + i.sampleSize, 0);
    const totalPassed = inspections.reduce((sum, i) => sum + i.passedQty, 0);
    const totalRework = inspections.reduce((sum, i) => sum + i.reworkQty, 0);
    const totalRejected = inspections.reduce((sum, i) => sum + i.rejectedQty, 0);
    
    const passRate = totalSampleSize > 0 ? ((totalPassed / totalSampleSize) * 100).toFixed(1) : '100';
    const defectRate = totalSampleSize > 0 ? ((totalRejected / totalSampleSize) * 100).toFixed(1) : '0';

    return res.status(200).json({
      stats: {
        totalInspections,
        totalSampleSize,
        totalPassed,
        totalRework,
        totalRejected,
        passRate: parseFloat(passRate),
        defectRate: parseFloat(defectRate)
      }
    });
  } catch (error) {
    console.error('Get inspection stats error:', error);
    return res.status(500).json({ error: 'Failed to get inspection statistics' });
  }
};
