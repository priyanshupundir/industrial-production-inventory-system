import React, { useMemo } from 'react';
import {
  Boxes,
  Factory,
  ClipboardCheck,
  AlertTriangle,
  Cpu,
  TrendingUp,
  Activity,
  ShieldCheck,
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
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';
import { useDashboard } from '../hooks/useDashboard';

// ── Static fallback demo chart data ──────────────────────────────────────────
const MONTHLY_DATA = [
  { month: 'Feb', Target: 320, Completed: 290 },
  { month: 'Mar', Target: 380, Completed: 355 },
  { month: 'Apr', Target: 350, Completed: 340 },
  { month: 'May', Target: 400, Completed: 370 },
  { month: 'Jun', Target: 420, Completed: 410 },
  { month: 'Jul', Target: 450, Completed: 395 },
];

const CATEGORY_DATA = [
  { name: 'Raw Materials', value: 42, color: '#3b82f6' },
  { name: 'Components', value: 28, color: '#10b981' },
  { name: 'Finished Goods', value: 18, color: '#f59e0b' },
  { name: 'Spare Parts', value: 12, color: '#8b5cf6' },
];

const DEFECT_DATA = [
  { month: 'Feb', defects: 4.2 },
  { month: 'Mar', defects: 3.8 },
  { month: 'Apr', defects: 5.1 },
  { month: 'May', defects: 3.3 },
  { month: 'Jun', defects: 2.9 },
  { month: 'Jul', defects: 3.5 },
];

const MACHINE_DATA = [
  { machine: 'CNC-01', utilization: 88 },
  { machine: 'LAT-04', utilization: 0 },
  { machine: 'WLD-02', utilization: 94 },
  { machine: 'DRL-07', utilization: 73 },
  { machine: 'PRS-03', utilization: 61 },
];

const MACHINES_TELEMETRY = [
  { id: 'MAC-CNC-01', name: '5-Axis CNC Milling Station A1', status: 'OPERATIONAL', load: 88 },
  { id: 'MAC-LAT-04', name: 'Automated Precision Lathe L-04', status: 'MAINTENANCE_DUE', load: 0 },
  { id: 'MAC-WLD-02', name: 'Robotic Arc Welding Cell W-02', status: 'OPERATIONAL', load: 94 },
];

const TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' },
};

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useDashboard();

  const metrics = data?.metrics;

  const kpis = useMemo(
    () => [
      {
        title: 'Total Inventory Items',
        value: metrics?.totalInventoryItems ?? 248,
        change: `${metrics?.lowStockCount ?? 3} low stock alerts`,
        icon: Boxes,
        gradient: 'from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
        iconColor: 'text-white',
      },
      {
        title: 'Active Production Orders',
        value: metrics?.activeOrders ?? 14,
        change: `${metrics?.totalOrders ?? 47} total orders`,
        icon: Factory,
        gradient: 'from-amber-50 to-orange-50',
        border: 'border-amber-200',
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
        iconColor: 'text-white',
      },
      {
        title: 'Pending Inspections',
        value: metrics?.pendingInspections ?? 6,
        change: 'Awaiting quality review',
        icon: ClipboardCheck,
        gradient: 'from-purple-50 to-pink-50',
        border: 'border-purple-200',
        iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
        iconColor: 'text-white',
      },
      {
        title: 'Low Stock Alerts',
        value: metrics?.lowStockCount ?? 3,
        change: 'Requires reorder review',
        icon: AlertTriangle,
        gradient: 'from-red-50 to-rose-50',
        border: 'border-red-200',
        iconBg: 'bg-gradient-to-br from-red-500 to-rose-500',
        iconColor: 'text-white',
      },
    ],
    [metrics],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Manufacturing Dashboard</h2>
          <p className="text-sm text-slate-500">Real-time inventory metrics, production throughput, and equipment telemetry.</p>
        </div>
        {isLoading && (
          <span className="text-xs text-slate-400 animate-pulse">Syncing live data…</span>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`p-5 rounded-xl border ${kpi.gradient} ${kpi.border} backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-slate-200`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{kpi.title}</span>
                <div className={`p-2 rounded-lg ${kpi.iconBg} shadow-lg ${kpi.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-slate-900 drop-shadow-sm">{isLoading ? '--' : kpi.value}</span>
                <p className="text-xs text-slate-500 mt-1">{kpi.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Row 1: Monthly Production + Inventory Distribution ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Production Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Monthly Production Output</h3>
              <p className="text-xs text-slate-500">Target units vs Actual completed output</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="Target" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Completed" fill="url(#greenGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Distribution Pie */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-lg">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Inventory Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown by category</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 2: Defect Rate Trend + Machine Utilization ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Defect Rate Trend — Line Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Monthly Defect Rate</h3>
              <p className="text-xs text-slate-500">Quality inspection rejection percentage</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEFECT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} unit="%" domain={[0, 8]} />
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={(value: any) => [`${value}%`, 'Defect Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="defects"
                  stroke="url(#purpleGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#c084fc' }}
                />
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Machine Utilization — Radar / Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Machine Utilization</h3>
              <p className="text-xs text-slate-500">Workstation load capacity (%) — current cycle</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={MACHINE_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="machine" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Radar
                  name="Utilization %"
                  dataKey="utilization"
                  stroke="url(#amberGradient)"
                  fill="url(#amberGradientFill)"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [`${v}%`, 'Utilization']} />
                <defs>
                  <linearGradient id="amberGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="amberGradientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Equipment Telemetry ────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-lg">
        <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          Active Workstation Status & Load Telemetry
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MACHINES_TELEMETRY.map((m) => (
            <div key={m.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-blue-600 font-bold">{m.id}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    m.status === 'OPERATIONAL'
                      ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-600 border-emerald-500/30'
                      : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 border-amber-500/30'
                  }`}
                >
                  {m.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 truncate">{m.name}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Workload</span>
                  <span className="font-bold text-slate-900">{m.load}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      m.load > 80 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                        : m.load === 0 
                          ? 'bg-slate-300' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}
                    style={{ width: `${m.load}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
