import { PrismaClient, Role, OrderStatus, InspectionStatus, MachineStatus, InventoryCategory, Priority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Industrial Production System database seed...');

  // 1. Clean existing records
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.qualityInspection.deleteMany();
  await prisma.productionStep.deleteMany();
  await prisma.productionOrder.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.machine.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  // 2. Create Departments
  const deptAssembly = await prisma.department.create({
    data: { name: 'Assembly & Finishing', code: 'DEP-ASM', description: 'Final product assembly and packaging line' }
  });

  const deptMachining = await prisma.department.create({
    data: { name: 'CNC & Precision Machining', code: 'DEP-MAC', description: 'Heavy precision turning and milling operations' }
  });

  const deptQA = await prisma.department.create({
    data: { name: 'Quality Assurance', code: 'DEP-QA', description: 'Inspection, tolerance testing, and compliance' }
  });

  const deptLogistics = await prisma.department.create({
    data: { name: 'Warehouse & Logistics', code: 'DEP-LOG', description: 'Raw material storage and finished goods dispatch' }
  });

  // 3. Create Users with Hashed Passwords
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@industrial.com',
      name: 'Vikram Sharma (System Admin)',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      departmentId: deptAssembly.id,
    }
  });

  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@industrial.com',
      name: 'Ananya Roy (Production Manager)',
      passwordHash: hashedPassword,
      role: Role.PRODUCTION_MANAGER,
      departmentId: deptMachining.id,
    }
  });

  const officerUser = await prisma.user.create({
    data: {
      email: 'officer@industrial.com',
      name: 'Rajesh Patel (Store Officer)',
      passwordHash: hashedPassword,
      role: Role.STORE_OFFICER,
      departmentId: deptLogistics.id,
    }
  });

  const inspectorUser = await prisma.user.create({
    data: {
      email: 'inspector@industrial.com',
      name: 'Priya Nair (Quality Inspector)',
      passwordHash: hashedPassword,
      role: Role.QUALITY_INSPECTOR,
      departmentId: deptQA.id,
    }
  });

  // 4. Create Machines
  const machine1 = await prisma.machine.create({
    data: {
      machineId: 'MAC-CNC-01',
      name: '5-Axis CNC Milling Station A1',
      modelNumber: 'Haas-VF4-2024',
      status: MachineStatus.OPERATIONAL,
      departmentId: deptMachining.id,
      maintenanceDue: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    }
  });

  const machine2 = await prisma.machine.create({
    data: {
      machineId: 'MAC-LAT-04',
      name: 'Automated Precision Lathe L-04',
      modelNumber: 'DMG-Mori-CLX350',
      status: MachineStatus.MAINTENANCE_DUE,
      departmentId: deptMachining.id,
      maintenanceDue: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  });

  const machine3 = await prisma.machine.create({
    data: {
      machineId: 'MAC-WLD-02',
      name: 'Robotic Arc Welding Cell W-02',
      modelNumber: 'KUKA-KR8-R2100',
      status: MachineStatus.OPERATIONAL,
      departmentId: deptAssembly.id,
      maintenanceDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  // 5. Create Inventory
  const inv1 = await prisma.inventory.create({
    data: {
      itemCode: 'RM-STL-101',
      name: 'Structural Alloy Steel Sheets (8mm)',
      category: InventoryCategory.RAW_MATERIAL,
      quantity: 450,
      unit: 'sheets',
      minThreshold: 100,
      batchNumber: 'BATCH-2026-08A',
      qrCode: 'QR-RM-STL-101-08A',
      location: 'Warehouse Bay A - Rack 04'
    }
  });

  const inv2 = await prisma.inventory.create({
    data: {
      itemCode: 'RM-ALU-205',
      name: 'Industrial Grade Aluminum Billets 6061',
      category: InventoryCategory.RAW_MATERIAL,
      quantity: 28,
      unit: 'kg',
      minThreshold: 50,
      batchNumber: 'BATCH-2026-11B',
      qrCode: 'QR-RM-ALU-205-11B',
      location: 'Warehouse Bay B - Shelf 02'
    }
  });

  const inv3 = await prisma.inventory.create({
    data: {
      itemCode: 'CMP-HYD-502',
      name: 'High-Pressure Hydraulic Valves',
      category: InventoryCategory.COMPONENT,
      quantity: 120,
      unit: 'units',
      minThreshold: 30,
      batchNumber: 'BATCH-CMP-502-99',
      qrCode: 'QR-CMP-HYD-502-99',
      location: 'Store Bin 18-C'
    }
  });

  const inv4 = await prisma.inventory.create({
    data: {
      itemCode: 'FG-GRB-900',
      name: 'Heavy-Duty Industrial Gearbox Assembly',
      category: InventoryCategory.FINISHED_GOOD,
      quantity: 15,
      unit: 'units',
      minThreshold: 5,
      batchNumber: 'BATCH-FG-900-2026',
      qrCode: 'QR-FG-GRB-900-01',
      location: 'Dispatch Staging Area 01'
    }
  });

  // 6. Production Orders
  const order1 = await prisma.productionOrder.create({
    data: {
      orderNumber: 'PRD-2026-101',
      productName: 'Heavy-Duty Industrial Gearbox Assembly',
      targetQuantity: 20,
      completedQuantity: 12,
      status: OrderStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      machineId: machine1.id,
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    }
  });

  const order2 = await prisma.productionOrder.create({
    data: {
      orderNumber: 'PRD-2026-102',
      productName: 'Precision Hydraulic Actuator Housing',
      targetQuantity: 50,
      completedQuantity: 50,
      status: OrderStatus.INSPECTION,
      priority: Priority.URGENT,
      machineId: machine2.id,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    }
  });

  // 7. Quality Inspection
  await prisma.qualityInspection.create({
    data: {
      inspectionCode: 'QC-2026-044',
      productionOrderId: order2.id,
      batchNumber: 'BATCH-PRD-102',
      inspectedById: inspectorUser.id,
      sampleSize: 50,
      passedQty: 47,
      reworkQty: 2,
      rejectedQty: 1,
      status: InspectionStatus.PASS,
      notes: 'Dimension tolerances within 99.4% spec limit. Minor rework needed on 2 housings.'
    }
  });

  // 8. Maintenance Logs
  await prisma.maintenanceLog.create({
    data: {
      machineId: machine2.id,
      performedById: managerUser.id,
      issueDescription: 'Coolant flow degradation detected during high-speed turning.',
      actionTaken: 'Cleaned pump filters and calibrated pressure regulator.',
      cost: 4500,
      status: 'COMPLETED'
    }
  });

  // 9. Audit Logs & Notifications
  await prisma.auditLog.create({
    data: {
      userId: managerUser.id,
      action: 'CREATE_PRODUCTION_ORDER',
      entity: 'ProductionOrder',
      entityId: order1.id,
      metadata: JSON.stringify({ orderNumber: 'PRD-2026-101', priority: 'HIGH' })
    }
  });

  await prisma.notification.create({
    data: {
      userId: officerUser.id,
      title: 'Low Stock Alert: Aluminum Billets 6061',
      message: 'Current stock (28 kg) is below minimum threshold (50 kg). Please initiate Purchase Order.',
      type: 'WARNING'
    }
  });

  console.log('✅ Industrial Production System seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
