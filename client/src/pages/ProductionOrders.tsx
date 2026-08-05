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
  { label: 'Pending Approval', status: 'PENDING', badgeBg: 'bg-[var(--muted)] text-[var(--muted-foreground)]', columnBg: 'bg-[var(--card)] border-[var(--border)]', nextStatus: 'IN_PROGRESS' },
  { label: 'In Progress', status: 'IN_PROGRESS', badgeBg: 'bg-[var(--info)] text-[var(--info-foreground)]', columnBg: 'bg-[var(--card)] border-[var(--border)]', nextStatus: 'INSPECTION' },
  { label: 'Quality Inspection', status: 'INSPECTION', badgeBg: 'bg-[var(--destructive)] text-[var(--destructive-foreground)]', columnBg: 'bg-[var(--card)] border-[var(--border)]', nextStatus: 'COMPLETED' },
  { label: 'Completed', status: 'COMPLETED', badgeBg: 'bg-[var(--success)] text-[var(--success-foreground)]', columnBg: 'bg-[var(--card)] border-[var(--border)]' },
];

const PRIORITY_CLASS: Record<string, string> = {
  URGENT: 'bg-[var(--destructive)]/20 text-[var(--destructive-foreground)] border border-[var(--destructive)]/30',
  HIGH: 'bg-[var(--warning)]/20 text-[var(--warning-foreground)] border border-[var(--warning)]/30',
  MEDIUM: 'bg-[var(--info)]/20 text-[var(--info-foreground)] border border-[var(--info)]/30',
  LOW: 'bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]',
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
      // eslint-disable-next-line react-hooks/purity
      const now = Date.now();
      const newOrder: ProductionOrder = {
        id: now.toString(),
        orderNumber: `PRD-2026-${104 + demoOrders.length}`,
        productName: v.productName,
        targetQuantity: v.targetQuantity,
        completedQuantity: 0,
        status: 'PENDING',
        priority: v.priority,
        startDate: new Date(now).toISOString().split('T')[0],
        dueDate: new Date(now + 7 * 86_400_000).toISOString().split('T')[0],
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
          <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Production Order Pipeline</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Track order progress from scheduling, machining, quality checks, to completion.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--secondary-foreground)] text-sm border border-[var(--border)] transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-medium text-sm glow-effect transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Production Order
          </button>
        </div>
      </div>

      {isError && (
        <div className="px-4 py-2.5 bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-lg text-sm text-[var(--warning-foreground)]">
          Backend offline — showing demo data. Actions will update locally.
        </div>
      )}

      {/* Kanban Pipeline */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-[var(--muted-foreground)]">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
          <span className="text-sm">Loading production orders…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((col) => {
            const colOrders = orders.filter((o) => o.status === col.status);
            return (
              <div key={col.status} className={`${col.columnBg} border rounded-xl p-4 flex flex-col min-h-[500px] panel-effect`}>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]">
                  <span className="text-sm font-semibold text-[var(--foreground)]">{col.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                    {colOrders.length}
                  </span>
                </div>

                <div className="space-y-4 flex-1">
                  {colOrders.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-[var(--border)] rounded-lg flex items-center justify-center text-xs text-[var(--muted-foreground)]">
                      No orders in this stage
                    </div>
                  ) : (
                    colOrders.map((order) => {
                      const pct = Math.round((order.completedQuantity / order.targetQuantity) * 100);
                      const progressColors: Record<string, string> = {
                        PENDING: 'from-[var(--muted)] to-[var(--muted-foreground)]',
                        APPROVED: 'from-[var(--info)] to-[var(--info-foreground)]',
                        IN_PROGRESS: 'from-[var(--primary)] to-[var(--primary-foreground)]',
                        INSPECTION: 'from-[var(--destructive)] to-[var(--destructive-foreground)]',
                        COMPLETED: 'from-[var(--success)] to-[var(--success-foreground)]',
                      };
                      return (
                        <div
                          key={order.id}
                          className="p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)] space-y-3 panel-effect hover:border-[var(--primary)] transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-[var(--primary)] font-bold">{order.orderNumber}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${PRIORITY_CLASS[order.priority] ?? 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                              {order.priority}
                            </span>
                          </div>

                          <h4 className="text-sm font-semibold text-[var(--foreground)] leading-snug">{order.productName}</h4>

                          <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
                              <span>Output Progress</span>
                              <span className="font-semibold text-[var(--foreground)]">
                                {order.completedQuantity} / {order.targetQuantity} units
                              </span>
                            </div>
                            <div className="h-2 w-full bg-[var(--secondary)] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${progressColors[col.status]}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>

                          {order.machine && (
                            <div className="pt-2 border-t border-[var(--border)] flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                              <Cpu className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" />
                              <span className="truncate">{order.machine.name}</span>
                            </div>
                          )}

                          {col.nextStatus && (
                            <button
                              onClick={() => advanceStatus(order.id, col.nextStatus!)}
                              disabled={statusMutation.isPending}
                              className="w-full mt-2 py-1.5 px-2 rounded bg-[var(--secondary)] hover:bg-[var(--primary)] text-[var(--secondary-foreground)] hover:text-[var(--primary-foreground)] text-[11px] font-medium border border-[var(--border)] flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4 panel-effect">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                <Factory className="h-5 w-5 text-[var(--primary)]" />
                Create New Production Order
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onCreateOrder)} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Product Name *</label>
                <input
                  {...register('productName')}
                  placeholder="e.g. Heavy Gearbox Housing Assembly"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                />
                {errors.productName && <p className="text-xs text-[var(--destructive-foreground)] mt-1">{errors.productName.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Target Quantity</label>
                  <input
                    type="number"
                    {...register('targetQuantity')}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                  {errors.targetQuantity && <p className="text-xs text-[var(--destructive-foreground)] mt-1">{errors.targetQuantity.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Priority</label>
                  <select
                    {...register('priority')}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Assigned Workstation</label>
                <select
                  {...register('machineId')}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="MAC-CNC-01">5-Axis CNC Milling Station A1</option>
                  <option value="MAC-LAT-04">Automated Precision Lathe L-04</option>
                  <option value="MAC-WLD-02">Robotic Arc Welding Cell W-02</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--secondary-foreground)] text-xs font-medium cursor-pointer border border-[var(--border)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] text-xs font-medium glow-effect disabled:opacity-60 flex items-center gap-2 cursor-pointer"
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
