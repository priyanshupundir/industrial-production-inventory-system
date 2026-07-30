import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ClipboardCheck,
  CheckCircle2,
  RefreshCw,
  XCircle,
  Plus,
  QrCode,
  X,
  Download,
} from 'lucide-react';
import type { QualityInspection } from '../types';
import { exportToCSV } from '../lib/exportUtils';

// ── Zod Schema ────────────────────────────────────────────────────────────────
const inspectionSchema = z
  .object({
    batchNumber: z.string().min(3, 'Batch number is required'),
    status: z.enum(['PASS', 'REWORK', 'REJECT']),
    sampleSize: z.coerce.number().min(1, 'Sample size must be ≥ 1'),
    passedQty: z.coerce.number().min(0),
    reworkQty: z.coerce.number().min(0),
    rejectedQty: z.coerce.number().min(0),
    notes: z.string().optional(),
  })
  .refine(
    (d) => d.passedQty + d.reworkQty + d.rejectedQty <= d.sampleSize,
    { message: 'Passed + Rework + Rejected cannot exceed Sample Size', path: ['passedQty'] },
  );

type InspectionForm = z.output<typeof inspectionSchema>;

// ── Demo fallback data ────────────────────────────────────────────────────────
const DEMO_INSPECTIONS: QualityInspection[] = [
  {
    id: '1',
    inspectionCode: 'QC-2026-044',
    batchNumber: 'BATCH-PRD-102',
    sampleSize: 50,
    passedQty: 47,
    reworkQty: 2,
    rejectedQty: 1,
    status: 'PASS',
    notes: 'Dimension tolerances within 99.4% spec limit. Minor rework needed on 2 housings.',
    createdAt: '2026-07-21 14:30',
  },
  {
    id: '2',
    inspectionCode: 'QC-2026-043',
    batchNumber: 'BATCH-PRD-099',
    sampleSize: 30,
    passedQty: 18,
    reworkQty: 8,
    rejectedQty: 4,
    status: 'REWORK',
    notes: 'Surface roughness exceeded tolerance on lathe turn. Sent 8 units back for secondary machining.',
    createdAt: '2026-07-20 11:15',
  },
];

