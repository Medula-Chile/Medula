import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminAside({ isOpen, onClose, onLogout }) {
  const items = [
    { to: '/admin', icon: 'fa-home', label: 'Inicio' },
    { to: '/admin/usuarios', icon: 'fa-users-cog', label: 'Gestionar Usuarios' },
    { to: '/admin/pacientes', icon: 'fa-user-injured', label: 'Gestionar Pacientes' },
    { to: '/admin/medicos', icon: 'fa-user-md', label: 'Gestionar Médicos' },
    { to: '/admin/recetas/lista', icon: 'fa-prescription-bottle-alt', label: 'Ver Recetas' },
    { to: '/admin/examenes', icon: 'fa-vials', label: 'Ver Exámenes' },
    { to: '/admin/citas', icon: 'fa-calendar-alt', label: 'Gestionar Citas' },
    { to: '/admin/consultas', icon: 'fa-notes-medical', label: 'Gestionar Consultas' },
    { to: '/admin/especialidades', icon: 'fa-stethoscope', label: 'Especialidades' },
    { to: '/admin/centros', icon: 'fa-hospital', label: 'Centros de Salud' },
    { to: '/admin/medicamentos', icon: 'fa-pills', label: 'Medicamentos' },
  ];

  return (
    <>
      <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={onClose} role="button" aria-label="Cerrar menú" />
      <aside className={`sidebar ${isOpen ? 'show' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
        <nav className="px-3 px-md-4" style={{ marginTop: 12, overflowY: 'auto', flex: '0 1 auto' }}>
          <div className="d-flex flex-column gap-1">
            {items.map(it => (
              <NavLink key={it.to} to={it.to} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
                <i className={`fas ${it.icon}`}></i>
                <span>{it.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div style={{ flex: '1 1 auto' }} />

        <div style={{ flex: '0 0 auto' }}>
          <div className="px-3 px-md-4 py-3 border-top border-gray-200">
            <button className="nav-link btn btn-link text-start p-0 w-100" onClick={onLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span className="ms-2">Cerrar Sesión</span>
            </button>
          </div>
          <div className="p-3 p-md-4 border-top border-gray-200">
            <div className="text-center text-muted-foreground small">
              <p className="mb-1">Panel de Administración</p>
              <div className="d-flex justify-content-center gap-2">
                <span className="custom-badge border px-1 py-0">FONASA</span>
                <span className="custom-badge border px-1 py-0">MINSAL</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
