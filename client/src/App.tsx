import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/Dashboard';
import { InventoryPage } from './pages/Inventory';
import { ProductionOrdersPage } from './pages/ProductionOrders';
import { QualityInspectionPage } from './pages/QualityInspection';
import { MachinesPage } from './pages/Machines';
import { SuppliersPage } from './pages/Suppliers';
import { LoginPage } from './pages/Login';
import { LandingPage } from './pages/Landing';
import type { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!saved || !token) {
      return null;
    }

    return JSON.parse(saved);
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" replace />} />
        <Route path="/" element={!user ? <LandingPage /> : <DashboardLayout user={user} onLogout={handleLogout}><DashboardPage /></DashboardLayout>} />
        <Route path="/inventory" element={user ? <DashboardLayout user={user} onLogout={handleLogout}><InventoryPage /></DashboardLayout> : <Navigate to="/login" replace />} />
        <Route path="/production" element={user ? <DashboardLayout user={user} onLogout={handleLogout}><ProductionOrdersPage /></DashboardLayout> : <Navigate to="/login" replace />} />
        <Route path="/quality" element={user ? <DashboardLayout user={user} onLogout={handleLogout}><QualityInspectionPage /></DashboardLayout> : <Navigate to="/login" replace />} />
        <Route path="/machines" element={user ? <DashboardLayout user={user} onLogout={handleLogout}><MachinesPage /></DashboardLayout> : <Navigate to="/login" replace />} />
        <Route path="/suppliers" element={user ? <DashboardLayout user={user} onLogout={handleLogout}><SuppliersPage /></DashboardLayout> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
