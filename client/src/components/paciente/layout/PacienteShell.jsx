import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../../header/Header';
import Aside from '../../header/Aside';
import '../../../pages/Paciente/plantilla.css';

export default function PacienteShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggleSidebar = () => setSidebarOpen((s) => !s);
  const handleCloseSidebar = () => setSidebarOpen(false);
  const handleLogout = () => {
    // Aquí podrías limpiar credenciales si aplica
    setSidebarOpen(false);
    navigate('/auth/login', { replace: true });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header onToggleSidebar={handleToggleSidebar} onLogout={handleLogout} />
      <div className="d-flex flex-grow-1">
        <Aside isOpen={sidebarOpen} onClose={handleCloseSidebar} onLogout={handleLogout} />
        <main className="flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
