import React from 'react';

/**
 * Componente reutilizable para mostrar listas de medicamentos
 * Acepta diferentes formatos de datos y variantes de visualización
 */
export default function MedicamentosList({ medicamentos = [], variant = 'default' }) {
  // Normalizar datos: aceptar strings o objetos
  const normalizedMeds = medicamentos.map((med, idx) => {
    if (typeof med === 'string') {
      // Si es string, intentar parsear "Nombre Dosis"
      const parts = med.trim().split(/\s+/);
      return {
        id: idx,
        nombre: parts.slice(0, -1).join(' ') || med,
        dosis: parts[parts.length - 1] || '',
        frecuencia: '',
        duracion: '',
        instrucciones: ''
      };
    }
    // Si es objeto, normalizar campos
    return {
      id: med.id || med._id || idx,
      nombre: med.nombre || '',
      dosis: med.dosis || '',
      frecuencia: med.frecuencia || '',
      duracion: med.duracion || '',
      instrucciones: med.instrucciones || ''
    };
  });

  if (normalizedMeds.length === 0) {
    return (
      <div className="text-muted small">
        No hay medicamentos registrados
      </div>
    );
  }

  // Variante compacta: solo nombre y dosis
  if (variant === 'compact') {
    return (
      <div className="list-group list-group-flush">
        {normalizedMeds.map((med) => (
          <div key={med.id} className="list-group-item px-0 py-2">
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-pills text-primary small"></i>
              <span className="small">
                <strong>{med.nombre}</strong>
                {med.dosis && <span className="text-muted"> {med.dosis}</span>}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Variante detallada: toda la información con iconos
  if (variant === 'detailed') {
    return (
      <div className="list-group">
        {normalizedMeds.map((med) => (
          <div key={med.id} className="list-group-item">
            <div className="d-flex align-items-start gap-3">
              <i className="fas fa-pills text-primary mt-1"></i>
              <div className="flex-grow-1">
                <h6 className="mb-1">{med.nombre}</h6>
                {med.dosis && (
                  <div className="small text-muted mb-1">
                    <i className="fas fa-prescription-bottle me-2"></i>
                    <strong>Dosis:</strong> {med.dosis}
                  </div>
                )}
                {med.frecuencia && (
                  <div className="small text-muted mb-1">
                    <i className="fas fa-clock me-2"></i>
                    <strong>Frecuencia:</strong> {med.frecuencia}
                  </div>
                )}
                {med.duracion && (
                  <div className="small text-muted mb-1">
                    <i className="fas fa-calendar-alt me-2"></i>
                    <strong>Duración:</strong> {med.duracion}
                  </div>
                )}
                {med.instrucciones && (
                  <div className="small text-muted mt-2">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Instrucciones:</strong> {med.instrucciones}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Variante por defecto: información en línea
  return (
    <div className="list-group list-group-flush">
      {normalizedMeds.map((med) => (
        <div key={med.id} className="list-group-item px-0 py-3">
          <div className="d-flex align-items-start gap-2">
            <i className="fas fa-pills text-primary small mt-1"></i>
            <div className="flex-grow-1 min-w-0">
              <div className="mb-1">
                <strong>{med.nombre}</strong>
                {med.dosis && <span className="text-muted"> - {med.dosis}</span>}
              </div>
              <div className="small text-muted">
                {med.frecuencia && <span className="me-3">📅 {med.frecuencia}</span>}
                {med.duracion && <span>⏱️ {med.duracion}</span>}
              </div>
              {med.instrucciones && (
                <div className="small text-muted mt-1 fst-italic">
                  {med.instrucciones}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
