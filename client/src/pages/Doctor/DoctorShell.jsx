import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import MedicalHeader from './header/MedicalHeader.jsx';
import MedicalAside from './header/MedicalAside.jsx';

export default function DoctorShell() {
  // "DoctorShell" es el layout base del Portal del Médico.
  // Renderiza el encabezado y el menú lateral específicos del médico
  // y usa <Outlet /> para inyectar las páginas hijas (inicio, agenda, pacientes, etc.).
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  // Alterna/cierras el menú lateral en móviles y tablets.
  const handleToggleSidebar = () => setSidebarOpen((s) => !s);
  const handleCloseSidebar = () => setSidebarOpen(false);
  // Cierra sesión y retorna al login de la app.
  const handleLogout = () => {
    setSidebarOpen(false);
    navigate('/auth/login', { replace: true });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header superior con acciones y branding del Portal del Médico */}
      <MedicalHeader onToggleSidebar={handleToggleSidebar} />

      <div className="d-flex flex-grow-1">
        {/* Menú lateral con navegación de la sección del Médico */}
        <MedicalAside isOpen={sidebarOpen} onClose={handleCloseSidebar} onLogout={handleLogout} />

        {/* Contenedor principal donde se renderizan las rutas hijas declaradas en App.jsx */}
        <style>{`
          .doctor-main { overflow-x: hidden; width: 100%; max-width: 100vw; }
          /* Match header paddings: header has px-3 (1rem) and px-md-4 (1.5rem) */
          .doctor-main { padding-left: 1rem; padding-right: 1rem; padding-top: 1rem; padding-bottom: 1rem; }
          @media (min-width: 768px) { .doctor-main { padding-left: 1.5rem; padding-right: 1.5rem; padding-top: 1.5rem; padding-bottom: 1.5rem; } }
          .doctor-main > .row { margin-left: 0; margin-right: 0; max-width: 100%; }
          .doctor-main [class*="col-"] { min-width: 0; max-width: 100%; }
        `}</style>
        <main className="doctor-main flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
