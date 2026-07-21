export type Role = 'ADMIN' | 'PRODUCTION_MANAGER' | 'STORE_OFFICER' | 'QUALITY_INSPECTOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string | null;
}

export type OrderStatus = 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'INSPECTION' | 'COMPLETED' | 'CANCELLED';

export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: 'RAW_MATERIAL' | 'COMPONENT' | 'FINISHED_GOOD' | 'SPARE_PART';
  quantity: number;
  unit: string;
  minThreshold: number;
  batchNumber: string;
  qrCode?: string;
  location: string;
  updatedAt: string;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  productName: string;
  targetQuantity: number;
  completedQuantity: number;
  status: OrderStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate?: string;
  dueDate?: string;
  machine?: {
    name: string;
    machineId: string;
  };
}

export interface QualityInspection {
  id: string;
  inspectionCode: string;
  batchNumber: string;
  sampleSize: number;
  passedQty: number;
  reworkQty: number;
  rejectedQty: number;
  status: 'PASS' | 'REWORK' | 'REJECT';
  notes?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalInventoryItems: number;
  lowStockCount: number;
  totalOrders: number;
  activeOrders: number;
  pendingInspections: number;
  completedOrders: number;
  totalMachines: number;
  activeMachines: number;
}
