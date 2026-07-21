import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  AlertTriangle, 
  QrCode, 
  Layers, 
  ArrowDownUp, 
  Filter,
  Boxes
} from 'lucide-react';
import type{ InventoryItem } from '../types';

export const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const dummyItems: InventoryItem[] = [
    {
      id: '1',
      itemCode: 'RM-STL-101',
      name: 'Structural Alloy Steel Sheets (8mm)',
      category: 'RAW_MATERIAL',
      quantity: 450,
      unit: 'sheets',
      minThreshold: 100,
      batchNumber: 'BATCH-2026-08A',
      qrCode: 'QR-RM-STL-101-08A',
      location: 'Warehouse Bay A - Rack 04',
      updatedAt: '2026-07-21'
    },
    {
      id: '2',
      itemCode: 'RM-ALU-205',
      name: 'Industrial Grade Aluminum Billets 6061',
      category: 'RAW_MATERIAL',
      quantity: 28,
      unit: 'kg',
      minThreshold: 50,
      batchNumber: 'BATCH-2026-11B',
      qrCode: 'QR-RM-ALU-205-11B',
      location: 'Warehouse Bay B - Shelf 02',
      updatedAt: '2026-07-20'
    },
    {
      id: '3',
      itemCode: 'CMP-HYD-502',
      name: 'High-Pressure Hydraulic Valves',
      category: 'COMPONENT',
      quantity: 120,
      unit: 'units',
      minThreshold: 30,
      batchNumber: 'BATCH-CMP-502-99',
      qrCode: 'QR-CMP-HYD-502-99',
      location: 'Store Bin 18-C',
      updatedAt: '2026-07-19'
    },
    {
      id: '4',
      itemCode: 'FG-GRB-900',
      name: 'Heavy-Duty Industrial Gearbox Assembly',
      category: 'FINISHED_GOOD',
      quantity: 15,
      unit: 'units',
      minThreshold: 5,
      batchNumber: 'BATCH-FG-900-2026',
      qrCode: 'QR-FG-GRB-900-01',
      location: 'Dispatch Staging Area 01',
      updatedAt: '2026-07-21'
    }
  ];

  const filteredItems = dummyItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Inventory & Material Management</h2>
          <p className="text-sm text-slate-400">Track raw materials, component stocks, finished goods, and batch numbers.</p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 transition-all">
          <Plus className="h-4 w-4" />
          Add Material Entry
        </button>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search item, code, or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="RAW_MATERIAL">Raw Materials</option>
            <option value="COMPONENT">Components</option>
            <option value="FINISHED_GOOD">Finished Goods</option>
            <option value="SPARE_PART">Spare Parts</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">Item & Code</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Quantity & Unit</th>
                <th className="px-6 py-4">Batch Number</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredItems.map((item) => {
                const isLowStock = item.quantity <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{item.name}</div>
                      <div className="text-xs font-mono text-blue-400 mt-0.5">{item.itemCode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{item.quantity} {item.unit}</span>
                        {isLowStock && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                            <AlertTriangle className="h-3 w-3" /> LOW STOCK
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">Min Threshold: {item.minThreshold}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <QrCode className="h-3.5 w-3.5 text-slate-400" />
                        {item.batchNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{item.location}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all inline-flex items-center gap-1">
                        <ArrowDownUp className="h-3.5 w-3.5" /> Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
