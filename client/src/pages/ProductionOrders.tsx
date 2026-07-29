import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Factory,
  Plus,
  Cpu,
  X,
  ArrowRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import type { ProductionOrder, OrderStatus } from '../types';
import { useProductionOrders, useCreateProductionOrder, useUpdateProductionStatus } from '../hooks/useProduction';

// ── Zod Schema ────────────────────────────────────────────────────────────────
const createOrderSchema = z.object({
  productName: z.string().min(3, 'Product name must be at least 3 characters'),
  targetQuantity: z.coerce.number().min(1, 'Quantity must be ≥ 1'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  machineId: z.string().optional(),
});

type CreateOrderForm = z.infer<typeof createOrderSchema>;

// ── Demo fallback data ────────────────────────────────────────────────────────
const DEMO_ORDERS: ProductionOrder[] = [
  {
    id: '1',
    orderNumber: 'PRD-2026-101',
    productName: 'Heavy-Duty Industrial Gearbox Assembly',
    targetQuantity: 20,
    completedQuantity: 12,
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    startDate: '2026-07-18',
    dueDate: '2026-07-26',
    machine: { name: '5-Axis CNC Milling Station A1', machineId: 'MAC-CNC-01' },
  },
  {
    id: '2',
    orderNumber: 'PRD-2026-102',
    productName: 'Precision Hydraulic Actuator Housing',
    targetQuantity: 50,
    completedQuantity: 50,
    status: 'INSPECTION',
    priority: 'URGENT',
    startDate: '2026-07-14',
    dueDate: '2026-07-22',
    machine: { name: 'Automated Precision Lathe L-04', machineId: 'MAC-LAT-04' },
  },
  {
    id: '3',
    orderNumber: 'PRD-2026-103',
    productName: 'Turbine Rotor Flange Shafts',
    targetQuantity: 100,
    completedQuantity: 0,
    status: 'PENDING',
    priority: 'MEDIUM',
    startDate: '2026-07-25',
    dueDate: '2026-08-05',
  },
];

// ── Column config ─────────────────────────────────────────────────────────────
const COLUMNS: { label: string; status: OrderStatus; badgeBg: string; columnBg: string; nextStatus?: OrderStatus }[] = [
  { label: 'Pending Approval', status: 'PENDING', badgeBg: 'bg-gradient-to-r from-slate-500 to-slate-400 text-white', columnBg: 'from-slate-50 to-slate-100 border-slate-200', nextStatus: 'IN_PROGRESS' },
  { label: 'In Progress', status: 'IN_PROGRESS', badgeBg: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white', columnBg: 'from-blue-50 to-cyan-50 border-blue-200', nextStatus: 'INSPECTION' },
  { label: 'Quality Inspection', status: 'INSPECTION', badgeBg: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white', columnBg: 'from-purple-50 to-pink-50 border-purple-200', nextStatus: 'COMPLETED' },
  { label: 'Completed', status: 'COMPLETED', badgeBg: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white', columnBg: 'from-emerald-50 to-green-50 border-emerald-200' },
];

const PRIORITY_CLASS: Record<string, string> = {
  URGENT: 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/30',
  HIGH: 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30',
  MEDIUM: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30',
  LOW: 'bg-gradient-to-r from-slate-200 to-slate-100 text-slate-600 border border-slate-300',
};

export const ProductionOrdersPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Local demo state for when backend is offline
  const [demoOrders, setDemoOrders] = useState<ProductionOrder[]>(DEMO_ORDERS);

  // ── TanStack Query ────────────────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = useProductionOrders();
  const createMutation = useCreateProductionOrder();
  const statusMutation = useUpdateProductionStatus();

  const usingDemo = isError || !data;
  const orders: ProductionOrder[] = usingDemo ? demoOrders : (data?.orders ?? []);

  // ── React Hook Form ───────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateOrderForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createOrderSchema) as any,
    defaultValues: { targetQuantity: 25, priority: 'MEDIUM' },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCreateOrder = async (values: any) => {
    const v = values as CreateOrderForm;
    if (usingDemo) {
      // Optimistic demo update
      const newOrder: ProductionOrder = {
        id: Date.now().toString(),
        orderNumber: `PRD-2026-${104 + demoOrders.length}`,
        productName: v.productName,
        targetQuantity: v.targetQuantity,
        completedQuantity: 0,
        status: 'PENDING',
        priority: v.priority,
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 86_400_000).toISOString().split('T')[0],
      };
      setDemoOrders([newOrder, ...demoOrders]);
    } else {
      await createMutation.mutateAsync(v);
    }
    setIsCreateModalOpen(false);
    reset();
  };

  const advanceStatus = async (orderId: string, nextStatus: OrderStatus) => {
    if (usingDemo) {
      setDemoOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: nextStatus, completedQuantity: nextStatus === 'COMPLETED' ? o.targetQuantity : o.completedQuantity }
            : o,
        ),
      );
    } else {
      await statusMutation.mutateAsync({ id: orderId, status: nextStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Production Order Pipeline</h2>
          <p className="text-sm text-slate-500">Track order progress from scheduling, machining, quality checks, to completion.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 text-sm border border-slate-300 transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-sm shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Production Order
          </button>
        </div>
      </div>

      {isError && (
        <div className="px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-600">
          Backend offline — showing demo data. Actions will update locally.
        </div>
      )}

      {/* Kanban Pipeline */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
          <span className="text-sm">Loading production orders…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((col) => {
            const colOrders = orders.filter((o) => o.status === col.status);
            return (
              <div key={col.status} className={`bg-gradient-to-br ${col.columnBg} border rounded-xl p-4 flex flex-col min-h-[500px] shadow-lg backdrop-blur-sm`}>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                  <span className="text-sm font-semibold text-slate-900">{col.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                    {colOrders.length}
                  </span>
                </div>

                <div className="space-y-4 flex-1">
                  {colOrders.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-500">
                      No orders in this stage
                    </div>
                  ) : (
                    colOrders.map((order) => {
                      const pct = Math.round((order.completedQuantity / order.targetQuantity) * 100);
                      const progressColors = {
                        PENDING: 'from-slate-500 to-slate-400',
                        IN_PROGRESS: 'from-blue-500 to-cyan-500',
                        INSPECTION: 'from-purple-500 to-pink-500',
                        COMPLETED: 'from-emerald-500 to-green-500',
                      };
                      return (
                        <div
                          key={order.id}
                          className="p-4 rounded-lg bg-white border border-slate-200 space-y-3 shadow-md hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-blue-600 font-bold">{order.orderNumber}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${PRIORITY_CLASS[order.priority] ?? 'bg-slate-100 text-slate-600'}`}>
                              {order.priority}
                            </span>
                          </div>

                          <h4 className="text-sm font-semibold text-slate-900 leading-snug">{order.productName}</h4>

                          <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>Output Progress</span>
                              <span className="font-semibold text-slate-900">
                                {order.completedQuantity} / {order.targetQuantity} units
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${progressColors[col.status]}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>

                          {order.machine && (
                            <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 text-xs text-slate-500">
                              <Cpu className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                              <span className="truncate">{order.machine.name}</span>
                            </div>
                          )}

                          {col.nextStatus && (
                            <button
                              onClick={() => advanceStatus(order.id, col.nextStatus!)}
                              disabled={statusMutation.isPending}
                              className="w-full mt-2 py-1.5 px-2 rounded bg-gradient-to-r from-slate-100 to-slate-200 hover:from-blue-600 hover:to-cyan-500 text-slate-700 hover:text-white text-[11px] font-medium border border-slate-300 flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50 shadow-md"
                            >
                              {statusMutation.isPending
                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                : <>Advance to {col.nextStatus.replace('_', ' ')} <ArrowRight className="h-3 w-3" /></>
                              }
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: CREATE PRODUCTION ORDER ────────────────────────────────── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Factory className="h-5 w-5 text-blue-400" />
                Create New Production Order
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onCreateOrder)} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Product Name *</label>
                <input
                  {...register('productName')}
                  placeholder="e.g. Heavy Gearbox Housing Assembly"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                />
                {errors.productName && <p className="text-xs text-red-400 mt-1">{errors.productName.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Target Quantity</label>
                  <input
                    type="number"
                    {...register('targetQuantity')}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm focus:outline-none focus:border-blue-500"
                  />
                  {errors.targetQuantity && <p className="text-xs text-red-400 mt-1">{errors.targetQuantity.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Priority</label>
                  <select
                    {...register('priority')}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Assigned Workstation</label>
                <select
                  {...register('machineId')}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="MAC-CNC-01">5-Axis CNC Milling Station A1</option>
                  <option value="MAC-LAT-04">Automated Precision Lathe L-04</option>
                  <option value="MAC-WLD-02">Robotic Arc Welding Cell W-02</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-medium shadow-lg shadow-blue-500/30 disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                >
                  {createMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create & Schedule Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
