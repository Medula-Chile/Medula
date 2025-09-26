import React from 'react';
import axios from 'axios';

export default function ConsultationDetail({ consulta }) {
  // Muestra el detalle de una consulta seleccionada desde el Timeline.
  // Si no hay consulta activa (null/undefined), no renderiza nada.
  if (!consulta) return null;
  const presion = consulta?.vitals?.presion ?? '—';
  const temperatura = consulta?.vitals?.temperatura ?? '—';
  const pulso = consulta?.vitals?.pulso ?? '—';

  // Cargar recetas para mostrar medicamentos desde la receta vinculada
  const [recetas, setRecetas] = React.useState([]);
  React.useEffect(() => {
    // Efecto que carga el mock de recetas una sola vez al montar el componente.
    // Optamos por un flag "mounted" para evitar setState cuando el componente ya se desmontó.
    let mounted = true;
    axios.get('/mock/recetas.json')
      .then(r => { if (mounted) setRecetas(Array.isArray(r.data) ? r.data : []); })
      .catch(() => { /* opcional: console.warn('No se pudo cargar recetas'); */ });
    return () => { mounted = false; };
  }, []);

  // Busca la receta activa asociada a la consulta (por recetaId) dentro de la lista cargada.
  const recetaActiva = React.useMemo(() => {
    if (!consulta?.recetaId || !Array.isArray(recetas)) return null;
    return recetas.find(r => r.id === consulta.recetaId) || null;
  }, [consulta?.recetaId, recetas]);

  // A partir de la receta activa, formatea los medicamentos para mostrarlos uniformemente.
  const medsFromReceta = React.useMemo(() => {
    if (!recetaActiva?.meds) return null;
    return recetaActiva.meds.map(m => {
      const f = m.frecuencia || '';
      const display = f && f.toLowerCase().includes('diario') ? f : `${f}${m.duracionDias ? ` x ${m.duracionDias} días` : ''}`;
      return `${m.nombre} ${m.dosis} • ${display}`;
    });
  }, [recetaActiva]);

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
      <div className="card-body watermark-bg">
        {/* Diagnóstico y observaciones (texto principal de la consulta) */}
        <div className="mb-4">
          <h6 className="fw-medium mb-2">Diagnóstico y Observaciones</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">{consulta.observaciones}</p>
        </div>

        {/* Bloque de signos vitales. Se muestran placeholders (—) si faltan datos. */}
        <div className="mb-4">
          <h6 className="fw-medium mb-2">Signos Vitales</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">
            Presión: {presion} • Temperatura: {temperatura} • Pulso: {pulso}
          </p>
        </div>

        {/* Metadatos de la consulta: médico, especialidad, centro, próximo control, y link a receta si existe. */}
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

        {/* Lista de medicamentos prescritos. Prioriza los de la receta activa si existe, si no usa los de la consulta. */}
        <div>
          <h6 className="fw-medium mb-2">Medicamentos Prescritos</h6>
          <div className="d-flex flex-column gap-2">
            {(medsFromReceta || consulta.medicamentos || []).map((m, idx) => (
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

