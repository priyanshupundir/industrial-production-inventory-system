import React from 'react';
import { Cpu, Wrench, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export const MachinesPage: React.FC = () => {
  const machines = [
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
  ];

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

              <button className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all flex items-center justify-center gap-1.5">
                <Wrench className="h-3.5 w-3.5" />
                Log Maintenance Activity
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
