import React from 'react';
import { 
  Factory, 
  Clock, 
  Plus, 
  Cpu, 
  ChevronRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { ProductionOrder, OrderStatus } from '../types';

export const ProductionOrdersPage: React.FC = () => {
  const dummyOrders: ProductionOrder[] = [
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
  ];

  const columns: { label: string; status: OrderStatus; badgeBg: string }[] = [
    { label: 'Pending Approval', status: 'PENDING', badgeBg: 'bg-slate-800 text-slate-300' },
    { label: 'In Progress', status: 'IN_PROGRESS', badgeBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    { label: 'Quality Inspection', status: 'INSPECTION', badgeBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
    { label: 'Completed', status: 'COMPLETED', badgeBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Production Order Pipeline</h2>
          <p className="text-sm text-slate-400">Track order progress from scheduling, machining, quality checks, to completion.</p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 transition-all">
          <Plus className="h-4 w-4" />
          Create Production Order
        </button>
      </div>

      {/* Pipeline Status Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const colOrders = dummyOrders.filter(o => o.status === col.status);
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
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
