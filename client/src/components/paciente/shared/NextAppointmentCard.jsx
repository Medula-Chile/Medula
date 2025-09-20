import React from 'react';

export default function NextAppointmentCard({ fechaHora, medico }) {
  return (
    <div className="card bg-gray-100">
      <div className="card-body p-3">
        <div className="d-flex flex-column gap-2">
          <div className="d-flex align-items-center gap-2">
            <i className="fas fa-calendar text-muted small"></i>
            <span className="small fw-medium text-muted">Próxima cita</span>
          </div>
          <div className="small text-muted">
            <p className="mb-0">{fechaHora}</p>
            <p className="mb-0">{medico}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
