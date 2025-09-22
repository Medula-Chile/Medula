import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import MedicalHeader from './header/MedicalHeader.jsx';
import MedicalAside from './header/MedicalAside.jsx';

export default function DoctorShell() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleToggleSidebar = () => setSidebarOpen((s) => !s);
  const handleCloseSidebar = () => setSidebarOpen(false);
  const handleLogout = () => {
    setSidebarOpen(false);
    navigate('/auth/login', { replace: true });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <MedicalHeader onToggleSidebar={handleToggleSidebar} />

      <div className="d-flex flex-grow-1">
        <MedicalAside isOpen={sidebarOpen} onClose={handleCloseSidebar} onLogout={handleLogout} />

        <main className="flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
