import React, { useState } from 'react';
import { Cpu, Wrench, CheckCircle2, Clock, X } from 'lucide-react';

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
  const [selectedMachine, setSelectedMachine] = useState<{ id: string; name: string; status: string } | null>(null);
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
        <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Workstations & Machine Maintenance</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Monitor equipment status, assigned production orders, and preventative maintenance schedules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {machines.map((m) => {
          const isOverdue = m.status === 'MAINTENANCE_DUE';
          return (
            <div key={m.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 space-y-4 panel-effect hover:border-[var(--primary)] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--primary)] font-bold px-2 py-1 rounded bg-[var(--secondary)] border border-[var(--border)]">
                  {m.id}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                  isOverdue 
                    ? 'bg-[var(--warning)]/20 text-[var(--warning-foreground)] border-[var(--warning)]/30' 
                    : 'bg-[var(--success)]/20 text-[var(--success-foreground)] border-[var(--success)]/30'
                }`}>
                  {m.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-[var(--foreground)] text-base leading-snug">{m.name}</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">{m.model} • {m.department}</p>
              </div>

              <div className="pt-3 border-t border-[var(--border)] space-y-2 text-xs text-[var(--muted-foreground)]">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--muted-foreground)] flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[var(--primary)]" /> Preventative Maintenance:
                  </span>
                  <span className={`font-semibold ${isOverdue ? 'text-[var(--warning)]' : 'text-[var(--foreground)]'}`}>
                    {m.maintenanceDue}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--muted-foreground)] flex items-center gap-1">
                    <Cpu className="h-3.5 w-3.5 text-[var(--primary)]" /> Active Production Order:
                  </span>
                  <span className="font-mono text-[var(--primary)] font-medium">{m.assignedOrder}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedMachine(m);
                  setIsModalOpen(true);
                }}
                className="w-full py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--primary)] text-[var(--secondary-foreground)] hover:text-[var(--primary-foreground)] text-xs font-medium border border-[var(--border)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 panel-effect">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Log Maintenance Record</h3>
                <p className="text-xs text-[var(--primary)] font-mono mt-0.5">{selectedMachine.name} ({selectedMachine.id})</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleResolveMaintenance} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Action Taken & Maintenance Remarks *</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Replaced hydraulic filter seals, refilled lubricant fluid, and recalibrated axis alignment."
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Maintenance Cost (₹ / $)</label>
                <input
                  type="number"
                  value={maintenanceCost}
                  onChange={(e) => setMaintenanceCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                />
              </div>

              <div className="p-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-xs space-y-1 text-[var(--muted-foreground)]">
                <div className="flex justify-between">
                  <span>Updated Status:</span>
                  <span className="font-bold text-[var(--success)] flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> OPERATIONAL
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--secondary-foreground)] text-xs font-medium border border-[var(--border)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] text-xs font-medium glow-effect"
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
