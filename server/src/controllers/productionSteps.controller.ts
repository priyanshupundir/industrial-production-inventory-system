import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getProductionSteps = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productionOrderId, status, assignedOperatorId } = req.query;

    const where: any = {};
    if (productionOrderId) where.productionOrderId = productionOrderId as string;
    if (status) where.status = status as string;
    if (assignedOperatorId) where.assignedOperatorId = assignedOperatorId as string;

    const steps = await prisma.productionStep.findMany({
      where,
      include: {
        productionOrder: {
          select: {
            orderNumber: true,
            productName: true
          }
        },
        assignedOperator: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        { productionOrderId: 'asc' },
        { stepNumber: 'asc' }
      ]
    });

    return res.status(200).json({ count: steps.length, steps });
  } catch (error) {
    console.error('Fetch production steps error:', error);
    return res.status(500).json({ error: 'Failed to fetch production steps' });
  }
};

export const createProductionStep = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productionOrderId, stepNumber, name, description, assignedOperatorId } = req.body;

    if (!productionOrderId || !stepNumber || !name) {
      return res.status(400).json({ error: 'Production order ID, step number, and name are required' });
    }

    const productionOrder = await prisma.productionOrder.findUnique({ where: { id: productionOrderId } });
    if (!productionOrder) {
      return res.status(404).json({ error: 'Production order not found' });
    }

    if (assignedOperatorId) {
      const operator = await prisma.user.findUnique({ where: { id: assignedOperatorId } });
      if (!operator) {
        return res.status(404).json({ error: 'Assigned operator not found' });
      }
    }

    const newStep = await prisma.productionStep.create({
      data: {
        productionOrderId,
        stepNumber: Number(stepNumber),
        name,
        description: description || null,
        assignedOperatorId: assignedOperatorId || null,
        status: 'PENDING'
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'CREATE_PRODUCTION_STEP',
        entity: 'ProductionStep',
        entityId: newStep.id,
        metadata: JSON.stringify({ productionOrderId, stepNumber, name })
      }
    });

    return res.status(201).json({ message: 'Production step created', step: newStep });
  } catch (error) {
    console.error('Create production step error:', error);
    return res.status(500).json({ error: 'Failed to create production step' });
  }
};

export const updateProductionStep = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { status, assignedOperatorId, description } = req.body;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Production step ID is required' });
    }

    const existing = await prisma.productionStep.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Production step not found' });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedOperatorId !== undefined) {
      if (assignedOperatorId) {
        const operator = await prisma.user.findUnique({ where: { id: assignedOperatorId } });
        if (!operator) {
          return res.status(404).json({ error: 'Assigned operator not found' });
        }
      }
      updateData.assignedOperatorId = assignedOperatorId;
    }
    if (description !== undefined) updateData.description = description;

    const updated = await prisma.productionStep.update({
      where: { id },
      data: updateData
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'UPDATE_PRODUCTION_STEP',
        entity: 'ProductionStep',
        entityId: id,
        metadata: JSON.stringify({ prevStatus: existing.status, newStatus: updated.status })
      }
    });

    return res.status(200).json({ message: 'Production step updated', step: updated });
  } catch (error) {
    console.error('Update production step error:', error);
    return res.status(500).json({ error: 'Failed to update production step' });
  }
};

export const deleteProductionStep = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Production step ID is required' });
    }

    const existing = await prisma.productionStep.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Production step not found' });
    }

    await prisma.productionStep.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'DELETE_PRODUCTION_STEP',
        entity: 'ProductionStep',
        entityId: id,
        metadata: JSON.stringify({ stepNumber: existing.stepNumber, name: existing.name })
      }
    });

    return res.status(200).json({ message: 'Production step deleted' });
  } catch (error) {
    console.error('Delete production step error:', error);
    return res.status(500).json({ error: 'Failed to delete production step' });
  }
};

export const createStepsForOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productionOrderId, steps } = req.body;

    if (!productionOrderId || !steps || !Array.isArray(steps)) {
      return res.status(400).json({ error: 'Production order ID and steps array are required' });
    }

    const productionOrder = await prisma.productionOrder.findUnique({ where: { id: productionOrderId } });
    if (!productionOrder) {
      return res.status(404).json({ error: 'Production order not found' });
    }

    // Delete existing steps for this order
    await prisma.productionStep.deleteMany({
      where: { productionOrderId }
    });

    // Create new steps
    const createdSteps = await prisma.productionStep.createMany({
      data: steps.map((step: any) => ({
        productionOrderId,
        stepNumber: step.stepNumber,
        name: step.name,
        description: step.description || null,
        assignedOperatorId: step.assignedOperatorId || null,
        status: 'PENDING'
      }))
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'CREATE_PRODUCTION_STEPS_BATCH',
        entity: 'ProductionStep',
        entityId: productionOrderId,
        metadata: JSON.stringify({ count: createdSteps.count })
      }
    });

    return res.status(201).json({ 
      message: 'Production steps created', 
      count: createdSteps.count 
    });
  } catch (error) {
    console.error('Create steps for order error:', error);
    return res.status(500).json({ error: 'Failed to create production steps' });
  }
};
