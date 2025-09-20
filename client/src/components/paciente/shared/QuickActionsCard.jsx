import React from 'react';

export default function QuickActionsCard() {
  return (
    <div className="card mb-3">
      <div className="card-header bg-white pb-2">
        <h6 className="card-title mb-0">Acciones</h6>
      </div>
      <div className="card-body">
        <button className="btn btn-outline-secondary w-100 btn-sm mb-2 d-flex align-items-center">
          <i className="fas fa-download small me-2"></i>
          <span className="small">Descargar Recetas</span>
        </button>
        <button className="btn btn-outline-secondary w-100 btn-sm d-flex align-items-center">
          <i className="fas fa-phone small me-2"></i>
          <span className="small">Telemedicina</span>
        </button>
      </div>
    </div>
  );
}
