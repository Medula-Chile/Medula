import React from 'react';
import { NavLink } from 'react-router-dom';

// Menú lateral del Portal del Médico.
// Props:
// - isOpen: controla visibilidad (útil en móviles/tablets).
// - onClose: cierra el menú (se usa en overlay y al hacer click en un link).
// - onLogout: acción de cierre de sesión.
export default function Aside({ isOpen, onClose, onLogout }) {
  return (
    <>
      {/* Overlay móvil: al hacer click cierra el sidebar */}
      <div
        className={`overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
        role="button"
        aria-label="Cerrar menú lateral"
      />
      <aside className={`sidebar ${isOpen ? 'show' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
        {/* Navegación principal del médico */}
        <nav className="px-3 px-md-4" style={{ marginTop: '20px', overflowY: 'auto', flex: '0 1 auto' }}>
          <div className="d-flex flex-column gap-1">
            <NavLink to="/doctor/inicio" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <i className="fas fa-home"></i>
              <span>Inicio</span>
            </NavLink>
            <NavLink to="/doctor/pacientes" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <i className="fas fa-user-friends"></i>
              <span>Pacientes</span>
            </NavLink>
            <NavLink to="/doctor/historial" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <i className="fas fa-history"></i>
              <span>Historial</span>
            </NavLink>
            <NavLink to="/doctor/agenda" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <i className="fas fa-calendar-alt"></i>
              <span>Agenda</span>
            </NavLink>
            <NavLink to="/doctor/recetas" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <i className="fas fa-prescription-bottle-alt"></i>
              <span>Recetas</span>
            </NavLink>
            <NavLink to="/doctor/examenes" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <i className="fas fa-vials"></i>
              <span>Exámenes</span>
            </NavLink>
            <NavLink to="/doctor/perfil" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <i className="fas fa-user"></i>
              <span>Mi Perfil</span>
            </NavLink>
            <NavLink to="/doctor/configuracion" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <i className="fas fa-cog"></i>
              <span>Configuración</span>
            </NavLink>
          </div>
        </nav>

        {/* Spacer para empujar footer al final */}
        <div style={{ flex: '1 1 auto' }}></div>

        {/* Footer: Cerrar sesión + leyendas */}
        <div style={{ flex: '0 0 auto' }}>
          <div className="px-3 px-md-4 py-3 border-top border-gray-200">
            <button className="nav-link btn btn-link text-start p-0 w-100" onClick={onLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span className="ms-2">Cerrar Sesión</span>
            </button>
          </div>
          <div className="p-3 p-md-4 border-top border-gray-200">
            <div className="text-center text-muted-foreground small">
              <p className="mb-1">Protegido por Ley 21.668</p>
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

