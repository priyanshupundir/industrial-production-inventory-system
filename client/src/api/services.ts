import api from './client';
import type { InventoryItem, ProductionOrder, DashboardMetrics, User } from '../types';

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await api.post<{ accessToken: string; refreshToken: string; user: User }>('/auth/login', { email, password });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get<{ user: User }>('/auth/me');
    return res.data;
  },
};

// ── Inventory ─────────────────────────────────────────────────────────────────
export const inventoryAPI = {
  getItems: async (category?: string, search?: string) => {
    const res = await api.get<{ count: number; items: InventoryItem[] }>('/inventory', {
      params: { category: category !== 'ALL' ? category : undefined, search },
    });
    return res.data;
  },

  addItem: async (data: {
    itemCode: string;
    name: string;
    category: 'RAW_MATERIAL' | 'COMPONENT' | 'FINISHED_GOOD' | 'SPARE_PART';
    quantity: number;
    unit: string;
    minThreshold: number;
    batchNumber?: string;
    location: string;
  }) => {
    const res = await api.post<{ message: string; item: InventoryItem }>('/inventory', data);
    return res.data;
  },

  updateStock: async (id: string, type: 'STOCK_IN' | 'STOCK_OUT', quantity: number, notes?: string) => {
    const res = await api.patch<{ message: string; item: InventoryItem }>(`/inventory/${id}/stock`, {
      type,
      quantity,
      notes,
    });
    return res.data;
  },
};

// ── Production Orders ─────────────────────────────────────────────────────────
export const productionAPI = {
  getOrders: async () => {
    const res = await api.get<{ count: number; orders: ProductionOrder[] }>('/production');
    return res.data;
  },
  createOrder: async (data: {
    productName: string;
    targetQuantity: number;
    priority: string;
    machineId?: string;
  }) => {
    const res = await api.post<{ message: string; order: ProductionOrder }>('/production', data);
    return res.data;
  },
  updateStatus: async (id: string, status: string, completedQuantity?: number) => {
    const res = await api.patch<{ message: string; order: ProductionOrder }>(`/production/${id}/status`, {
      status,
      completedQuantity,
    });
    return res.data;
  },
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getMetrics: async () => {
    const res = await api.get<{ metrics: DashboardMetrics; charts: Record<string, unknown> }>('/dashboard/metrics');
    return res.data;
  },
};
