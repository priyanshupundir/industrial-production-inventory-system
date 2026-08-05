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
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const newReport: QualityInspection = {
      id: now.toString(),
      inspectionCode: `QC-2026-0${45 + inspections.length}`,
      batchNumber: values.batchNumber,
      sampleSize: values.sampleSize,
      passedQty: values.passedQty,
      reworkQty: values.reworkQty,
      rejectedQty: values.rejectedQty,
      status: values.status,
      notes: values.notes || 'Inspection completed per ISO 9001 compliance standards.',
      createdAt: new Date(now).toISOString().replace('T', ' ').substring(0, 16),
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
          <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Quality Assurance & Inspection Logs</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Record sample inspections, defect rates, rework directives, and pass certificates.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[var(--success)]/20 hover:bg-[var(--success)]/30 text-[var(--success-foreground)] font-medium text-sm border border-[var(--success)]/30 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-[var(--success)]" />
            Export CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-medium text-sm glow-effect transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Log Inspection Report
          </button>
        </div>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[var(--success)]/20 border border-[var(--success)]/30 flex items-center gap-4 panel-effect">
          <div className="p-3 rounded-lg bg-[var(--success)] text-[var(--success-foreground)] glow-effect">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Overall Quality Pass Rate</span>
            <div className="text-2xl font-extrabold text-[var(--foreground)] drop-shadow-sm">{passRate}%</div>
          </div>
        </div>
        <div className="p-5 rounded-xl bg-[var(--warning)]/20 border border-[var(--warning)]/30 flex items-center gap-4 panel-effect">
          <div className="p-3 rounded-lg bg-[var(--warning)] text-[var(--warning-foreground)] glow-effect">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Units Sent for Rework</span>
            <div className="text-2xl font-extrabold text-[var(--foreground)] drop-shadow-sm">{totalRework} Units</div>
          </div>
        </div>
        <div className="p-5 rounded-xl bg-[var(--destructive)]/20 border border-[var(--destructive)]/30 flex items-center gap-4 panel-effect">
          <div className="p-3 rounded-lg bg-[var(--destructive)] text-[var(--destructive-foreground)] glow-effect">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Rejected Scrap Units</span>
            <div className="text-2xl font-extrabold text-[var(--foreground)] drop-shadow-sm">{totalRejected} Units</div>
          </div>
        </div>
      </div>

      {/* Inspection Log Table */}
      <div id="qc-report-table" className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden panel-effect">
        <div className="p-4 border-b border-[var(--border)] font-semibold text-[var(--foreground)] text-sm bg-[var(--muted)]">
          Recent Quality Inspection Reports ({inspections.length})
        </div>
        <div className="divide-y divide-[var(--border)]">
          {inspections.map((qc) => (
            <div key={qc.id} className="p-5 hover:bg-[var(--muted)] transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[var(--primary)]">{qc.inspectionCode}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)] flex items-center gap-1">
                    <QrCode className="h-3 w-3 text-[var(--primary)]" /> {qc.batchNumber}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase border ${
                    qc.status === 'PASS'
                      ? 'bg-[var(--success)]/20 text-[var(--success-foreground)] border-[var(--success)]/30'
                      : qc.status === 'REJECT'
                      ? 'bg-[var(--destructive)]/20 text-[var(--destructive-foreground)] border-[var(--destructive)]/30'
                      : 'bg-[var(--warning)]/20 text-[var(--warning-foreground)] border-[var(--warning)]/30'
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[var(--muted-foreground)] pt-1">
                <div>
                  Sample Size: <span className="font-bold text-[var(--foreground)]">{qc.sampleSize}</span>
                </div>
                <div>
                  Passed: <span className="font-bold text-[var(--success)]">{qc.passedQty}</span>
                </div>
                <div>
                  Rework: <span className="font-bold text-[var(--warning)]">{qc.reworkQty}</span>
                </div>
                <div>
                  Rejected: <span className="font-bold text-[var(--destructive)]">{qc.rejectedQty}</span>
                </div>
              </div>

              {qc.notes && (
                <p className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] p-3 rounded-lg border border-[var(--border)] italic">
                  "{qc.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL: LOG INSPECTION REPORT ─────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4 panel-effect">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-[var(--primary)]" />
                Log Quality Inspection Report
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Batch Number *</label>
                  <input
                    {...register('batchNumber')}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                  {errors.batchNumber && <p className="text-xs text-[var(--destructive-foreground)] mt-1">{errors.batchNumber.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Inspection Result</label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
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
                    <label className="text-xs font-medium text-[var(--foreground)] block mb-1 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').replace('Qty', ' Qty')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      {...register(field)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                ))}
              </div>
              {errors.passedQty && (
                <p className="text-xs text-[var(--destructive-foreground)]">{errors.passedQty.message}</p>
              )}

              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Inspector Notes & Tolerance Remarks</label>
                <textarea
                  rows={3}
                  {...register('notes')}
                  placeholder="e.g. Dimensions verified with digital calipers. All tolerances within +/- 0.05mm."
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--secondary-foreground)] text-xs font-medium cursor-pointer border border-[var(--border)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] text-xs font-medium glow-effect flex items-center gap-2 cursor-pointer"
                >
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  Log Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
