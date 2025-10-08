import React from 'react';
import axios from 'axios';

export default function ConsultationDetailDoctor({ consulta }) {
  // Detalle de consulta para el flujo del Médico.
  if (!consulta) {
    return (
      <div className="card">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">Detalle de atención</h5>
        </div>
        <div className="card-body">
          <div className="text-center text-muted-foreground">
            <i className="fas fa-notes-medical fa-2x mb-3"></i>
            <p className="mb-1">No hay una atención seleccionada.</p>
            <p className="small mb-0">Selecciona un paciente del listado de la izquierda o inicia una nueva atención.</p>
          </div>
        </div>
      </div>
    );
  }
  const presion = consulta?.vitals?.presion ?? '—';
  const temperatura = consulta?.vitals?.temperatura ?? '—';
  const pulso = consulta?.vitals?.pulso ?? '—';

  // Cargar recetas para mostrar medicamentos desde la receta vinculada (mock actual)
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

  // Construir listas seguras para mostrar
  const legacyMeds = Array.isArray(consulta.medicamentos) ? consulta.medicamentos : [];
  const structMeds = Array.isArray(consulta.medicamentosDet)
    ? consulta.medicamentosDet.map(m => {
        const parts = [m?.nombre].filter(Boolean);
        if (m?.dias) parts.push(`${m.dias} días`);
        if (m?.frecuencia) parts.push(m.frecuencia);
        return parts.length ? parts.join(' • ') : null;
      }).filter(Boolean)
    : [];
  const medsToShow = [...legacyMeds, ...structMeds];

  const examenes = Array.isArray(consulta.examenes) ? consulta.examenes : [];
  const licOtorga = !!consulta?.licencia?.otorga;
  const licDias = licOtorga ? (consulta?.licencia?.dias ?? '—') : '—';
  const licNota = licOtorga ? (consulta?.licencia?.nota || '—') : '—';

  const estado = consulta.estado || 'En progreso';
  const estadoClass = estado === 'Completado'
    ? 'custom-badge border-success text-white bg-success'
    : (estado === 'En progreso'
      ? 'custom-badge border-warning text-dark bg-warning'
      : 'custom-badge border-secondary text-white bg-secondary');

  return (
    <div className="card">
      <div className="card-header bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Atención del {consulta.fecha || '—'}</h5>
          <span className={estadoClass}>{estado}</span>
        </div>
      </div>
      <div className="card-body watermark-bg">
        <div className="mb-4">
          <h6 className="fw-medium mb-2">Diagnóstico y Observaciones</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">{consulta.observaciones || '—'}</p>
        </div>

        <div className="mb-4">
          <h6 className="fw-medium mb-2">Signos Vitales</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">
            Presión: {presion} • Temperatura: {temperatura} • Pulso: {pulso}
          </p>
        </div>

        <div className="row mb-4 small">
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Médico</p>
            <p className="fw-medium mb-0">{consulta.medico || '—'}</p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Especialidad</p>
            <p className="fw-medium mb-0">{consulta.especialidad || '—'}</p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Box/Centro</p>
            <p className="fw-medium mb-0">{consulta.centro || '—'}</p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Próximo control</p>
            <p className="fw-medium mb-0">{consulta.proximoControl || '—'}</p>
          </div>
          <div className="col-12 col-md-12 mb-2">
            <p className="text-muted-foreground mb-0">Receta vinculada</p>
            <p className="fw-medium mb-0">
              {consulta.recetaId
                ? (<a className="link-primary" href={`/doctor/recetas?folio=${encodeURIComponent(consulta.recetaId)}`}>Ver receta {consulta.recetaId}</a>)
                : '—'}
            </p>
          </div>
        </div>

        <div>
          <h6 className="fw-medium mb-2">Medicamentos Prescritos</h6>
          <div className="d-flex flex-column gap-2">
            {((medsFromReceta && medsFromReceta.length > 0) || medsToShow.length > 0)
              ? (
                <>
                  {(medsFromReceta || []).map((m, idx) => (
                    <div key={`med-receta-${idx}`} className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                      <i className="fas fa-pills text-success"></i>
                      <span className="small">{m}</span>
                    </div>
                  ))}
                  {medsToShow.map((m, idx) => (
                    <div key={`med-any-${idx}`} className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                      <i className="fas fa-pills text-success"></i>
                      <span className="small">{m}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                  <i className="fas fa-pills text-muted"></i>
                  <span className="small">—</span>
                </div>
              )}
          </div>
        </div>

        {/* Exámenes solicitados */}
        <div className="mt-4">
          <h6 className="fw-medium mb-2">Exámenes solicitados</h6>
          <div className="d-flex flex-column gap-2">
            {examenes.length > 0 ? (
              examenes.map((ex, idx) => (
                <div key={`ex-${idx}`} className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                  <i className="fas fa-vials text-primary"></i>
                  <span className="small">{ex}</span>
                </div>
              ))
            ) : (
              <div className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                <i className="fas fa-vials text-muted"></i>
                <span className="small">—</span>
              </div>
            )}
          </div>
        </div>

        {/* Licencia médica */}
        <div className="mt-4">
          <h6 className="fw-medium mb-2">Licencia médica</h6>
          <div className="row small">
            <div className="col-12 col-md-4 mb-2">
              <p className="text-muted-foreground mb-0">Otorga</p>
              <p className="fw-medium mb-0">{licOtorga ? 'Sí' : 'No'}</p>
            </div>
            <div className="col-12 col-md-4 mb-2">
              <p className="text-muted-foreground mb-0">Días</p>
              <p className="fw-medium mb-0">{licDias}</p>
            </div>
            <div className="col-12 col-md-4 mb-2">
              <p className="text-muted-foreground mb-0">Nota</p>
              <p className="fw-medium mb-0">{licNota}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
