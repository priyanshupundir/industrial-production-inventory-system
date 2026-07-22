import React, { useState } from 'react';
import { Cpu, Wrench, AlertTriangle, CheckCircle2, Clock, X } from 'lucide-react';

export const MachinesPage: React.FC = () => {
  const [machines, setMachines] = useState([
    {
      id: 'MAC-CNC-01',
      name: '5-Axis CNC Milling Station A1',
      model: 'Haas-VF4-2024',
      department: 'CNC & Precision Machining',
      status: 'OPERATIONAL',
      maintenanceDue: '2026-08-05',
      assignedOrder: 'PRD-2026-101'
    },
    {
      id: 'MAC-LAT-04',
      name: 'Automated Precision Lathe L-04',
      model: 'DMG-Mori-CLX350',
      department: 'CNC & Precision Machining',
      status: 'MAINTENANCE_DUE',
      maintenanceDue: '2026-07-19 (Overdue)',
      assignedOrder: 'PRD-2026-102'
    },
    {
      id: 'MAC-WLD-02',
      name: 'Robotic Arc Welding Cell W-02',
      model: 'KUKA-KR8-R2100',
      department: 'Assembly & Finishing',
      status: 'OPERATIONAL',
      maintenanceDue: '2026-08-20',
      assignedOrder: 'None'
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [actionTaken, setActionTaken] = useState('');
  const [maintenanceCost, setMaintenanceCost] = useState(1500);

  const handleResolveMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine) return;

    const updated = machines.map(m => {
      if (m.id === selectedMachine.id) {
        return {
          ...m,
          status: 'OPERATIONAL',
          maintenanceDue: '2026-08-30'
        };
      }
      return m;
    });

    setMachines(updated);
    setIsModalOpen(false);
    setSelectedMachine(null);
    setActionTaken('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Workstations & Machine Maintenance</h2>
        <p className="text-sm text-slate-400">Monitor equipment status, assigned production orders, and preventative maintenance schedules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {machines.map((m) => {
          const isOverdue = m.status === 'MAINTENANCE_DUE';
          return (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-blue-400 font-bold px-2 py-1 rounded bg-slate-950 border border-slate-800">
                  {m.id}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                  isOverdue 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>
                  {m.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-100 text-base leading-snug">{m.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{m.model} • {m.department}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-500" /> Preventative Maintenance:
                  </span>
                  <span className={`font-semibold ${isOverdue ? 'text-amber-400' : 'text-slate-200'}`}>
                    {m.maintenanceDue}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Cpu className="h-3.5 w-3.5 text-blue-400" /> Active Production Order:
                  </span>
                  <span className="font-mono text-blue-400 font-medium">{m.assignedOrder}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedMachine(m);
                  setIsModalOpen(true);
                }}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Wrench className="h-3.5 w-3.5" />
                Log Maintenance Activity
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL: LOG MAINTENANCE ACTIVITY */}
      {isModalOpen && selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Log Maintenance Record</h3>
                <p className="text-xs text-blue-400 font-mono mt-0.5">{selectedMachine.name} ({selectedMachine.id})</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleResolveMaintenance} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Action Taken & Maintenance Remarks *</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Replaced hydraulic filter seals, refilled lubricant fluid, and recalibrated axis alignment."
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Maintenance Cost (₹ / $)</label>
                <input
                  type="number"
                  value={maintenanceCost}
                  onChange={(e) => setMaintenanceCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Updated Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> OPERATIONAL
                  </span>
                </div>
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
                  Complete & Set Operational
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
