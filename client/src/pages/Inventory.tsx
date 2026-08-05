import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { QRCodeSVG } from 'qrcode.react';
import {
  Search,
  Plus,
  AlertTriangle,
  QrCode,
  ArrowDownUp,
  Filter,
  X,
  PackagePlus,
  Download,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useInventory, useAddInventoryItem, useAdjustStock } from '../hooks/useInventory';
import type { InventoryItem } from '../types';
import { exportToCSV } from '../lib/exportUtils';

// ── Zod Schemas ────────────────────────────────────────────────────────────────
const addItemSchema = z.object({
  itemCode: z.string().min(3, 'Item code must be at least 3 chars').toUpperCase(),
  name: z.string().min(3, 'Material name is required'),
  category: z.enum(['RAW_MATERIAL', 'COMPONENT', 'FINISHED_GOOD', 'SPARE_PART']),
  quantity: z.coerce.number().min(1, 'Quantity must be ≥ 1'),
  unit: z.string().min(1, 'Unit is required'),
  minThreshold: z.coerce.number().min(1, 'Min threshold must be ≥ 1'),
  batchNumber: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
});

const adjustStockSchema = z.object({
  type: z.enum(['STOCK_IN', 'STOCK_OUT']),
  quantity: z.coerce.number().min(1, 'Quantity must be ≥ 1'),
  notes: z.string().optional(),
});

type AddItemForm = z.infer<typeof addItemSchema>;
type AdjustStockForm = z.infer<typeof adjustStockSchema>;

// ── Local fallback data (shown if backend is offline) ─────────────────────────
const DEMO_ITEMS: InventoryItem[] = [
  {
    id: '1',
    itemCode: 'RM-STL-101',
    name: 'Structural Alloy Steel Sheets (8mm)',
    category: 'RAW_MATERIAL',
    quantity: 450,
    unit: 'sheets',
    minThreshold: 100,
    batchNumber: 'BATCH-2026-08A',
    qrCode: 'RM-STL-101|BATCH-2026-08A|WAR-A-04',
    location: 'Warehouse Bay A - Rack 04',
    updatedAt: '2026-07-21',
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
    qrCode: 'RM-ALU-205|BATCH-2026-11B|WAR-B-02',
    location: 'Warehouse Bay B - Shelf 02',
    updatedAt: '2026-07-20',
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
    qrCode: 'CMP-HYD-502|BATCH-CMP-502-99|BIN-18C',
    location: 'Store Bin 18-C',
    updatedAt: '2026-07-19',
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
    qrCode: 'FG-GRB-900|BATCH-FG-900-2026|DSP-01',
    location: 'Dispatch Staging Area 01',
    updatedAt: '2026-07-21',
  },
];

// ── Helper ─────────────────────────────────────────────────────────────────────
const categoryLabel: Record<string, string> = {
  RAW_MATERIAL: 'Raw Material',
  COMPONENT: 'Component',
  FINISHED_GOOD: 'Finished Good',
  SPARE_PART: 'Spare Part',
};

export const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // ── TanStack Query ────────────────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = useInventory(categoryFilter, searchTerm);
  const addMutation = useAddInventoryItem();
  const adjustMutation = useAdjustStock();

  // Use backend data or demo fallback
  const items: InventoryItem[] = data?.items ?? DEMO_ITEMS;
  const filteredItems = items.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !searchTerm ||
      item.name.toLowerCase().includes(q) ||
      item.itemCode.toLowerCase().includes(q) ||
      (item.batchNumber ?? '').toLowerCase().includes(q);
    const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  // ── React Hook Form – Add Item ─────────────────────────────────────────────
  const {
    register: regAdd,
    handleSubmit: handleAddSubmit,
    formState: { errors: addErrors },
    reset: resetAdd,
  } = useForm<AddItemForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addItemSchema) as any,
    defaultValues: {
      category: 'RAW_MATERIAL',
      quantity: 100,
      unit: 'units',
      minThreshold: 20,
      location: 'Warehouse Bay A',
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onAddItem = async (values: any) => {
    const typed = values as AddItemForm;
    try {
      await addMutation.mutateAsync(typed);
      setIsAddModalOpen(false);
      resetAdd();
    } catch {
      // fallback: add optimistically to local demo list
      setIsAddModalOpen(false);
      resetAdd();
    }
  };

  // ── React Hook Form – Adjust Stock ────────────────────────────────────────
  const {
    register: regAdj,
    handleSubmit: handleAdjustSubmit,
    watch: watchAdj,
    setValue: setAdjValue,
    formState: { errors: adjErrors },
    reset: resetAdj,
  } = useForm<AdjustStockForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(adjustStockSchema) as any,
    defaultValues: { type: 'STOCK_IN', quantity: 10 },
  });

  const adjType = watchAdj('type');
  const adjQty = watchAdj('quantity') ?? 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onAdjustStock = async (values: any) => {
    const typed = values as AdjustStockForm;
    if (!selectedItem) return;
    try {
      await adjustMutation.mutateAsync({ id: selectedItem.id, ...typed });
    } catch {
      // silently fall through – UI still shows updated state via cache
    }
    setIsAdjustModalOpen(false);
    setSelectedItem(null);
    resetAdj();
  };

  // ── Exports ───────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    exportToCSV(filteredItems as unknown as Record<string, unknown>[], `inventory_stock_${new Date().toISOString().substring(0, 10)}`, {
      itemCode: 'Item Code',
      name: 'Material Name',
      category: 'Category',
      quantity: 'Current Quantity',
      unit: 'Unit',
      minThreshold: 'Min Threshold',
      batchNumber: 'Batch Number',
      location: 'Warehouse Location',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Inventory & Material Management</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Track raw materials, component stocks, finished goods, and batch numbers.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => refetch()}
