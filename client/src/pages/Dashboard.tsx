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
  { name: 'Raw Materials', value: 42, color: 'oklch(0.7 0.18 220)' },
  { name: 'Components', value: 28, color: 'oklch(0.7 0.18 145)' },
  { name: 'Finished Goods', value: 18, color: 'oklch(0.75 0.15 85)' },
  { name: 'Spare Parts', value: 12, color: 'oklch(0.7 0.18 280)' },
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
  contentStyle: { backgroundColor: 'oklch(0.19 0.008 160)', borderColor: 'oklch(0.3 0.008 160)', borderRadius: '8px', color: 'oklch(0.95 0.02 155)' },
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
        bg: 'bg-[var(--card)]',
        border: 'border-[var(--border)]',
        iconBg: 'bg-[var(--primary)]',
        iconColor: 'text-[var(--primary-foreground)]',
        titleColor: 'text-[var(--foreground)]',
        valueColor: 'text-[var(--foreground)]',
        changeColor: 'text-[var(--muted-foreground)]',
      },
      {
        title: 'Active Production Orders',
        value: metrics?.activeOrders ?? 14,
        change: `${metrics?.totalOrders ?? 47} total orders`,
        icon: Factory,
        bg: 'bg-[var(--card)]',
        border: 'border-[var(--border)]',
        iconBg: 'bg-[var(--warning)]',
        iconColor: 'text-[var(--warning-foreground)]',
        titleColor: 'text-[var(--foreground)]',
        valueColor: 'text-[var(--foreground)]',
        changeColor: 'text-[var(--muted-foreground)]',
      },
      {
        title: 'Pending Inspections',
        value: metrics?.pendingInspections ?? 6,
        change: 'Awaiting quality review',
        icon: ClipboardCheck,
        bg: 'bg-[var(--card)]',
        border: 'border-[var(--border)]',
        iconBg: 'bg-[var(--info)]',
        iconColor: 'text-[var(--info-foreground)]',
        titleColor: 'text-[var(--foreground)]',
        valueColor: 'text-[var(--foreground)]',
        changeColor: 'text-[var(--muted-foreground)]',
      },
      {
        title: 'Low Stock Alerts',
        value: metrics?.lowStockCount ?? 3,
        change: 'Requires reorder review',
        icon: AlertTriangle,
        bg: 'bg-[var(--card)]',
        border: 'border-[var(--border)]',
        iconBg: 'bg-[var(--destructive)]',
        iconColor: 'text-[var(--destructive-foreground)]',
        titleColor: 'text-[var(--foreground)]',
        valueColor: 'text-[var(--foreground)]',
        changeColor: 'text-[var(--muted-foreground)]',
      },
    ],
    [metrics],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Executive Manufacturing Dashboard</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Real-time inventory metrics, production throughput, and equipment telemetry.</p>
        </div>
        {isLoading && (
          <span className="text-xs text-[var(--muted-foreground)] animate-pulse">Syncing live data…</span>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`p-4 sm:p-5 rounded-xl border ${kpi.bg} ${kpi.border} panel-effect transition-all hover:scale-[1.02] hover:shadow-lg`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${kpi.titleColor}`}>{kpi.title}</span>
                <div className={`p-1.5 sm:p-2 rounded-lg ${kpi.iconBg} glow-effect ${kpi.iconColor}`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <span className={`text-2xl sm:text-3xl font-extrabold ${kpi.valueColor} drop-shadow-sm`}>{isLoading ? '--' : kpi.value}</span>
                <p className={`text-[10px] sm:text-xs ${kpi.changeColor} mt-1`}>{kpi.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Row 1: Monthly Production + Inventory Distribution ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Monthly Production Bar Chart */}
        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4 panel-effect">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)]">Monthly Production Output</h3>
              <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">Target units vs Actual completed output</p>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-[var(--primary)] glow-effect">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--primary-foreground)]" />
            </div>
          </div>
          <div className="h-48 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.008 160)" />
                <XAxis dataKey="month" stroke="oklch(0.7 0.02 160)" fontSize={10} />
                <YAxis stroke="oklch(0.7 0.02 160)" fontSize={10} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="Target" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Completed" fill="url(#greenGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.7 0.18 220)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="oklch(0.86 0.22 128)" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.7 0.18 145)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="oklch(0.86 0.22 128)" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Distribution Pie */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4 panel-effect">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)]">Inventory Distribution</h3>
            <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">Breakdown by category</p>
          </div>
          <div className="h-48 sm:h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
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
                  formatter={(value) => <span className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 2: Defect Rate Trend + Machine Utilization ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Defect Rate Trend — Line Chart */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4 panel-effect">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)]">Monthly Defect Rate</h3>
              <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">Quality inspection rejection percentage</p>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-[var(--info)] glow-effect">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--info-foreground)]" />
            </div>
          </div>
          <div className="h-48 sm:h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEFECT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.008 160)" />
                <XAxis dataKey="month" stroke="oklch(0.7 0.02 160)" fontSize={10} />
                <YAxis stroke="oklch(0.7 0.02 160)" fontSize={10} unit="%" domain={[0, 8]} />
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={(value: any) => [`${value}%`, 'Defect Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="defects"
                  stroke="url(#purpleGradient)"
                  strokeWidth={3}
                  dot={{ fill: 'oklch(0.7 0.18 280)', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: 'oklch(0.86 0.22 128)' }}
                />
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="oklch(0.7 0.18 280)" stopOpacity={1}/>
                    <stop offset="95%" stopColor="oklch(0.86 0.22 128)" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Machine Utilization — Radar / Bar Chart */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4 panel-effect">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)]">Machine Utilization</h3>
              <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">Workstation load capacity (%) — current cycle</p>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-[var(--warning)] glow-effect">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--warning-foreground)]" />
            </div>
          </div>
          <div className="h-48 sm:h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={MACHINE_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="oklch(0.3 0.008 160)" />
                <PolarAngleAxis dataKey="machine" tick={{ fill: 'oklch(0.7 0.02 160)', fontSize: 9 }} />
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
                    <stop offset="5%" stopColor="oklch(0.75 0.15 85)" stopOpacity={1}/>
                    <stop offset="95%" stopColor="oklch(0.86 0.22 128)" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="amberGradientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.75 0.15 85)" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="oklch(0.86 0.22 128)" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Equipment Telemetry ────────────────────────────────────────────── */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 panel-effect">
        <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)] mb-3 sm:mb-4 flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-[var(--primary)] glow-effect">
            <Cpu className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--primary-foreground)]" />
          </div>
          Active Workstation Status & Load Telemetry
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {MACHINES_TELEMETRY.map((m) => (
            <div key={m.id} className="p-3 sm:p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)] space-y-2 sm:space-y-3 panel-effect">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-mono text-[var(--primary)] font-bold">{m.id}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    m.status === 'OPERATIONAL'
                      ? 'bg-[var(--success)]/20 text-[var(--success-foreground)] border-[var(--success)]/30'
                      : 'bg-[var(--warning)]/20 text-[var(--warning-foreground)] border-[var(--warning)]/30'
                  }`}
                >
                  {m.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[10px] sm:text-sm font-semibold text-[var(--foreground)] truncate">{m.name}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] sm:text-xs text-[var(--muted-foreground)]">
                  <span>Workload</span>
                  <span className="font-bold text-[var(--foreground)]">{m.load}%</span>
                </div>
                <div className="h-1.5 sm:h-2 w-full bg-[var(--secondary)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      m.load > 80 
                        ? 'bg-[var(--warning)]' 
                        : m.load === 0 
                          ? 'bg-[var(--muted)]' 
                          : 'bg-[var(--primary)]'
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
