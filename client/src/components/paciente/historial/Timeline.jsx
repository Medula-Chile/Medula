import React from 'react';

export default function Timeline({ items, activeId, onSelect }) {
  // Componente de lista cronológica (timeline) de consultas del paciente.
  // Props:
  // - items: arreglo de objetos de consulta (id, especialidad, médico, fecha, centro, resumen, ...)
  // - activeId: id de la consulta actualmente seleccionada
  // - onSelect: callback para informar al padre el id seleccionado
  return (
    <div className="card h-100">
      <div className="card-header bg-white pb-2">
        <h5 className="card-title mb-0">Mi Timeline Médico</h5>
      </div>
      <div className="card-body p-0">
        {/* Contenedor con scroll para listas largas. La altura se calcula en base al viewport. */}
        <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <div
                key={item.id}
                className={`consultation-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelect(item.id)}
                role="button"
              >
                <div className="d-flex gap-3">
                  <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0">
                    <i className="fas fa-heart text-primary"></i>
                  </div>

                  <div className="flex-grow-1 min-w-0">
                    {/* Encabezado del item: especialidad/médico y la fecha al extremo derecho */}
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div className="flex-grow-1 min-w-0">
                        <h6 className="fw-medium mb-0">{item.especialidad}</h6>
                        <p className="text-muted-foreground small mb-0">{item.medico}</p>
                      </div>
                      <span className="text-muted-foreground small fw-medium ms-2">{item.fecha}</span>
                    </div>

                    {/* Centro médico y resumen breve de la consulta */}
                    <p className="text-muted-foreground small mb-1">{item.centro}</p>
                    <p className="small line-clamp-2 mb-0">{item.resumen}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

