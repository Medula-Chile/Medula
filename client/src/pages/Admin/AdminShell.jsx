import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminHeader from './header/AdminHeader.jsx';
import AdminAside from './header/AdminAside.jsx';

export default function AdminShell() {
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
      <AdminHeader onToggleSidebar={handleToggleSidebar} onLogout={handleLogout} />
      <div className="d-flex flex-grow-1">
        <AdminAside isOpen={sidebarOpen} onClose={handleCloseSidebar} onLogout={handleLogout} />
        <main className="flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
