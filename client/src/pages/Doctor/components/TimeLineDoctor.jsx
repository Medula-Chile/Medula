import React from 'react';
import { formatDateTime } from '../../../utils/datetime';

/**
 * TimeLineDoctor
 * Lista cronológica clickeable de consultas del paciente (vista médico).
 *
 * Props:
 * - items: Array<{
 *     id: number | string,
 *     especialidad: string,
 *     medico: string,
 *     fecha: string | Date,                // ISO o legible; se formatea a es-CL
 *     centro?: string,
 *     resumen?: string,
 *     estado?: 'Completada' | 'Pendiente' | 'Cancelada' | string,
 *     recetaId?: string,
 *     vitals?: { presion?: string|null, temperatura?: string|null, pulso?: string|null }
 *   }>
 * - activeId: id del item seleccionado
 * - onSelect: (id) => void
 */
export default function TimeLineDoctor({ items = [], activeId, onSelect }) {
  // Fechas: siempre renderizar desde ISO `when`
  const fmtFromWhen = (when) => formatDateTime(when);

  const handleKey = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(id);
    }
  };

  return (
    <div className="card h-100">
      <div className="card-header bg-white pb-2">
        <h5 className="card-title mb-0 fw-normal">Mi Timeline Médico</h5>
      </div>

      <div className="card-body p-0">
        <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
          {(!items || items.length === 0) && (
            <div className="p-4 text-center text-muted">
              <i className="fas fa-stream mb-2" aria-hidden="true"></i>
              <div>No hay atenciones registradas.</div>
            </div>
          )}

          {items.map((item) => {
            const isActive = activeId === item.id;
            const estado = item.estado || 'Completada';
            const hasVitals =
              item?.vitals?.presion || item?.vitals?.temperatura || item?.vitals?.pulso;
            const fechaLabel = fmtFromWhen(item.when || item.fecha);

            const estadoClass =
              estado === 'Completada'
                ? 'bg-success'
                : estado === 'Pendiente'
                ? 'bg-warning text-dark'
                : estado === 'Cancelada'
                ? 'bg-secondary'
                : 'bg-light text-dark border';

            return (
              <div
                key={item.id}
                className={`consultation-item ${isActive ? 'active' : ''} p-3 border-bottom`}
                onClick={() => onSelect?.(item.id)}
                onKeyDown={(e) => handleKey(e, item.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`Consulta ${item.especialidad} con ${item.medico} el ${fechaLabel}`}
              >
                <div className="d-flex gap-3 align-items-start">
                  {/* Ícono de timeline */}
                  <div
                    className={`rounded-circle p-2 flex-shrink-0 ${isActive ? 'bg-primary' : 'bg-primary-10'}`}
                    style={{ width: 40, height: 40, display: 'grid', placeItems: 'center' }}
                    aria-hidden="true"
                  >
                    <i className={`fas fa-stethoscope ${isActive ? 'text-white' : 'text-primary'}`}></i>
                  </div>

                  {/* Contenido */}
                  <div className="flex-grow-1 min-w-0">
                    {/* Encabezado: especialidad + badges + fecha */}
                    <div className="d-flex justify-content-between align-items-start mb-1 gap-2">
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex flex-wrap align-items-center gap-2 min-w-0">
                          <h6 className="fw-normal mb-0 text-truncate" title={item.especialidad}>{item.especialidad}</h6>
                          <span className={`badge ${estadoClass} rounded-pill text-truncate`}>{estado}</span>
                          {item.recetaId && (
                            <span className="badge bg-light text-dark border rounded-pill text-truncate" title={`Receta ${item.recetaId}`}>
                              <i className="fas fa-file-prescription me-1"></i>Receta
                            </span>
                          )}
                          {Array.isArray(item.examIds) && item.examIds.length > 0 && (
                            <span className="badge bg-info text-white rounded-pill text-truncate" title={`Exámenes vinculados: ${item.examIds.join(', ')}`}>
                              <i className="fas fa-vials me-1"></i>{item.examIds.length} Exám.
                            </span>
                          )}
                          {hasVitals && (
                            <span className="badge bg-light text-dark border rounded-pill text-truncate" title="Incluye signos vitales">
                              <i className="fas fa-heartbeat me-1"></i>SV
                            </span>
                          )}
                        </div>
                        <div
                          className="doctor-meta text-muted-foreground small mb-0"
                          title={`${item.medicoNombre || item.medico || '—'} · RUT ${item.medicoRut || '—'} · ${item.medicoEspecialidad || item.especialidad || '—'} · Paciente: ${item.pacienteNombre || '—'}`}
                        >
                          <div className="d-flex flex-wrap align-items-center gap-1">
                            <span className="me-2">Dr: <strong>{(item.medicoNombre && String(item.medicoNombre).trim()) || (item.medico && String(item.medico).trim()) || '—'}</strong></span>
                            <span className="me-2 hide-xxs">· RUT: {item.medicoRut || '—'}</span>
                            <span className="me-2">
                              <span className="badge bg-light text-dark border">Esp: {item.medicoEspecialidad || item.especialidad || '—'}</span>
                            </span>
                            <span className="me-2 w-100 d-block d-md-none"></span>
                            <span className="me-2">· Paciente: {item.pacienteNombre || '—'}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-muted-foreground small fw-medium ms-2 text-nowrap">{fechaLabel}</span>
                    </div>

                    {/* Centro y resumen */}
                    {item.centro && (
                      <p className="text-muted-foreground small mb-1 text-truncate" title={item.centro}>{item.centro}</p>
                    )}
                    {item.resumen && (
                      <p className="small line-clamp-2 mb-0 text-break" title={item.resumen}>
                        {item.resumen}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .consultation-item.active {
          background: rgba(13,110,253,0.06); /* similar a .bg-primary-10 */
        }
        .consultation-item:hover {
          background: rgba(13,110,253,0.04);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        /* Asegurar cortes de palabra en textos largos */
        .text-break { word-break: break-word; overflow-wrap: anywhere; }
        /* Meta responsiva: colapsar en múltiples líneas en móviles */
        .doctor-meta span { line-height: 1.2; }
        @media (max-width: 576px){
          .doctor-meta span { display: inline; }
        }
        /* Ocultar RUT en pantallas muy pequeñas (<400px) */
        @media (max-width: 400px){
          .hide-xxs { display: none !important; }
        }
      `}</style>
    </div>
  );
}