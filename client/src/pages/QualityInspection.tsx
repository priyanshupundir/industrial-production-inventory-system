import React from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  RefreshCw, 
  XCircle, 
  Plus, 
  QrCode 
} from 'lucide-react';
import { QualityInspection } from '../types';

export const QualityInspectionPage: React.FC = () => {
  const dummyInspections: QualityInspection[] = [
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Quality Assurance & Inspection Logs</h2>
          <p className="text-sm text-slate-400">Record sample inspections, defect rates, rework directives, and pass certificates.</p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 transition-all">
          <Plus className="h-4 w-4" />
          Log Inspection Report
        </button>
      </div>

      {/* Summary KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Overall Quality Pass Rate</span>
            <div className="text-2xl font-extrabold text-white">96.8%</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Units Sent for Rework</span>
            <div className="text-2xl font-extrabold text-white">10 Units</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Rejected Scrap Units</span>
            <div className="text-2xl font-extrabold text-white">5 Units</div>
          </div>
        </div>
      </div>

      {/* Inspection Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-semibold text-slate-200 text-sm">
          Recent Quality Inspection Reports
        </div>
        <div className="divide-y divide-slate-800">
          {dummyInspections.map((qc) => (
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
    </div>
  );
};
