import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  RefreshCw, 
  XCircle, 
  Plus, 
  QrCode,
  X,
  Download
} from 'lucide-react';
import type { QualityInspection } from '../types';
import { exportToCSV } from '../lib/exportUtils';

export const QualityInspectionPage: React.FC = () => {
  const [inspections, setInspections] = useState<QualityInspection[]>([
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
      createdAt: '2026-07-21 14:30'
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
      createdAt: '2026-07-20 11:15'
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batchNumber, setBatchNumber] = useState('BATCH-2026-08A');
  const [sampleSize, setSampleSize] = useState(50);
  const [passedQty, setPassedQty] = useState(48);
  const [reworkQty, setReworkQty] = useState(1);
  const [rejectedQty, setRejectedQty] = useState(1);
  const [status, setStatus] = useState<'PASS' | 'REWORK' | 'REJECT'>('PASS');
  const [notes, setNotes] = useState('');

  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault();

    const newReport: QualityInspection = {
      id: Date.now().toString(),
      inspectionCode: `QC-2026-0${Math.floor(45 + inspections.length)}`,
      batchNumber,
      sampleSize: Number(sampleSize),
      passedQty: Number(passedQty),
      reworkQty: Number(reworkQty),
      rejectedQty: Number(rejectedQty),
      status,
      notes: notes || 'Inspection completed according to ISO 9001 compliance standards.',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setInspections([newReport, ...inspections]);
    setIsModalOpen(false);
    setNotes('');
  };

  const handleExportCSV = () => {
    exportToCSV(
      inspections,
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
        createdAt: 'Timestamp'
      }
    );
  };

  // Recalculate KPIs
  const totalPassed = inspections.reduce((acc, i) => acc + i.passedQty, 0);
  const totalSample = inspections.reduce((acc, i) => acc + i.sampleSize, 0);
  const passRate = totalSample > 0 ? ((totalPassed / totalSample) * 100).toFixed(1) : '100';
  const totalRework = inspections.reduce((acc, i) => acc + i.reworkQty, 0);
  const totalRejected = inspections.reduce((acc, i) => acc + i.rejectedQty, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Quality Assurance & Inspection Logs</h2>
          <p className="text-sm text-slate-400">Record sample inspections, defect rates, rework directives, and pass certificates.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            Export Quality Report
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Log Inspection Report
          </button>
        </div>
      </div>

      {/* Summary KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Overall Quality Pass Rate</span>
            <div className="text-2xl font-extrabold text-white">{passRate}%</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Units Sent for Rework</span>
            <div className="text-2xl font-extrabold text-white">{totalRework} Units</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Rejected Scrap Units</span>
            <div className="text-2xl font-extrabold text-white">{totalRejected} Units</div>
          </div>
        </div>
      </div>

      {/* Inspection Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-semibold text-slate-200 text-sm">
          Recent Quality Inspection Reports ({inspections.length})
        </div>
        <div className="divide-y divide-slate-800">
          {inspections.map((qc) => (
            <div key={qc.id} className="p-5 hover:bg-slate-800/40 transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-blue-400">{qc.inspectionCode}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <QrCode className="h-3 w-3" /> {qc.batchNumber}
                  </span>
                </div>

                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase border ${
                  qc.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {qc.status === 'PASS' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  {qc.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300 pt-1">
                <div>Sample Size: <span className="font-bold text-white">{qc.sampleSize}</span></div>
                <div>Passed: <span className="font-bold text-emerald-400">{qc.passedQty}</span></div>
                <div>Rework: <span className="font-bold text-amber-400">{qc.reworkQty}</span></div>
                <div>Rejected: <span className="font-bold text-red-400">{qc.rejectedQty}</span></div>
              </div>

              {qc.notes && (
                <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800 italic">
                  "{qc.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: LOG INSPECTION REPORT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-blue-400" />
                Log Quality Inspection Report
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddInspection} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Inspection Result</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="PASS">Pass Certificate</option>
                    <option value="REWORK">Rework Directed</option>
                    <option value="REJECT">Rejected Scrap</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Sample Size</label>
                  <input
                    type="number"
                    value={sampleSize}
                    onChange={(e) => setSampleSize(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Passed Qty</label>
                  <input
                    type="number"
                    value={passedQty}
                    onChange={(e) => setPassedQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Rework Qty</label>
                  <input
                    type="number"
                    value={reworkQty}
                    onChange={(e) => setReworkQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Rejected Qty</label>
                  <input
                    type="number"
                    value={rejectedQty}
                    onChange={(e) => setRejectedQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Inspector Notes & Tolerance Remarks</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Dimensions verified with digital calipers. All tolerances within +/- 0.05mm."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
