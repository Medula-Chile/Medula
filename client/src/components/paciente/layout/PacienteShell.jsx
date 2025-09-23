import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../../header/Header';
import Aside from '../../header/Aside';
import '../../../pages/Paciente/plantilla.css';

export default function PacienteShell() {
  // "PacienteShell" es el layout base del Portal del Paciente.
  // Se encarga de renderizar el Header (barra superior), el Aside (menú lateral)
  // y un contenedor principal donde se inyectan las rutas hijas mediante <Outlet />.
  // Este patrón permite compartir la misma estructura visual en todas las pantallas
  // de la sección del Paciente, manteniendo el código organizado.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Alterna la visibilidad del menú lateral en pantallas pequeñas.
  const handleToggleSidebar = () => setSidebarOpen((s) => !s);
  // Cierra el menú lateral (útil cuando el usuario hace click en un enlace o el overlay).
  const handleCloseSidebar = () => setSidebarOpen(false);
  const handleLogout = () => {
    // Evento de cierre de sesión.
    // Aquí podrías limpiar credenciales (localStorage/sessionStorage/cookies) si aplica.
    setSidebarOpen(false);
    navigate('/auth/login', { replace: true });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header fijo en la parte superior. Entrega acciones globales como logout y el botón de abrir el Aside. */}
      <Header onToggleSidebar={handleToggleSidebar} onLogout={handleLogout} />
      <div className="d-flex flex-grow-1">
        {/* Menú lateral con navegación entre las pantallas del paciente. */}
        <Aside isOpen={sidebarOpen} onClose={handleCloseSidebar} onLogout={handleLogout} />
        {/* Contenedor principal donde se renderizan las rutas hijas declaradas en App.jsx */}
        <main className="flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

