import React from 'react';
import { 
  Boxes, 
  Factory, 
  ClipboardCheck, 
  AlertTriangle, 
  Cpu, 
  TrendingUp,
  CheckCircle2,
  Package
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const kpis = [
    { title: 'Total Inventory Items', value: '513', change: '+12% this month', icon: Boxes, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Active Production Orders', value: '18', change: '4 Pending Quality', icon: Factory, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { title: 'Pending Inspections', value: '6', change: '2 Urgent Priority', icon: ClipboardCheck, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { title: 'Low Stock Alerts', value: '3', change: 'Requires Reorder', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ];

  const monthlyData = [
    { month: 'Jan', Target: 120, Completed: 115 },
    { month: 'Feb', Target: 140, Completed: 138 },
    { month: 'Mar', Target: 160, Completed: 152 },
    { month: 'Apr', Target: 180, Completed: 175 },
    { month: 'May', Target: 200, Completed: 198 },
    { month: 'Jun', Target: 220, Completed: 210 },
    { month: 'Jul', Target: 250, Completed: 242 },
  ];

  const categoryData = [
    { name: 'Raw Material', value: 45, color: '#3b82f6' },
    { name: 'Components', value: 30, color: '#10b981' },
    { name: 'Finished Goods', value: 15, color: '#f59e0b' },
    { name: 'Spare Parts', value: 10, color: '#8b5cf6' },
  ];

  const activeMachines = [
    { id: 'MAC-CNC-01', name: '5-Axis CNC Milling Station A1', status: 'OPERATIONAL', load: '88%' },
    { id: 'MAC-LAT-04', name: 'Automated Precision Lathe L-04', status: 'MAINTENANCE_DUE', load: '0%' },
    { id: 'MAC-WLD-02', name: 'Robotic Arc Welding Cell W-02', status: 'OPERATIONAL', load: '94%' },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Executive Manufacturing Dashboard</h2>
        <p className="text-sm text-slate-400">Real-time inventory metrics, production throughput, and equipment telemetry.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`p-5 rounded-xl border ${kpi.bg} transition-all hover:scale-[1.02]`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                <div className={`p-2 rounded-lg bg-slate-900/60 ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-white">{kpi.value}</span>
                <p className="text-xs text-slate-400 mt-1">{kpi.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Production Throughput */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-200">Monthly Production Output</h3>
              <p className="text-xs text-slate-400">Target units vs Actual completed output</p>
            </div>
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="Target" fill="#3b82f6" opacity={0.4} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-200">Inventory Distribution</h3>
            <p className="text-xs text-slate-400">Breakdown by category</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Equipment Telemetry */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-blue-400" />
          Active Workstation Status & Load Telemetry
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeMachines.map((m) => (
            <div key={m.id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-blue-400 font-bold">{m.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  m.status === 'OPERATIONAL' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {m.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-200 truncate">{m.name}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Workload</span>
                  <span>{m.load}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: m.load }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
