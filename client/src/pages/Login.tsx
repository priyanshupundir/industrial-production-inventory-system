import React, { useState } from 'react';
import { Factory, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import type { Role, User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User, token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('manager@industrial.com');
  const [password, setPassword] = useState('password123');

  const demoAccounts = [
    { role: 'ADMIN' as Role, title: 'System Admin', email: 'admin@industrial.com', bg: 'hover:border-amber-500/50' },
    { role: 'PRODUCTION_MANAGER' as Role, title: 'Production Manager', email: 'manager@industrial.com', bg: 'hover:border-blue-500/50' },
    { role: 'STORE_OFFICER' as Role, title: 'Store Officer', email: 'officer@industrial.com', bg: 'hover:border-emerald-500/50' },
    { role: 'QUALITY_INSPECTOR' as Role, title: 'Quality Inspector', email: 'inspector@industrial.com', bg: 'hover:border-purple-500/50' },
  ];

  const handleQuickLogin = (demoEmail: string, role: Role) => {
    const demoUser: User = {
      id: 'demo-user-id',
      name: demoAccounts.find(a => a.email === demoEmail)?.title || 'Demo User',
      email: demoEmail,
      role: role,
      department: 'Operations'
    };
    onLoginSuccess(demoUser, 'demo-jwt-access-token');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const demoUser: User = {
      id: 'demo-user-id',
      name: 'Ananya Roy (Production Manager)',
      email: email,
      role: 'PRODUCTION_MANAGER',
      department: 'CNC & Precision Machining'
    };
    onLoginSuccess(demoUser, 'demo-jwt-access-token');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Factory className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">INDUS-SYS Operational Login</h1>
          <p className="text-xs text-slate-400">Industrial Production & Inventory Management System</p>
        </div>

        {/* Demo Quick Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block text-center">
            Select Role to Demo System
          </span>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => handleQuickLogin(acc.email, acc.role)}
                className={`p-3 rounded-lg bg-slate-950 border border-slate-800 text-left transition-all ${acc.bg} group`}
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 flex items-center justify-between">
                  {acc.title}
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="h-4 w-4" />
            Authenticate Session
          </button>
        </form>
      </div>
    </div>
  );
};
