import React from 'react';
import axios from 'axios';

export default function ConsultationDetailDoctor({ consulta }) {
  // Detalle de consulta para el flujo del Médico.
  if (!consulta) return null;
  const presion = consulta?.vitals?.presion ?? '—';
  const temperatura = consulta?.vitals?.temperatura ?? '—';
  const pulso = consulta?.vitals?.pulso ?? '—';

  // Cargar recetas para mostrar medicamentos desde la receta vinculada (mock actual)
  const [recetas, setRecetas] = React.useState([]);
  React.useEffect(() => {
    let mounted = true;
    axios.get('/mock/recetas.json')
      .then(r => { if (mounted) setRecetas(Array.isArray(r.data) ? r.data : []); })
      .catch(() => { });
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
          <h5 className="card-title mb-0">Ordenes de examenes</h5>
          <span className={estadoClass}>{estado}</span>
        </div>
      </div>
      <div className="card-body watermark-bg">
        <div className="mb-4">
          <h6 className="fw-medium mb-2">Orden de examen R-001</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded"><li>Nombre completo:Maria Elene Contreras</li>
            <li>RUT: 12.345.678-9</li>
            <li>Edad: 26 años</li>
            <li>Sexo: Femenino</li>
            <li>Fecha de emisión: 29/09/2025</li>
          </p>
        </div>

        <div className="mb-4">
          <h6 className="fw-medium mb-2">Datos del médico</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">
            <li>Doctor: Sergio Delgado </li>
            <li>RUT: 27.552.678-9</li>
            <li>Especialidad: Medicina General </li>
          </p>
        </div>

        <div className="row mb-4 small">
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Nombre del hospital <li style={{ color: "black", marginLeft: 15 }}>Hospital Felix Bulnes</li></p>
            <p className="fw-medium mb-0"></p>
            <p className="fw-medium mb-0"></p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0"></p>
            <p className="fw-medium mb-0"></p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0"></p>
            <p className="fw-medium mb-0"></p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0"></p>
            <p className="fw-medium mb-0"></p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Lista de exámenes solicitados</p>
            <li style={{ color: "black", marginLeft: 15 }}>Hemograma</li>
            <li style={{ color: "black", marginLeft: 15 }}>Radiografía de tórax</li>
            <li style={{ color: "black", marginLeft: 15 }}>Examen de colesterol</li>
            <p className="fw-medium mb-0">
              {/* {consulta.recetaId
                ? (<a className="link-primary" href={`/doctor/recetas?folio=${encodeURIComponent(consulta.recetaId)}`}>Ver receta {consulta.recetaId}</a>)
                : '—'} */}
            </p>
          </div>
        </div>

        <div>
          <h6 className="fw-medium mb-2">Observaciones adicionales</h6>
          <li style={{ color: "black", marginLeft: 15 }}>Recomendaciones para el paciente (“no tomar medicamentos antes del examen, Ayuno 9 horas minimo y maximo 12 horas. ”)</li>
          {/* <div className="d-flex flex-column gap-2">
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
          </div> */}
        </div>

        {/* Exámenes solicitados */}
        {/* <div className="mt-4">
          <h6 className="fw-medium mb-2"></h6>
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
        </div> */}

        {/* Licencia médica */}
        <div className="mt-4">
          <h6 className="fw-medium mb-2"></h6>
          <div className="row small">
            <div className="col-12 col-md-4 mb-2">
              <p className="text-muted-foreground mb-0"></p>
              <p className="fw-medium mb-0"> </p>
            </div>
            <div className="col-12 col-md-4 mb-2">
              <p className="text-muted-foreground mb-0"></p>
              <p className="fw-medium mb-0"></p>
            </div>
            <div className="col-12 col-md-4 mb-2">
              <p className="text-muted-foreground mb-0"></p>
              <p className="fw-medium mb-0"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}