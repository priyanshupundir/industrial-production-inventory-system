import React, { useState } from 'react';
import { 
  Truck, 
  ShoppingBag, 
  Plus, 
  Building2, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  X 
} from 'lucide-react';

interface SupplierItem {
  id: string;
  name: string;
  code: string;
  contactEmail: string;
  phone: string;
  category: string;
  totalOrders: number;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  totalAmount: number;
  status: 'PENDING' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  expectedDate: string;
  items: string;
}

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([
    {
      id: '1',
      name: 'Apex Precision Steel Industries',
      code: 'SUP-APX-01',
      contactEmail: 'orders@apexsteel.com',
      phone: '+91 98765 43210',
      category: 'Raw Materials (Steel & Alloys)',
      totalOrders: 14
    },
    {
      id: '2',
      name: 'HydroTech Fluid Systems Ltd.',
      code: 'SUP-HYD-04',
      contactEmail: 'procurement@hydrotech.io',
      phone: '+91 98123 45678',
      category: 'Hydraulic & Pneumatic Components',
      totalOrders: 8
    }
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: '1',
      poNumber: 'PO-2026-801',
      supplierName: 'Apex Precision Steel Industries',
      totalAmount: 145000,
      status: 'ORDERED',
      expectedDate: '2026-07-30',
      items: '50 Sheets Alloy Steel 8mm'
    },
    {
      id: '2',
      poNumber: 'PO-2026-802',
      supplierName: 'HydroTech Fluid Systems Ltd.',
      totalAmount: 85000,
      status: 'PENDING',
      expectedDate: '2026-08-04',
      items: '30 High-Pressure Hydraulic Valves'
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [poNumber, setPoNumber] = useState(`PO-2026-${Math.floor(803 + purchaseOrders.length)}`);
  const [selectedSupplier, setSelectedSupplier] = useState('Apex Precision Steel Industries');
  const [orderItems, setOrderItems] = useState('');
  const [totalAmount, setTotalAmount] = useState(50000);

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderItems) return;

    const newPO: PurchaseOrder = {
      id: Date.now().toString(),
      poNumber,
      supplierName: selectedSupplier,
      totalAmount: Number(totalAmount),
      status: 'PENDING',
      expectedDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: orderItems
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setIsModalOpen(false);
    setOrderItems('');
  };

  const markReceived = (poId: string) => {
    setPurchaseOrders(purchaseOrders.map(po => {
      if (po.id === poId) return { ...po, status: 'RECEIVED' };
      return po;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Suppliers & Purchase Procurement</h2>
          <p className="text-sm text-slate-400">Manage raw material vendors, purchase requisitions, and incoming shipments.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Purchase Order
        </button>
      </div>

      {/* Grid: Approved Vendors */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-400" />
          Approved Industrial Vendors ({suppliers.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-blue-400 font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  {s.code}
                </span>
                <span className="text-xs text-slate-400">{s.totalOrders} Orders Completed</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-base">{s.name}</h4>
                <p className="text-xs text-slate-400">{s.category}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-500" /> {s.contactEmail}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-500" /> {s.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-semibold text-slate-200 text-sm flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-blue-400" />
          Purchase Orders Requisitions ({purchaseOrders.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">PO Number</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Items Description</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Expected Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-400">{po.poNumber}</td>
                  <td className="px-6 py-4 font-semibold text-slate-100">{po.supplierName}</td>
                  <td className="px-6 py-4 text-xs text-slate-300">{po.items}</td>
                  <td className="px-6 py-4 font-bold text-slate-100">₹{po.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">{po.expectedDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                      po.status === 'RECEIVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      po.status === 'ORDERED' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {po.status !== 'RECEIVED' && (
                      <button
                        onClick={() => markReceived(po.id)}
                        className="px-3 py-1 rounded bg-slate-800 hover:bg-emerald-600/20 text-slate-200 hover:text-emerald-400 text-xs font-medium border border-slate-700 transition-all"
                      >
                        Mark Received
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE PURCHASE ORDER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-400" />
                Create Purchase Requisition Order
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Supplier Vendor</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Requisition Item Description *</label>
                <input
                  type="text"
                  placeholder="e.g. 100 kg Industrial Grade Aluminum Billets 6061"
                  value={orderItems}
                  onChange={(e) => setOrderItems(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Total Estimated Amount (₹ / $)</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-lg shadow-blue-500/20"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