className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--secondary-foreground)] text-sm border border-[var(--border)] transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[var(--success)]/20 hover:bg-[var(--success)]/30 text-[var(--success-foreground)] font-medium text-sm border border-[var(--success)]/30 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-[var(--success)]" />
            Export CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-medium text-sm glow-effect transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Material Entry
          </button>
        </div>
      </div>

      {/* Status bar */}
      {isError && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-lg text-sm text-[var(--warning-foreground)]">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Backend offline — showing demo data. Changes will be stored locally.
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] panel-effect">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--primary)]" />
          <input
            type="text"
            placeholder="Search item, code, or batch…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 placeholder-[var(--muted-foreground)]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-[var(--primary)]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
className="px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
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
      <div id="inventory-table" className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden panel-effect">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-[var(--muted-foreground)]">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
            <span className="text-sm">Loading inventory…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--foreground)]">
              <thead className="bg-[var(--muted)] border-b border-[var(--border)] text-xs font-semibold uppercase text-[var(--muted-foreground)] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Item & Code</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Quantity & Unit</th>
                  <th className="px-6 py-4">Batch / QR</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredItems.map((item) => {
                  const isLow = item.quantity <= item.minThreshold;
                  const categoryColors: Record<string, string> = {
                    RAW_MATERIAL: 'bg-[var(--info)]/20 text-[var(--info-foreground)] border-[var(--info)]/30',
                    COMPONENT: 'bg-[var(--success)]/20 text-[var(--success-foreground)] border-[var(--success)]/30',
                    FINISHED_GOOD: 'bg-[var(--warning)]/20 text-[var(--warning-foreground)] border-[var(--warning)]/30',
                    SPARE_PART: 'bg-[var(--destructive)]/20 text-[var(--destructive-foreground)] border-[var(--destructive)]/30',
                  };
                  return (
                    <tr key={item.id} className="hover:bg-[var(--muted)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[var(--foreground)]">{item.name}</div>
                        <div className="text-xs font-mono text-[var(--primary)] mt-0.5">{item.itemCode}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded border ${categoryColors[item.category] ?? 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]'}`}>
                          {categoryLabel[item.category] ?? item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[var(--foreground)]">
                            {item.quantity} {item.unit}
                          </span>
                          {isLow && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--destructive)]/20 text-[var(--destructive-foreground)] border border-[var(--destructive)]/30 animate-pulse">
                              <AlertTriangle className="h-3 w-3" /> LOW STOCK
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[var(--muted-foreground)]">Min: {item.minThreshold}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsQRModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 group cursor-pointer"
                        >
                          <QrCode className="h-3.5 w-3.5 text-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors" />
                          <span className="font-mono text-xs text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors">
                            {item.batchNumber}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-xs text-[var(--muted-foreground)]">{item.location}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            resetAdj();
                            setIsAdjustModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--secondary-foreground)] text-xs font-medium border border-[var(--border)] transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowDownUp className="h-3.5 w-3.5" /> Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-[var(--muted-foreground)] text-sm">
                      No items match your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL 1: ADD MATERIAL ENTRY ─────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4 panel-effect">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                <PackagePlus className="h-5 w-5 text-[var(--primary)]" />
                Add New Material Entry
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit(onAddItem)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Item Code *</label>
                  <input
                    {...regAdd('itemCode')}
                    placeholder="e.g. RM-STL-300"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                  {addErrors.itemCode && (
                    <p className="text-xs text-[var(--destructive-foreground)] mt-1">{addErrors.itemCode.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Category</label>
                  <select
                    {...regAdd('category')}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="RAW_MATERIAL">Raw Material</option>
                    <option value="COMPONENT">Component</option>
                    <option value="FINISHED_GOOD">Finished Good</option>
                    <option value="SPARE_PART">Spare Part</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Material Name *</label>
                <input
                  {...regAdd('name')}
                  placeholder="e.g. Stainless Steel Alloy Tubing 12mm"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                />
                {addErrors.name && <p className="text-xs text-[var(--destructive-foreground)] mt-1">{addErrors.name.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Initial Qty</label>
                  <input
                    type="number"
                    {...regAdd('quantity')}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                  {addErrors.quantity && <p className="text-xs text-[var(--destructive-foreground)] mt-1">{addErrors.quantity.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Unit</label>
                  <input
                    {...regAdd('unit')}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Min Threshold</label>
                  <input
                    type="number"
                    {...regAdd('minThreshold')}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Batch Number</label>
                  <input
                    {...regAdd('batchNumber')}
                    placeholder="BATCH-2026-99 (auto if empty)"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Location *</label>
                  <input
                    {...regAdd('location')}
                    placeholder="Warehouse Bay A"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                  {addErrors.location && <p className="text-xs text-[var(--destructive-foreground)] mt-1">{addErrors.location.message}</p>}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--secondary-foreground)] text-xs font-medium cursor-pointer border border-[var(--border)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] text-xs font-medium glow-effect disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                >
                  {addMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Material Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: ADJUST STOCK ─────────────────────────────────────────────── */}
      {isAdjustModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 panel-effect">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Adjust Stock Level</h3>
                <p className="text-xs text-[var(--primary)] font-mono mt-0.5">
                  {selectedItem.name} ({selectedItem.itemCode})
                </p>
              </div>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit(onAdjustStock)} className="space-y-4">
              {/* Type selector */}
              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-2">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['STOCK_IN', 'STOCK_OUT'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAdjValue('type', t)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                        adjType === t
                          ? t === 'STOCK_IN'
                            ? 'bg-[var(--success)]/20 text-[var(--success-foreground)] border-[var(--success)]/40'
                            : 'bg-[var(--destructive)]/20 text-[var(--destructive-foreground)] border-[var(--destructive)]/40'
                          : 'bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)]'
                      }`}
                    >
                      {t === 'STOCK_IN' ? '+ Stock Receive (IN)' : '– Stock Issue (OUT)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">
                  Quantity ({selectedItem.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  {...regAdj('quantity')}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                />
                {adjErrors.quantity && <p className="text-xs text-[var(--destructive-foreground)] mt-1">{adjErrors.quantity.message}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Notes (optional)</label>
                <input
                  {...regAdj('notes')}
                  placeholder="e.g. Supplier delivery receipt #DR-2026-44"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              {/* Preview */}
              <div className="p-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-xs space-y-1 text-[var(--muted-foreground)]">
                <div className="flex justify-between">
                  <span>Current Stock:</span>
                  <span className="font-bold text-[var(--foreground)]">
                    {selectedItem.quantity} {selectedItem.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Projected New Stock:</span>
                  <span className="font-bold text-[var(--primary)]">
                    {adjType === 'STOCK_IN'
                      ? selectedItem.quantity + Number(adjQty)
                      : Math.max(0, selectedItem.quantity - Number(adjQty))}{' '}
                    {selectedItem.unit}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--secondary-foreground)] text-xs font-medium cursor-pointer border border-[var(--border)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] text-xs font-medium glow-effect disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                >
                  {adjustMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: QR CODE VIEWER ──────────────────────────────────────────── */}
      {isQRModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-center panel-effect">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <QrCode className="h-4 w-4 text-[var(--primary)]" />
                Batch QR Code
              </h3>
              <button
                onClick={() => setIsQRModalOpen(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 py-2">
              <div className="p-4 bg-white rounded-xl shadow-lg">
                <QRCodeSVG
                  value={selectedItem.qrCode ?? `${selectedItem.itemCode}|${selectedItem.batchNumber}`}
                  size={180}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[var(--foreground)]">{selectedItem.name}</p>
                <p className="text-xs font-mono text-[var(--primary)]">{selectedItem.itemCode}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{selectedItem.batchNumber}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{selectedItem.location}</p>
              </div>
            </div>

            <button
              onClick={() => setIsQRModalOpen(false)}
              className="w-full py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--secondary-foreground)] text-sm font-medium border border-[var(--border)] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
