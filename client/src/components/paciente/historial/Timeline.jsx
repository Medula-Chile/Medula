import React from 'react';

export default function Timeline({ items, activeId, onSelect, loading }) {
  if (loading) {
    return (
      <div className="card h-100">
        <div className="card-header bg-white pb-2">
          <h5 className="card-title mb-0">Mi Timeline Médico</h5>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-center align-items-center py-4">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <span className="text-muted">Cargando consultas...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100">
      <div className="card-header bg-white pb-2">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Mi Timeline Médico</h5>
          <span className="badge bg-primary">{items.length} consultas</span>
        </div>
      </div>
      <div className="card-body p-0">
        {/* Contenedor con scroll para listas largas. La altura se calcula en base al viewport. */}
        <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <div
                key={item.id}
                className={`consultation-item ${isActive ? 'active' : ''} p-3 border-bottom`}
                onClick={() => onSelect(item.id)}
                role="button"
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                  borderLeft: isActive ? '4px solid #0d6efd' : '4px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div className="d-flex gap-3">
                  <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0 d-flex align-items-center justify-content-center" 
                       style={{ width: '40px', height: '40px' }}>
                    <i className="fas fa-stethoscope text-primary"></i>
                  </div>

                  <div className="flex-grow-1 min-w-0">
                    {/* Encabezado del item: especialidad/médico y la fecha al extremo derecho */}
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div className="flex-grow-1 min-w-0">
                        <h6 className="fw-medium mb-0 text-truncate">{item.especialidad}</h6>
                        <p className="text-muted small mb-0">{item.medico}</p>
                      </div>
                      <span className="text-muted small fw-medium ms-2 text-nowrap">
                        {item.fecha}
                      </span>
                    </div>

                    {/* Centro médico y resumen breve de la consulta */}
                    <p className="text-muted small mb-1">{item.centro}</p>
                    <p className="small mb-2" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      color: isActive ? '#495057' : '#6c757d'
                    }}>
                      {item.resumen}
                    </p>
                    
                    {/* Badge de estado */}
                    <div className="mt-2">
                      <span className={`badge ${item.estado === 'Completada' ? 'bg-success' : 'bg-warning'} text-white`}>
                        {item.estado}
                      </span>
                      {item.recetaId && (
                        <span className="badge bg-info text-white ms-1">
                          <i className="fas fa-prescription me-1"></i>
                          Receta
                        </span>
                      )}
                    </div>
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