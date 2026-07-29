import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { MachineStatus } from '@prisma/client';

export const getMachines = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, departmentId } = req.query;

    const where: any = {};
    if (status) where.status = status as MachineStatus;
    if (departmentId) where.departmentId = departmentId as string;

    const machines = await prisma.machine.findMany({
      where,
      include: {
        department: {
          select: {
            name: true,
            code: true
          }
        },
        orders: {
          where: {
            status: { in: ['IN_PROGRESS', 'INSPECTION'] }
          },
          select: {
            orderNumber: true,
            productName: true,
            status: true
          }
        },
        maintenanceLogs: {
          orderBy: { logDate: 'desc' },
          take: 3
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ count: machines.length, machines });
  } catch (error) {
    console.error('Fetch machines error:', error);
    return res.status(500).json({ error: 'Failed to fetch machines' });
  }
};

export const createMachine = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { machineId, name, modelNumber, departmentId, maintenanceDue } = req.body;

    if (!machineId || !name || !departmentId) {
      return res.status(400).json({ error: 'Machine ID, name, and department ID are required' });
    }

    const existing = await prisma.machine.findUnique({ where: { machineId } });
    if (existing) {
      return res.status(409).json({ error: 'Machine ID already exists' });
    }

    const department = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const newMachine = await prisma.machine.create({
      data: {
        machineId,
        name,
        modelNumber: modelNumber || null,
        departmentId,
        maintenanceDue: maintenanceDue ? new Date(maintenanceDue) : null,
        status: MachineStatus.OPERATIONAL
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'CREATE_MACHINE',
        entity: 'Machine',
        entityId: newMachine.id,
        metadata: JSON.stringify({ machineId, name })
      }
    });

    return res.status(201).json({ message: 'Machine created', machine: newMachine });
  } catch (error) {
    console.error('Create machine error:', error);
    return res.status(500).json({ error: 'Failed to create machine' });
  }
};

export const updateMachineStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { status, maintenanceDue } = req.body;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Machine ID is required' });
    }

    if (!status || !Object.values(MachineStatus).includes(status)) {
      return res.status(400).json({ error: 'Valid MachineStatus is required' });
    }

    const existing = await prisma.machine.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const updateData: any = { status };
    if (maintenanceDue) {
      updateData.maintenanceDue = new Date(maintenanceDue);
    }

    const updated = await prisma.machine.update({
      where: { id },
      data: updateData
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'UPDATE_MACHINE_STATUS',
        entity: 'Machine',
        entityId: id,
        metadata: JSON.stringify({ prevStatus: existing.status, newStatus: status })
      }
    });

    return res.status(200).json({ message: 'Machine status updated', machine: updated });
  } catch (error) {
    console.error('Update machine status error:', error);
    return res.status(500).json({ error: 'Failed to update machine status' });
  }
};

export const createMaintenanceLog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { machineId, issueDescription, actionTaken, cost, status } = req.body;

    if (!machineId || !issueDescription) {
      return res.status(400).json({ error: 'Machine ID and issue description are required' });
    }

    const machine = await prisma.machine.findUnique({ where: { id: machineId } });
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const newLog = await prisma.maintenanceLog.create({
      data: {
        machineId,
        performedById: req.user!.userId,
        issueDescription,
        actionTaken: actionTaken || null,
        cost: Number(cost) || 0,
        status: status || 'COMPLETED'
      }
    });

    // Update machine status if maintenance is completed
    if (status === 'COMPLETED') {
      await prisma.machine.update({
        where: { id: machineId },
        data: {
          status: MachineStatus.OPERATIONAL,
          maintenanceDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'CREATE_MAINTENANCE_LOG',
        entity: 'MaintenanceLog',
        entityId: newLog.id,
        metadata: JSON.stringify({ machineId, issueDescription })
      }
    });

    return res.status(201).json({ message: 'Maintenance log created', log: newLog });
  } catch (error) {
    console.error('Create maintenance log error:', error);
    return res.status(500).json({ error: 'Failed to create maintenance log' });
  }
};

export const getMaintenanceLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { machineId } = req.query;

    const where: any = {};
    if (machineId) where.machineId = machineId as string;

    const logs = await prisma.maintenanceLog.findMany({
      where,
      include: {
        machine: {
          select: {
            machineId: true,
            name: true
          }
        },
        performedBy: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { logDate: 'desc' }
    });

    return res.status(200).json({ count: logs.length, logs });
  } catch (error) {
    console.error('Fetch maintenance logs error:', error);
    return res.status(500).json({ error: 'Failed to fetch maintenance logs' });
  }
};
