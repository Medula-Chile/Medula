import React from 'react';

export default function AdminHeader({ onToggleSidebar, onLogout }) {
  return (
    <header className="bg-white border-bottom py-2 px-3 px-md-4 d-flex align-items-center justify-content-between" style={{ minHeight: 64 }}>
      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-link d-md-none p-0" onClick={onToggleSidebar} aria-label="Abrir menú">
          <i className="fas fa-bars fa-lg"></i>
        </button>
        <div className="d-flex align-items-center gap-2">
          <img src="/Logo_del_MINSAL_Chile.png" alt="Logo" style={{ height: 24 }} />
          <span className="fw-semibold">Panel Administrador</span>
        </div>
      </div>
      <div className="d-flex align-items-center gap-2">
        <span className="small text-success d-none d-sm-inline"><i className="fas fa-shield-alt me-1"></i>Conexión Segura</span>
        <button className="btn btn-outline-secondary btn-sm" onClick={onLogout}>
          <i className="fas fa-sign-out-alt me-1"></i> Cerrar sesión
        </button>
      </div>
    </header>
  );
}
