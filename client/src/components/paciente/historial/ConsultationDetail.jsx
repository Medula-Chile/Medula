import React from 'react';

export default function ConsultationDetail({ consulta }) {
  // Muestra el detalle de una consulta seleccionada desde el Timeline.
  // Si no hay consulta activa (null/undefined), no renderiza nada.
  if (!consulta) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <i className="fas fa-clipboard fa-3x text-muted mb-3"></i>
          <h5>Selecciona una consulta</h5>
          <p className="text-muted">Haz clic en una consulta del timeline para ver los detalles</p>
        </div>
      </div>
    );
  }

  const presion = consulta?.vitals?.presion ?? consulta?.vitals?.presionArterial ?? '—';
  const temperatura = consulta?.vitals?.temperatura ?? '—';
  const pulso = consulta?.vitals?.pulso ?? consulta?.vitals?.frecuenciaCardiaca ?? '—';

  return (
    <div className="card h-100">
      <div className="card-header bg-white pb-2">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title mb-0">Consulta del {consulta.fecha}</h5>
            <small className="text-muted">{consulta.especialidad} - {consulta.centro}</small>
          </div>
          <span className={`badge ${consulta.estado === 'Completada' ? 'bg-success' : 'bg-warning'} text-white`}>
            {consulta.estado || 'Completada'}
          </span>
        </div>
      </div>
      <div className="card-body">
        {/* Diagnóstico principal */}
        <div className="mb-4">
          <h6 className="fw-medium mb-2">
            <i className="fas fa-diagnoses me-2 text-primary"></i>
            Diagnóstico Principal
          </h6>
          <div className="bg-light p-3 rounded">
            <p className="text-muted-foreground mb-0">{consulta.diagnostico || 'No especificado'}</p>
          </div>
        </div>

        {/* Observaciones médicas */}
        {consulta.observaciones && consulta.observaciones !== 'Sin observaciones' && (
          <div className="mb-4">
            <h6 className="fw-medium mb-2">
              <i className="fas fa-notes-medical me-2 text-primary"></i>
              Observaciones Médicas
            </h6>
            <div className="bg-light p-3 rounded">
              <p className="text-muted-foreground mb-0">{consulta.observaciones}</p>
            </div>
          </div>
        )}

        {/* Síntomas reportados */}
        {consulta.sintomas && (
          <div className="mb-4">
            <h6 className="fw-medium mb-2">
              <i className="fas fa-comment-medical me-2 text-primary"></i>
              Síntomas Reportados
            </h6>
            <div className="bg-light p-3 rounded">
              <p className="text-muted-foreground mb-0">{consulta.sintomas}</p>
            </div>
          </div>
        )}

        {/* Tratamiento indicado */}
        {consulta.tratamiento && (
          <div className="mb-4">
            <h6 className="fw-medium mb-2">
              <i className="fas fa-stethoscope me-2 text-primary"></i>
              Tratamiento Indicado
            </h6>
            <div className="bg-light p-3 rounded">
              <p className="text-muted-foreground mb-0">{consulta.tratamiento}</p>
            </div>
          </div>
        )}

        {/* Bloque de signos vitales */}
        <div className="mb-4">
          <h6 className="fw-medium mb-2">
            <i className="fas fa-heartbeat me-2 text-primary"></i>
            Signos Vitales
          </h6>
          <div className="bg-light p-3 rounded">
            <div className="row text-center small">
              <div className="col-4">
                <div className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>{presion}</div>
                <div className="text-muted">Presión Arterial</div>
              </div>
              <div className="col-4">
                <div className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>{temperatura}</div>
                <div className="text-muted">Temperatura</div>
              </div>
              <div className="col-4">
                <div className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>{pulso}</div>
                <div className="text-muted">Frecuencia Cardíaca</div>
              </div>
            </div>
          </div>
        </div>
        

        {/* Licencia médica */}
        {consulta.licencia?.otorga && (
          <div className="mb-4">
            <h6 className="fw-medium mb-2">
              <i className="fas fa-file-medical me-2 text-primary"></i>
              Licencia Médica
            </h6>
            <div className="bg-light p-3 rounded">
              <div className="row small">
                <div className="col-6">
                  <strong>Días:</strong> {consulta.licencia.dias}
                </div>
                <div className="col-6">
                  <strong>Estado:</strong> <span className="badge bg-success">Otorgada</span>
                </div>
                {consulta.licencia.nota && (
                  <div className="col-12 mt-2">
                    <strong>Observaciones:</strong> {consulta.licencia.nota}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Información de la consulta */}
        <div className="mb-4">
          <h6 className="fw-medium mb-2">
            <i className="fas fa-info-circle me-2 text-primary"></i>
            Información de la Consulta
          </h6>
          <div className="row small">
            <div className="col-12 col-md-6 mb-2">
              <p className="text-muted mb-0">Especialista</p>
              <p className="fw-medium mb-0">{consulta.medico}</p>
            </div>
            <div className="col-12 col-md-6 mb-2">
              <p className="text-muted mb-0">Especialidad</p>
              <p className="fw-medium mb-0">{consulta.especialidad}</p>
            </div>
            <div className="col-12 col-md-6 mb-2">
              <p className="text-muted mb-0">Centro médico</p>
              <p className="fw-medium mb-0">{consulta.centro}</p>
            </div>
            <div className="col-12 col-md-6 mb-2">
              <p className="text-muted mb-0">Próximo control</p>
              <p className="fw-medium mb-0">{consulta.proximoControl}</p>
            </div>
            {consulta.recetaId && (
              <div className="col-12 mb-2">
                <p className="text-muted mb-0">Receta vinculada</p>
                <p className="fw-medium mb-0">
                  <a 
                    className="link-primary text-decoration-none" 
                    href={`/paciente/recetas?folio=${encodeURIComponent(consulta.recetaId)}`}
                  >
                    <i className="fas fa-file-prescription me-1"></i>
                    Ver receta {consulta.recetaId}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Medicamentos prescritos */}
        <div className="mb-4">
          <h6 className="fw-medium mb-2">
            <i className="fas fa-pills me-2 text-primary"></i>
            Medicamentos Prescritos
          </h6>
          <div className="d-flex flex-column gap-2">
            {(consulta.medicamentos && consulta.medicamentos.length > 0) ? (
              consulta.medicamentos.map((m, idx) => (
                <div key={idx} className="d-flex align-items-center gap-2 p-2 bg-light rounded">
                  <i className="fas fa-pills text-success"></i>
                  <span className="small">{m}</span>
                </div>
              ))
            ) : (
              <div className="text-muted small p-2 bg-light rounded text-center">
                <i className="fas fa-info-circle me-1"></i>
                No se prescribieron medicamentos en esta consulta
              </div>
            )}
          </div>
        </div>

        {/* Exámenes solicitados */}
        {consulta.examenes && consulta.examenes.length > 0 && (
          <div className="mb-4">
            <h6 className="fw-medium mb-2">
              <i className="fas fa-microscope me-2 text-primary"></i>
              Exámenes Solicitados
            </h6>
            <div className="d-flex flex-column gap-2">
              {consulta.examenes.map((examen, idx) => (
                <div key={idx} className="d-flex align-items-center gap-2 p-2 bg-light rounded">
                  <i className="fas fa-flask text-info"></i>
                  <span className="small">{examen}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}