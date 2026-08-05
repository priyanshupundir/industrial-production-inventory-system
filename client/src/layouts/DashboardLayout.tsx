import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Truck
} from 'lucide-react';
import type { User } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user, onLogout }) => {

  const navItems = [
    { name: 'Dashboard', path: '/', icon: BarChart3 },
    { name: 'Inventory & Stock', path: '/inventory', icon: Boxes },
    { name: 'Production Orders', path: '/production', icon: Factory },
    { name: 'Quality Inspection', path: '/quality', icon: ClipboardCheck },
    { name: 'Machines & Maintenance', path: '/machines', icon: Cpu },
    { name: 'Suppliers & Requisitions', path: '/suppliers', icon: Truck },
  ];

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-[var(--warning)]/20 text-[var(--warning-foreground)] border-[var(--warning)]/30';
      case 'PRODUCTION_MANAGER': return 'bg-[var(--info)]/20 text-[var(--info-foreground)] border-[var(--info)]/30';
      case 'STORE_OFFICER': return 'bg-[var(--success)]/20 text-[var(--success-foreground)] border-[var(--success)]/30';
      case 'QUALITY_INSPECTOR': return 'bg-[var(--destructive)]/20 text-[var(--destructive-foreground)] border-[var(--destructive)]/30';
      default: return 'bg-[var(--muted)]/20 text-[var(--muted-foreground)] border-[var(--border)]/30';
    }
  };

  return (
    <div className="min-h-screen text-[var(--foreground)] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--card)] border-r border-[var(--border)] flex flex-col shrink-0 panel-effect">
        <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[var(--primary)] flex items-center justify-center font-bold text-[var(--primary-foreground)] glow-effect">
            <Factory className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-[var(--foreground)]">INDUS-SYS</h1>
            <p className="text-xs text-[var(--muted-foreground)]">Production & Inventory</p>
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
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] glow-effect font-semibold'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[var(--primary-foreground)]' : 'text-[var(--muted-foreground)]'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--muted)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-full bg-[var(--primary)] border border-[var(--border)] flex items-center justify-center shrink-0">
                <UserIcon className="h-4 w-4 text-[var(--primary-foreground)]" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-[var(--foreground)] truncate">{user?.name || 'Demo User'}</p>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border uppercase mt-0.5 ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role?.replace('_', ' ') || 'GUEST'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--destructive)]/20 text-[var(--secondary-foreground)] hover:text-[var(--destructive-foreground)] text-xs font-medium border border-[var(--border)] hover:border-[var(--destructive)]/30 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[var(--popover)]/80 backdrop-blur border-b border-[var(--border)] px-6 flex items-center justify-between sticky top-0 z-10 panel-effect">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[var(--success)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Manufacturing Security Protocol Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] transition-all">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[var(--warning)] animate-pulse" />
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
