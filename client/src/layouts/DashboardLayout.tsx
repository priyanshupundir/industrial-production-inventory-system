import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Factory, 
  Boxes, 
  ClipboardCheck, 
  Cpu, 
  BarChart3, 
  LogOut, 
  User as UserIcon,
  Bell,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import type { User } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: BarChart3 },
    { name: 'Inventory & Stock', path: '/inventory', icon: Boxes },
    { name: 'Production Orders', path: '/production', icon: Factory },
    { name: 'Quality Inspection', path: '/quality', icon: ClipboardCheck },
    { name: 'Machines & Maintenance', path: '/machines', icon: Cpu },
  ];

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'PRODUCTION_MANAGER': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'STORE_OFFICER': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'QUALITY_INSPECTOR': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            <Factory className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-white">INDUS-SYS</h1>
            <p className="text-xs text-slate-400">Production & Inventory</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <UserIcon className="h-4 w-4 text-slate-300" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Demo User'}</p>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border uppercase mt-0.5 ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role?.replace('_', ' ') || 'GUEST'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs font-medium border border-slate-700 hover:border-red-500/30 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Manufacturing Security Protocol Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
