import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function DoctorExamenes() {
  // Vista DOCTOR: navegar pacientes -> exámenes -> detalle (3 columnas)
  const { user } = useAuth();
  const [examenes, setExamenes] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros de búsqueda
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch exámenes desde la base de datos
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        setError('');
        const r = await api.get('/examenes');
        const arr = Array.isArray(r.data) ? r.data : (Array.isArray(r.data?.examenes) ? r.data.examenes : []);
        if (!mounted) return;
        setExamenes(arr);

        // Derivar lista de pacientes con al menos un examen
        const byPatient = new Map();
        for (const exam of arr) {
          const pObj = exam?.paciente_id || exam?.paciente || null;
          const pid = (typeof pObj === 'object') ? (pObj?._id || pObj?.id) : (typeof exam?.paciente_id === 'string' ? exam.paciente_id : null);
          const nombre = (
            (typeof pObj === 'string' ? pObj : null) ||
            pObj?.usuario?.nombre || pObj?.usuario?.fullName || pObj?.usuario?.name ||
            pObj?.usuario_id?.nombre || pObj?.usuario_id?.fullName || pObj?.usuario_id?.name ||
            pObj?.nombre || [pObj?.nombres, pObj?.apellidos].filter(Boolean).join(' ') ||
            [pObj?.firstName, pObj?.lastName].filter(Boolean).join(' ')
          ) || 'Paciente';
          if (!pid) continue;
          // Extraer RUT del paciente (mismo formato que DoctorRecetas)
          const run = pObj?.usuario_id?.rut || pObj?.rut || '—';
          const item = byPatient.get(pid) || { 
            id: pid, 
            nombre, 
            run,
            examenes: [] 
          };
          item.examenes.push(exam);
          byPatient.set(pid, item);
        }
        setPacientes(Array.from(byPatient.values()));
      } catch (e) {
        if (mounted) setError('No se pudo cargar la lista de exámenes.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  // Selección por query (?patient= & ?examen=)
  const location = useLocation();
  const getQueryParam = (name) => new URLSearchParams(location.search).get(name);

  const [pacienteSel, setPacienteSel] = useState(null);
  const [examenSel, setExamenSel] = useState(null);

  // Helper: nombre del médico solicitante
  const getDoctorName = React.useCallback((exam) => {
    if (!exam) return '—';
    // Intentar obtener médico desde múltiples fuentes
    let m = exam.medico_solicitante ?? exam.medico_id ?? exam.medico ?? exam.doctor ?? null;
    
    // Si no hay médico directo, buscar en consulta_id -> cita_id -> profesional_id
    if (!m && exam.consulta_id) {
      const cita = exam.consulta_id?.cita_id || exam.consulta_id;
      m = cita?.profesional_id || cita?.medico_id || cita?.medico || null;
    }
    
    if (!m) return '—';
    if (typeof m === 'string') return m;
    return (
      m?.nombre || m?.name || m?.fullName ||
      m?.usuario?.nombre || m?.usuario?.fullName || m?.usuario?.name ||
      m?.usuario_id?.nombre || m?.usuario_id?.fullName || m?.usuario_id?.name ||
      '—'
    );
  }, []);

  // Helper: nombre del médico realizador
  const getRealizadorName = React.useCallback((exam) => {
    if (!exam) return '—';
    const m = exam.medico_realizador ?? exam.realizador ?? null;
    if (!m) return '—';
    if (typeof m === 'string') return m;
    return (
      m?.nombre || m?.name || m?.fullName ||
      m?.usuario?.nombre || m?.usuario?.fullName || m?.usuario?.name ||
      m?.usuario_id?.nombre || m?.usuario_id?.fullName || m?.usuario_id?.name ||
      '—'
    );
  }, []);

  useEffect(() => {
    if (pacientes.length === 0) return;

    const qPatient = getQueryParam('patient');
    const qExamen = getQueryParam('examen');

    // Aplicar búsqueda a la lista izquierda
    const norm = (s) => (s || '').toString().toLowerCase();
    const qn = norm(q);
    const filteredPatients = pacientes.filter(p => !qn || norm(p.nombre).includes(qn) || norm(p.run).includes(qn));

    let p = filteredPatients[0] || pacientes[0];
    if (qPatient) {
      const found = pacientes.find((x) => x.id === qPatient);
      if (found) p = found;
    }
    let e = p?.examenes?.[0] || null;
    if (qExamen && p?.examenes?.length) {
      const fe = p.examenes.find((x) => (x._id || x.id) === qExamen);
      if (fe) e = fe;
    }
    setPacienteSel(p || null);
    setExamenSel(e);
  }, [location.search, pacientes, q]);

  // Helpers
  const statusBadgeClass = (s) => {
    const estado = (s || '').toLowerCase();
    if (estado === 'realizado' || estado === 'entregado' || estado === 'completado') {
      return 'custom-badge border-success text-white bg-success';
    } else if (estado === 'solicitado' || estado === 'pendiente') {
      return 'custom-badge border-warning text-dark bg-warning';
    } else {
      return 'custom-badge border-secondary text-white bg-secondary';
    }
  };

  // actualiza URL shallow
  const updateUrl = (pid, examenId) => {
    const params = new URLSearchParams(location.search);
    if (pid) params.set('patient', pid); else params.delete('patient');
    if (examenId) params.set('examen', examenId); else params.delete('examen');
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', url);
  };

  // acciones UI
  const onSelectPaciente = (p) => {
    setPacienteSel(p);
    const first = p?.examenes?.[0] || null;
    setExamenSel(first);
    updateUrl(p?.id || '', first?._id || first?.id || '');
  };

  const onSelectExamen = (e) => {
    setExamenSel(e);
    updateUrl(pacienteSel?.id || '', e?._id || e?.id || '');
  };

  if (loading) return <div className="p-3 text-muted small">Cargando exámenes…</div>;
  if (error) return <div className="alert alert-danger my-2" role="alert">{error}</div>;
  if (!pacienteSel) return null;

  return (
    <div className="row g-3">
      {/* Columna IZQUIERDA: Pacientes con exámenes + búsqueda */}
      <div className="col-12 col-lg-4 col-xl-3">
        <div className="card h-100">
          <div className="card-header bg-white pb-2">
            <h5 className="card-title mb-2">Pacientes con exámenes</h5>
            {/* Barra de búsqueda */}
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white"><i className="fas fa-search"/></span>
              <input className="form-control" placeholder="Buscar por nombre o RUT" value={q} onChange={(e)=>{ setQ(e.target.value); setPage(1); }} />
            </div>
          </div>
          <div className="card-body p-0">
            <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {pacientes
                .filter(p => {
                  const norm = (s) => (s || '').toString().toLowerCase();
                  const qn = norm(q);
                  return !qn || norm(p.nombre).includes(qn) || norm(p.run).includes(qn);
                })
                .map((p) => (
                <div
                  key={p.id}
                  className={`consultation-item overflow-hidden ${pacienteSel.id === p.id ? 'active' : ''}`}
                  role="button"
                  onClick={() => onSelectPaciente(p)}
                >
                  <div className="d-flex gap-3">
                    <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0">
                      <i className="fas fa-user-injured text-primary"></i>
                    </div>
                    <div className="flex-grow-1 min-w-0 text-break">
                      <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="fw-medium mb-0">{p.nombre}</h6>
                          <p className="text-muted-foreground small mb-0">{p.run}</p>
                        </div>
                        <span className="text-muted-foreground small fw-medium ms-2">{p.examenes?.length || 0} exam.</span>
                      </div>
                      <p className="small line-clamp-2 mb-0 text-break">Último: {(() => {
                        const es = (p.examenes || []).slice().sort((a,b) => new Date(b.fecha_solicitud || b.createdAt || 0) - new Date(a.fecha_solicitud || a.createdAt || 0));
                        const last = es[0];
                        const d = last ? new Date(last.fecha_solicitud || last.createdAt) : null;
                        return d ? d.toLocaleDateString() : '—';
                      })()}</p>
                    </div>
                  </div>
                </div>
              ))}
              {pacientes.length === 0 && (
                <div className="p-3 text-muted small">No hay pacientes para mostrar.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Columna CENTRAL: Exámenes del paciente seleccionado */}
      <div className="col-12 col-lg-5 col-xl-4">
        <div className="card h-100">
          <div className="card-header bg-white pb-2">
            <h5 className="card-title mb-0">Exámenes de {pacienteSel.nombre}</h5>
          </div>
          <div className="card-body p-0">
            <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {(() => {
                const all = (pacienteSel.examenes || []).slice().sort((a,b)=> new Date(b.fecha_solicitud || b.createdAt || 0) - new Date(a.fecha_solicitud || a.createdAt || 0));
                const total = all.length;
                const totalPages = Math.max(1, Math.ceil(total / pageSize));
                const p = Math.min(page, totalPages);
                const start = (p - 1) * pageSize;
                const pageItems = all.slice(start, start + pageSize);
                return pageItems.map((e) => (
                  <div
                    key={e._id || e.id}
                    className={`consultation-item overflow-hidden ${String(examenSel?._id || examenSel?.id) === String(e._id || e.id) ? 'active' : ''}`}
                    role="button"
                    onClick={() => onSelectExamen(e)}
                  >
                    <div className="d-flex gap-3">
                      <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0">
                        <i className="fas fa-flask text-primary"></i>
                      </div>
                      <div className="flex-grow-1 min-w-0 text-break">
                        <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
                          <div className="flex-grow-1 min-w-0">
                            <h6 className="fw-medium mb-0">{e.tipo_examen || 'Examen'}</h6>
                            <p className="text-muted-foreground small mb-0">Solicitado por {getDoctorName(e)}</p>
                          </div>
                          <span className={`badge ${statusBadgeClass(e.estado)}`}>{e.estado || 'solicitado'}</span>
                        </div>
                        <p className="text-muted-foreground small mb-1">
                          {(() => { const d = e.fecha_solicitud || e.createdAt; return d ? new Date(d).toLocaleString() : '—'; })()}
                        </p>
                        <p className="small line-clamp-2 mb-0 text-break">
                          {e.descripcion || e.indicaciones || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
              {(pacienteSel.examenes || []).length === 0 && (
                <div className="p-3 text-muted small">Este paciente no tiene exámenes.</div>
              )}
              {(() => {
                const total = (pacienteSel.examenes || []).length;
                const totalPages = Math.max(1, Math.ceil(total / pageSize));
                if (totalPages <= 1) return null;
                return (
                  <div className="d-flex justify-content-between align-items-center p-2 border-top">
                    <button className="btn btn-sm btn-outline-secondary" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Anterior</button>
                    <span className="small text-muted">Página {page} de {totalPages}</span>
                    <button className="btn btn-sm btn-outline-secondary" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Siguiente</button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Columna DERECHA: Detalle del examen */}
      <div className="col-12 col-lg-3 col-xl-5">
        {examenSel && (
          <div className="card mb-3">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="card-title mb-0">Detalle del Examen</h5>
                <span className={`badge ${statusBadgeClass(examenSel.estado)}`}>{examenSel.estado || 'solicitado'}</span>
              </div>
            </div>

            <div className="card-body text-break">
              <div className="row mb-3 small">
                <div className="col-12 mb-2">
                  <p className="text-muted-foreground mb-0">ID Examen</p>
                  <p className="fw-medium mb-0"><code className="small">{examenSel._id || examenSel.id}</code></p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Paciente</p>
                  <p className="fw-medium mb-0">{pacienteSel.nombre}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">ID Paciente</p>
                  <p className="fw-medium mb-0">{pacienteSel.run}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Tipo de Examen</p>
                  <p className="fw-medium mb-0">{examenSel.tipo_examen || '—'}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Estado</p>
                  <p className="fw-medium mb-0">{examenSel.estado || 'solicitado'}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Fecha Solicitud</p>
                  <p className="fw-medium mb-0">{(() => { const d = examenSel.fecha_solicitud || examenSel.createdAt; return d ? new Date(d).toLocaleString() : '—'; })()}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Fecha Realización</p>
                  <p className="fw-medium mb-0">{examenSel.fecha_realizacion ? new Date(examenSel.fecha_realizacion).toLocaleString() : '—'}</p>
                </div>
                <div className="col-12 mb-2">
                  <p className="text-muted-foreground mb-0">Médico Solicitante</p>
                  <p className="fw-medium mb-0">{getDoctorName(examenSel)}</p>
                </div>
                <div className="col-12 mb-2">
                  <p className="text-muted-foreground mb-0">Médico Realizador</p>
                  <p className="fw-medium mb-0">{getRealizadorName(examenSel)}</p>
                </div>
              </div>

              <div className="mb-3">
                <h6 className="fw-medium mb-2">Descripción / Indicaciones</h6>
                <p className="text-muted-foreground small bg-gray-100 p-3 rounded text-break">
                  {examenSel.descripcion || examenSel.indicaciones || '—'}
                </p>
              </div>

              {examenSel.resultado && (
                <div className="mb-3">
                  <h6 className="fw-medium mb-2">Resultado</h6>
                  <p className="text-muted-foreground small bg-gray-100 p-3 rounded text-break">
                    {examenSel.resultado}
                  </p>
                </div>
              )}

              {examenSel.observaciones && (
                <div className="mb-3">
                  <h6 className="fw-medium mb-2">Observaciones</h6>
                  <p className="text-muted-foreground small bg-gray-100 p-3 rounded text-break">
                    {examenSel.observaciones}
                  </p>
                </div>
              )}

              {examenSel.archivo_adjunto && (
                <div className="mb-3">
                  <h6 className="fw-medium mb-2">Archivo Adjunto</h6>
                  <a href={examenSel.archivo_adjunto} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-file-download me-1"></i> Descargar Archivo
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