export const QualityInspectionPage: React.FC = () => {
  const [inspections, setInspections] = useState<QualityInspection[]>(DEMO_INSPECTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── React Hook Form ───────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InspectionForm>({
    resolver: zodResolver(inspectionSchema) as any,
    defaultValues: {
      batchNumber: 'BATCH-2026-08A',
      status: 'PASS',
      sampleSize: 50,
      passedQty: 48,
      reworkQty: 1,
      rejectedQty: 1,
    },
  });

  const onSubmit = (values: InspectionForm) => {
    const newReport: QualityInspection = {
      id: Date.now().toString(),
      inspectionCode: `QC-2026-0${45 + inspections.length}`,
      batchNumber: values.batchNumber,
      sampleSize: values.sampleSize,
      passedQty: values.passedQty,
      reworkQty: values.reworkQty,
      rejectedQty: values.rejectedQty,
      status: values.status,
      notes: values.notes || 'Inspection completed per ISO 9001 compliance standards.',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setInspections([newReport, ...inspections]);
    setIsModalOpen(false);
    reset();
  };

  // ── KPI Calculations ──────────────────────────────────────────────────────
  const totalPassed = inspections.reduce((a, i) => a + i.passedQty, 0);
  const totalSample = inspections.reduce((a, i) => a + i.sampleSize, 0);
  const passRate = totalSample > 0 ? ((totalPassed / totalSample) * 100).toFixed(1) : '100';
  const totalRework = inspections.reduce((a, i) => a + i.reworkQty, 0);
  const totalRejected = inspections.reduce((a, i) => a + i.rejectedQty, 0);

  // ── Exports ───────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    exportToCSV(
      inspections as unknown as Record<string, unknown>[],
      `quality_inspection_report_${new Date().toISOString().substring(0, 10)}`,
      {
        inspectionCode: 'Inspection Code',
        batchNumber: 'Batch Number',
        sampleSize: 'Sample Size',
        passedQty: 'Passed Qty',
        reworkQty: 'Rework Qty',
        rejectedQty: 'Rejected Qty',
        status: 'Status',
        notes: 'Inspector Notes',
        createdAt: 'Timestamp',
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Quality Assurance & Inspection Logs</h2>
          <p className="text-sm text-slate-500">Record sample inspections, defect rates, rework directives, and pass certificates.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 text-emerald-200 font-medium text-sm border border-emerald-500/30 transition-all cursor-pointer shadow-md"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            Export CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-sm shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Log Inspection Report
          </button>
        </div>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-500/30 flex items-center gap-4 shadow-lg backdrop-blur-sm">
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Overall Quality Pass Rate</span>
            <div className="text-2xl font-extrabold text-slate-900 drop-shadow-sm">{passRate}%</div>
          </div>
        </div>
        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 flex items-center gap-4 shadow-lg backdrop-blur-sm">
          <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Units Sent for Rework</span>
            <div className="text-2xl font-extrabold text-slate-900 drop-shadow-sm">{totalRework} Units</div>
          </div>
        </div>
        <div className="p-5 rounded-xl bg-gradient-to-br from-red-900/30 to-rose-900/30 border border-red-500/30 flex items-center gap-4 shadow-lg backdrop-blur-sm">
          <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Rejected Scrap Units</span>
            <div className="text-2xl font-extrabold text-slate-900 drop-shadow-sm">{totalRejected} Units</div>
          </div>
        </div>
      </div>

      {/* Inspection Log Table */}
      <div id="qc-report-table" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-200 font-semibold text-slate-900 text-sm bg-slate-50">
          Recent Quality Inspection Reports ({inspections.length})
        </div>
        <div className="divide-y divide-slate-200">
          {inspections.map((qc) => (
            <div key={qc.id} className="p-5 hover:bg-slate-50 transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-blue-600">{qc.inspectionCode}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1">
                    <QrCode className="h-3 w-3 text-purple-400" /> {qc.batchNumber}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase border ${
                    qc.status === 'PASS'
                      ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30'
                      : qc.status === 'REJECT'
                      ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border-red-500/30'
                      : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {qc.status === 'PASS' ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : qc.status === 'REJECT' ? (
                    <XCircle className="h-3.5 w-3.5" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  {qc.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 pt-1">
                <div>
                  Sample Size: <span className="font-bold text-slate-900">{qc.sampleSize}</span>
                </div>
                <div>
                  Passed: <span className="font-bold text-emerald-400">{qc.passedQty}</span>
                </div>
                <div>
                  Rework: <span className="font-bold text-amber-400">{qc.reworkQty}</span>
                </div>
                <div>
                  Rejected: <span className="font-bold text-red-400">{qc.rejectedQty}</span>
                </div>
              </div>

              {qc.notes && (
                <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 italic">
                  "{qc.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL: LOG INSPECTION REPORT ─────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-blue-400" />
                Log Quality Inspection Report
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Batch Number *</label>
                  <input
                    {...register('batchNumber')}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm focus:outline-none focus:border-blue-500"
                  />
                  {errors.batchNumber && <p className="text-xs text-red-400 mt-1">{errors.batchNumber.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Inspection Result</label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="PASS">Pass Certificate</option>
                    <option value="REWORK">Rework Directed</option>
                    <option value="REJECT">Rejected Scrap</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {(['sampleSize', 'passedQty', 'reworkQty', 'rejectedQty'] as const).map((field) => (
                  <div key={field}>
                    <label className="text-xs font-medium text-slate-600 block mb-1 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').replace('Qty', ' Qty')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      {...register(field)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
              {errors.passedQty && (
                <p className="text-xs text-red-400">{errors.passedQty.message}</p>
              )}

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Inspector Notes & Tolerance Remarks</label>
                <textarea
                  rows={3}
                  {...register('notes')}
                  placeholder="e.g. Dimensions verified with digital calipers. All tolerances within +/- 0.05mm."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-medium shadow-lg shadow-blue-500/30 cursor-pointer"
                >
                  Log Quality Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
