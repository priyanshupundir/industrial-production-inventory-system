import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/Dashboard';
import { InventoryPage } from './pages/Inventory';
import { ProductionOrdersPage } from './pages/ProductionOrders';
import { QualityInspectionPage } from './pages/QualityInspection';
import { MachinesPage } from './pages/Machines';
import { LoginPage } from './pages/Login';
import type { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : {
      id: 'demo-mgr-1',
      name: 'Ananya Roy (Production Manager)',
      email: 'manager@industrial.com',
      role: 'PRODUCTION_MANAGER',
      department: 'CNC & Precision Machining'
    };
  });

  const handleLoginSuccess = (loggedUser: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <BrowserRouter>
      <DashboardLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/production" element={<ProductionOrdersPage />} />
          <Route path="/quality" element={<QualityInspectionPage />} />
          <Route path="/machines" element={<MachinesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;