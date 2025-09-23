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
      <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
        {/*<div className="p-3 p-md-4">
          <div className="bg-success-10 border border-success-20 rounded-lg p-3 mb-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="fas fa-heart text-success"></i>
              <span className="small fw-medium text-success">Estado de Salud</span>
            </div>
            <div className="d-flex flex-column gap-1">
              <div className="d-flex justify-content-between small">
                <span className="text-muted-foreground">Última consulta</span>
                <span className="fw-medium">15 Ago 2024</span>
              </div>
              <div className="d-flex justify-content-between small">
                <span className="text-muted-foreground">Medicamentos activos</span>
                <span className="custom-badge bg-success text-white border-success px-1 py-0">3</span>
              </div>
            </div>
          </div>
        </div>*/}

        {/* Navegación principal del médico */}
        <nav className="flex-grow-1 px-3 px-md-4" style={{ marginTop: '20px' }}>
          <div className="d-flex flex-column gap-1">
            <NavLink to="/doctor/inicio" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <i className="fas fa-home"></i>
              <span>Inicio</span>
            </NavLink>
            <NavLink to="/doctor/pacientes" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <i className="fas fa-user-friends"></i>
              <span>Pacientes</span>
            </NavLink>
            <NavLink to="/doctor/agenda" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <i className="fas fa-calendar-alt"></i>
              <span>Agenda</span>
            </NavLink>
            <NavLink to="/doctor/recetas" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <i className="fas fa-prescription-bottle-alt"></i>
              <span>Recetas</span>
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

          <hr className="my-4" />

          {/* Acción de cierre de sesión */}
          <div className="d-flex flex-column gap-1" style={{ marginBottom: '20px' }}>
            <button className="nav-link btn btn-link text-start p-0" onClick={onLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span className="ms-2">Cerrar Sesión</span>
            </button>
          </div>
        </nav>

        {/* Leyendas y sellos informativos al pie del menú */}
        <div className="p-3 p-md-4 border-top border-gray-200">
          <div className="text-center text-muted-foreground small">
            <p className="mb-1">Protegido por Ley 21.668</p>
            <div className="d-flex justify-content-center gap-2">
              <span className="custom-badge border px-1 py-0">FONASA</span>
              <span className="custom-badge border px-1 py-0">MINSAL</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

