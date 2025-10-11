import React from 'react';
import axios from 'axios';

// Versión para Doctor del detalle de consulta, basada en la plantilla de Paciente
export default function ConsultationDetailHistorial({ consulta }) {
  // Si no hay consulta activa, no renderiza nada (como la plantilla de paciente)
  if (!consulta) return null;

  const presion = consulta?.vitals?.presion ?? '—';
  const temperatura = consulta?.vitals?.temperatura ?? '—';
  const pulso = consulta?.vitals?.pulso ?? '—';

  // Cargar recetas mock para mostrar medicamentos de la receta vinculada (si existe)
  const [recetas, setRecetas] = React.useState([]);
  React.useEffect(() => {
    let mounted = true;
    axios.get('/mock/recetas.json')
      .then(r => { if (mounted) setRecetas(Array.isArray(r.data) ? r.data : []); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const recetaActiva = React.useMemo(() => {
    if (!consulta?.recetaId || !Array.isArray(recetas)) return null;
    return recetas.find(r => r.id === consulta.recetaId) || null;
  }, [consulta?.recetaId, recetas]);

  const medsFromReceta = React.useMemo(() => {
    if (!recetaActiva?.meds) return null;
    return recetaActiva.meds.map(m => {
      const f = m.frecuencia || '';
      const display = f && f.toLowerCase().includes('diario') ? f : `${f}${m.duracionDias ? ` x ${m.duracionDias} días` : ''}`;
      return `${m.nombre} ${m.dosis} • ${display}`;
    });
  }, [recetaActiva]);

  const tz = 'America/Santiago';
  const fmt = (value) => {
    if (!value) return '—';
    const d = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(d?.getTime?.())) return String(value);
    return new Intl.DateTimeFormat('es-CL', { timeZone: tz, day: '2-digit', month: 'short', year: 'numeric' }).format(d);
  };

  return (
    <div className="card">
      <div className="card-header bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 fw-normal">Consulta del {fmt(consulta.fecha)}</h5>
          <span className="custom-badge border-success text-white bg-success">
            {consulta.estado || 'Completada'}
          </span>
        </div>
      </div>
      <div className="card-body watermark-bg">
        {/* Diagnóstico y Observaciones */}
        <div className="mb-4">
          <h6 className="fw-normal mb-2">Diagnóstico y Observaciones</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">{consulta.observaciones || consulta.resumen}</p>
        </div>

        {/* Signos Vitales */}
        <div className="mb-4">
          <h6 className="fw-normal mb-2">Signos Vitales</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">
            Presión: {presion} • Temperatura: {temperatura} • Pulso: {pulso}
          </p>
        </div>

        {/* Metadatos: especialista, especialidad, centro, próximo control y receta */}
        <div className="row mb-4 small">
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Especialista</p>
            <p className="fw-normal mb-0">{consulta.medico || '—'}</p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Especialidad</p>
            <p className="fw-normal mb-0">{consulta.especialidad || '—'}</p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Centro médico</p>
            <p className="fw-normal mb-0">{consulta.centro || '—'}</p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Próximo control</p>
            <p className="fw-normal mb-0">{consulta.proximoControl || '—'}</p>
          </div>
          {consulta.recetaId && (
            <div className="col-12 col-md-12 mb-2">
              <p className="text-muted-foreground mb-0">Receta vinculada</p>
              <p className="fw-normal mb-0">
                <a className="link-primary" href={`/doctor/recetas?folio=${encodeURIComponent(consulta.recetaId)}`}>Ver receta {consulta.recetaId}</a>
              </p>
            </div>
          )}
        </div>

        {/* Medicamentos Prescritos (desde receta si existe, si no desde consulta) */}
        <div>
          <h6 className="fw-normal mb-2">Medicamentos Prescritos</h6>
          <div className="d-flex flex-column gap-2">
            {(medsFromReceta || consulta.medicamentos || []).map((m, idx) => (
              <div key={idx} className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                <i className="fas fa-pills text-success"></i>
                <span className="small">{m}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Estilos locales para marca de agua */}
        <style>{`
          .watermark-bg { position: relative; overflow: hidden; }
          .watermark-bg::after {
            content: 'M';
            position: absolute;
            left: 50%;
            top: 55%;
            transform: translate(-50%, -50%);
            font-size: 220px;
            font-weight: 700;
            color: rgba(13,110,253,0.06); /* similar a primary con 6% */
            pointer-events: none;
            user-select: none;
            line-height: 1;
            white-space: nowrap;
          }
        `}</style>
      </div>
    </div>
  );
}
