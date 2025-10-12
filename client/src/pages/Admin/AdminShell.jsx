import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleSidebar = () => setSidebarOpen((s) => !s);
  const handleCloseSidebar = () => setSidebarOpen(false);
  const handleLogout = () => {
    setSidebarOpen(false);
    navigate('/auth/login', { replace: true });
  };

  const navItems = [
    { path: '/admin', label: 'Inicio' },
    {path: '/admin/usuarios', label: 'Gestionar Usuarios' },
    { path: '/admin/pacientes', label: 'Gestionar Pacientes' },
    { path: '/admin/medicos', label: 'Gestionar Médicos' },
    { path: '/admin/recetas', label: 'Crear Recetas' },
    { path: '/admin/citas', label: 'Gestionar citas' },
    { path: '/admin/especialidades', label: 'Gestionar Especialidades' },
    { path: '/admin/centros', label: 'Gestionar Centros de Salud' },
    { path: '/admin/medicamentos', label: 'Gestionar Medicamentos' }
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
        <h1 className="h5 mb-0">Dashboard Administrador</h1>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Cerrar sesión</button>
      </header>

      <div className="d-flex flex-grow-1">
        <nav className={`bg-light border-end ${sidebarOpen ? 'd-block' : 'd-none d-md-block'}`} style={{ width: 250 }}>
          <ul className="nav flex-column p-3">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item mb-2">
                <a
                  href={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                    handleCloseSidebar();
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
