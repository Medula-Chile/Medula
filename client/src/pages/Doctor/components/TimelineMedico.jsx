import React from 'react';
import { formatDateTime } from '../../../utils/datetime';

export default function TimelineMedico({ items, activeId, onSelect, onStart }) {
  // Timeline para el médico: lista de pacientes en espera.
  // Props:
  // - items: array de consultas/pacientes en espera
  // - activeId: id seleccionado
  // - onSelect: callback al seleccionar item
  // - onStart: callback para iniciar atención del item activo
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const total = Array.isArray(items) ? items.length : 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  React.useEffect(() => {
    // Clamp page si cambia la cantidad de items
    setPage(p => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);
  const pageItems = React.useMemo(() => {
    if (!Array.isArray(items)) return [];
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);
  return (
    <div className="card h-100">
      <div className="card-header bg-white pb-2 d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Pacientes en espera</h5>
      </div>
      <div className="card-body p-0 small">
        <div className="overflow-auto" style={{ maxHeight: 'min(62vh, calc(100vh - 280px))' }}>
          {Array.isArray(items) && items.length === 0 && (
            <div className="p-3 text-center text-muted-foreground">
              <i className="fas fa-users-slash fa-lg mb-2"></i>
              <p className="mb-0 small">No hay atenciones para hoy.</p>
            </div>
          )}
          {pageItems.map((item) => {
            const isActive = activeId === item.id;
            const estado = item?.estado || 'En espera';
            const estadoClass = estado === 'Completado'
              ? 'bg-success text-white'
              : (estado === 'En progreso' ? 'bg-warning text-dark' : 'bg-secondary text-white');
            const isCompleted = estado === 'Completado';
            return (
              <div
                key={item.id}
                className={`consultation-item overflow-hidden ${isActive ? 'active' : ''}`}
                onClick={() => onSelect(item.id)}
                role="button"
              >
                <div className="d-flex gap-2 py-2">
                  <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0">
                    <i className="fas fa-user-injured text-primary"></i>
                  </div>

                  <div className="flex-grow-1 min-w-0 text-break">
                    <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
                      <div className="flex-grow-1 min-w-0">
                        <h6 className="fw-medium mb-0" style={{ fontSize: '0.95rem' }}>{item.especialidad}</h6>
                        <p className="text-muted-foreground small mb-0">{item.medico}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2 ms-2 flex-wrap" style={{ minWidth: 0 }}>
                        <span className={`badge rounded-pill ${estadoClass}`} style={{ flexShrink: 0 }}>{estado}</span>
                        <span className="text-muted-foreground small fw-medium text-nowrap" style={{ flexShrink: 0 }}>{formatDateTime(item.when)}</span>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm py-0 px-2"
                          disabled={isCompleted}
                          title={isCompleted ? 'Atención completada. Para editar contacte al administrador.' : 'Iniciar atención'}
                          style={{ flexShrink: 0, whiteSpace: 'nowrap', fontSize: '0.75rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(item.id);
                            if (isCompleted) {
                              alert('Esta atención ya fue completada. Si necesita editar, contacte al administrador.');
                              return;
                            }
                            onStart && onStart();
                          }}
                        >
                          {isCompleted ? 'Completada' : 'Iniciar'}
                        </button>
                      </div>
                    </div>

                    {/* Paciente y centro */}
                    <p className="text-muted-foreground small mb-1 text-break">
                      <i className="fas fa-user me-1"></i>
                      {item.paciente && item.paciente !== '—' ? item.paciente : (item.paciente_id || '—')}
                      {item.centro ? (<span className="ms-2 text-muted">• {item.centro}</span>) : null}
                    </p>
                    <p className="small line-clamp-1 mb-0 text-break">{item.resumen}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center p-2 border-top">
            <button className="btn btn-sm btn-outline-secondary" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Anterior</button>
            <span className="small text-muted">Página {page} de {totalPages}</span>
            <button className="btn btn-sm btn-outline-secondary" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Siguiente</button>
          </div>
        )}
      </div>
    </div>
  );
}
