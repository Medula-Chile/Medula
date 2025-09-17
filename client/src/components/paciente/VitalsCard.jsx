import React from 'react';

export default function VitalsCard({ presion, temperatura, pulso }) {
  return (
    <div className="card mb-3">
      <div className="card-header bg-white pb-2">
        <h6 className="card-title mb-0">Signos Vitales</h6>
      </div>
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 mb-3">
          <i className="fas fa-heart text-danger"></i>
          <div className="flex-grow-1">
            <p className="text-muted-foreground small mb-0">Presión</p>
            <p className="small fw-medium mb-0">{presion}</p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 mb-3">
          <i className="fas fa-thermometer-half text-primary"></i>
          <div className="flex-grow-1">
            <p className="text-muted-foreground small mb-0">Temperatura</p>
            <p className="small fw-medium mb-0">{temperatura}</p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <i className="fas fa-heartbeat text-success"></i>
          <div className="flex-grow-1">
            <p className="text-muted-foreground small mb-0">Pulso</p>
            <p className="small fw-medium mb-0">{pulso}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
