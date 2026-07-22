import React, { useState } from 'react';
import { 
  Factory, 
  Clock, 
  Plus, 
  Cpu, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  X,
  ArrowRight
} from 'lucide-react';
import type { ProductionOrder, OrderStatus } from '../types';

export const ProductionOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([
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
      machine: { name: '5-Axis CNC Milling Station A1', machineId: 'MAC-CNC-01' }
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
      machine: { name: 'Automated Precision Lathe L-04', machineId: 'MAC-LAT-04' }
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
    }
  ]);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [targetQuantity, setTargetQuantity] = useState(25);
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [assignedMachine, setAssignedMachine] = useState('5-Axis CNC Milling Station A1');

  const columns: { label: string; status: OrderStatus; badgeBg: string; nextStatus?: OrderStatus }[] = [
    { label: 'Pending Approval', status: 'PENDING', badgeBg: 'bg-slate-800 text-slate-300', nextStatus: 'IN_PROGRESS' },
    { label: 'In Progress', status: 'IN_PROGRESS', badgeBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', nextStatus: 'INSPECTION' },
    { label: 'Quality Inspection', status: 'INSPECTION', badgeBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30', nextStatus: 'COMPLETED' },
    { label: 'Completed', status: 'COMPLETED', badgeBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  ];

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName) return;

    const newOrder: ProductionOrder = {
      id: Date.now().toString(),
      orderNumber: `PRD-2026-${Math.floor(104 + orders.length)}`,
      productName,
      targetQuantity: Number(targetQuantity),
      completedQuantity: 0,
      status: 'PENDING',
      priority,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      machine: assignedMachine ? { name: assignedMachine, machineId: 'MAC-01' } : undefined
    };

    setOrders([newOrder, ...orders]);
    setIsCreateModalOpen(false);
    setProductName('');
  };

  const advanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const completedQty = nextStatus === 'COMPLETED' ? o.targetQuantity : o.completedQuantity;
        return { ...o, status: nextStatus, completedQuantity: completedQty };
      }
      return o;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Production Order Pipeline</h2>
          <p className="text-sm text-slate-400">Track order progress from scheduling, machining, quality checks, to completion.</p>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Production Order
        </button>
      </div>

      {/* Pipeline Status Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const colOrders = orders.filter(o => o.status === col.status);
          return (
            <div key={col.status} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <span className="text-sm font-semibold text-slate-200">{col.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                  {colOrders.length}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                {colOrders.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-600">
                    No orders in this stage
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const progressPct = Math.round((order.completedQuantity / order.targetQuantity) * 100);
                    return (
                      <div key={order.id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3 shadow-md hover:border-slate-700 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-blue-400 font-bold">{order.orderNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            order.priority === 'URGENT' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {order.priority}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-slate-200 leading-snug">{order.productName}</h4>

                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Output Progress</span>
                            <span className="font-semibold text-slate-200">{order.completedQuantity} / {order.targetQuantity} units</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progressPct}%` }} />
                          </div>
                        </div>

                        {order.machine && (
                          <div className="pt-2 border-t border-slate-900 flex items-center gap-1.5 text-xs text-slate-400">
                            <Cpu className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            <span className="truncate">{order.machine.name}</span>
                          </div>
                        )}

                        {col.nextStatus && (
                          <button
                            onClick={() => advanceOrderStatus(order.id, col.nextStatus!)}
                            className="w-full mt-2 py-1.5 px-2 rounded bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 text-[11px] font-medium border border-slate-800 flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            Advance to {col.nextStatus.replace('_', ' ')}
                            <ArrowRight className="h-3 w-3" />
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

      {/* MODAL: CREATE PRODUCTION ORDER */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Factory className="h-5 w-5 text-blue-400" />
                Create New Production Order
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Gearbox Housing Assembly"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Target Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={targetQuantity}
                    onChange={(e) => setTargetQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Assigned Workstation</label>
                <select
                  value={assignedMachine}
                  onChange={(e) => setAssignedMachine(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="5-Axis CNC Milling Station A1">5-Axis CNC Milling Station A1</option>
                  <option value="Automated Precision Lathe L-04">Automated Precision Lathe L-04</option>
                  <option value="Robotic Arc Welding Cell W-02">Robotic Arc Welding Cell W-02</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-lg shadow-blue-500/20"
                >
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
