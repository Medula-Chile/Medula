import React from 'react';

export default function ConsultationDetail({ consulta }) {
  if (!consulta) return null;
  const presion = consulta?.vitals?.presion ?? '—';
  const temperatura = consulta?.vitals?.temperatura ?? '—';
  const pulso = consulta?.vitals?.pulso ?? '—';

  return (
    <div className="card">
      <div className="card-header bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Consulta del {consulta.fecha}</h5>
          <span className="custom-badge border-success text-white bg-success">
            {consulta.estado || 'Completada'}
          </span>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <h6 className="fw-medium mb-2">Diagnóstico y Observaciones</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">{consulta.observaciones}</p>
        </div>

        <div className="mb-4">
          <h6 className="fw-medium mb-2">Signos Vitales</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">
            Presión: {presion} • Temperatura: {temperatura} • Pulso: {pulso}
          </p>
        </div>

        <div className="row mb-4 small">
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Especialista</p>
            <p className="fw-medium mb-0">{consulta.medico}</p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Especialidad</p>
            <p className="fw-medium mb-0">{consulta.especialidad}</p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Centro médico</p>
            <p className="fw-medium mb-0">{consulta.centro}</p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Próximo control</p>
            <p className="fw-medium mb-0">{consulta.proximoControl}</p>
          </div>
          {consulta.recetaId && (
            <div className="col-12 col-md-12 mb-2">
              <p className="text-muted-foreground mb-0">Receta vinculada</p>
              <p className="fw-medium mb-0">
                <a className="link-primary" href={`/paciente/recetas?folio=${encodeURIComponent(consulta.recetaId)}`}>Ver receta {consulta.recetaId}</a>
              </p>
            </div>
          )}
        </div>

        <div>
          <h6 className="fw-medium mb-2">Medicamentos Prescritos</h6>
          <div className="d-flex flex-column gap-2">
            {consulta.medicamentos?.map((m, idx) => (
              <div key={idx} className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                <i className="fas fa-pills text-success"></i>
                <span className="small">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
