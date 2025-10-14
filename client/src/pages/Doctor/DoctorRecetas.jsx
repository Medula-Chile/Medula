import React from 'react';
import ActiveMedicationsCard from '../../components/paciente/shared/ActiveMedicationsCard';
import QuickActionsCard from '../../components/paciente/shared/QuickActionsCard';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function RecetasDoctor() {
  // Vista DOCTOR: navegar pacientes -> recetas -> detalle
  const { user } = useAuth();
  const [recetas, setRecetas] = React.useState([]);
  const [pacientes, setPacientes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // Filtros de búsqueda (como DoctorPacientes)
  const [q, setQ] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');

  // Paginación para la lista de recetas del paciente seleccionado
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  React.useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        setError('');
        // Traer todas las recetas. Si queremos limitar por médico autenticado, añadir params medico=user._id
        const params = {};
        // const uid = user?.id || user?._id; if (uid) params.medico = uid;
        const r = await api.get('/recetas', { params });
        const arr = Array.isArray(r.data) ? r.data : (Array.isArray(r.data?.recetas) ? r.data.recetas : []);
        if (!mounted) return;
        setRecetas(arr);
        // Derivar lista de pacientes con al menos una receta
        const byPatient = new Map();
        for (const rec of arr) {
          const pObj = rec?.paciente_id || rec?.paciente || null;
          const pid = (typeof pObj === 'object') ? (pObj?._id || pObj?.id) : (typeof rec?.paciente_id === 'string' ? rec.paciente_id : null);
          const nombre = (
            (typeof pObj === 'string' ? pObj : null) ||
            pObj?.usuario?.nombre || pObj?.usuario?.fullName || pObj?.usuario?.name ||
            pObj?.usuario_id?.nombre || pObj?.usuario_id?.fullName || pObj?.usuario_id?.name ||
            pObj?.nombre || [pObj?.nombres, pObj?.apellidos].filter(Boolean).join(' ') ||
            [pObj?.firstName, pObj?.lastName].filter(Boolean).join(' ')
          ) || 'Paciente';
          if (!pid) continue;
          const item = byPatient.get(pid) || { id: pid, nombre, run: pObj?.usuario_id?.rut || pObj?.rut || '—', recetas: [], centro: rec?.centro_id?.nombre || '—' };
          item.recetas.push(rec);
          byPatient.set(pid, item);
        }
        setPacientes(Array.from(byPatient.values()));
      } catch (e) {
        if (mounted) setError('No se pudo cargar la lista de recetas.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [user?.id, user?._id]);

  // ---- selección por query (?patient= & ?folio=)
  const location = useLocation();
  const getQueryParam = (name) => new URLSearchParams(location.search).get(name);

  const [pacienteSel, setPacienteSel] = React.useState(null);
  const [recetaSel, setRecetaSel] = React.useState(null);

  // Helper: nombre del médico emisor de la receta, con múltiples formatos posibles
  const getDoctorName = React.useCallback((rec) => {
    if (!rec) return '—';
    const m = rec.medico_id ?? rec.medico ?? rec.doctor ?? null;
    if (!m) return '—';
    if (typeof m === 'string') return m;
    return (
      m?.nombre || m?.name ||
      m?.usuario?.nombre || m?.usuario?.fullName || m?.usuario?.name ||
      m?.usuario_id?.nombre || m?.usuario_id?.fullName || m?.usuario_id?.name ||
      '—'
    );
  }, []);

  React.useEffect(() => {
    if (pacientes.length === 0) return;

    const qPatient = getQueryParam('patient');
    const qFolio = getQueryParam('folio');

    // Aplicar búsqueda a la lista izquierda
    const norm = (s) => (s || '').toString().toLowerCase();
    const qn = norm(q);
    const filteredPatients = pacientes.filter(p => !qn || norm(p.nombre).includes(qn) || norm(p.run).includes(qn) || norm(p.centro).includes(qn));

    let p = filteredPatients[0] || pacientes[0];
    if (qPatient) {
      const found = pacientes.find((x) => x.id === qPatient);
      if (found) p = found;
    }
    let r = p?.recetas?.[0] || null;
    if (qFolio && p?.recetas?.length) {
      const fr = p.recetas.find((x) => x.id === qFolio);
      if (fr) r = fr;
    }
    setPacienteSel(p || null);
    setRecetaSel(r);
  }, [location.search, pacientes, q]);

  // helpers
  const printAreaRef = React.useRef(null);
  const statusBadgeClass = (s) =>
    s === 'Vigente'
      ? 'custom-badge border-success text-white bg-success'
      : s === 'Pendiente'
      ? 'custom-badge border-warning text-dark bg-warning'
      : 'custom-badge border-secondary text-white bg-secondary';

  const computeVerificationCode = React.useCallback((r) => {
    if (!r) return '';
    const raw = `${r.id}|${r.fecha}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) { hash = ((hash << 5) - hash) + raw.charCodeAt(i); hash |= 0; }
    return `VRF-${Math.abs(hash).toString(16).toUpperCase()}`;
  }, []);

  const verifCode = React.useMemo(
    () => (recetaSel ? computeVerificationCode(recetaSel) : ''),
    [recetaSel, computeVerificationCode]
  );

  const handleVerify = () => {
    if (!recetaSel) return;
    alert(
      `Receta ${recetaSel.id}\nPaciente: ${pacienteSel?.nombre} (${pacienteSel?.run})\n` +
      `Estado: ${recetaSel.status}\nEmitida: ${recetaSel.fechaLabel}\n` +
      `Válida hasta: ${recetaSel.validaHasta}\nCódigo de verificación: ${verifCode}`
    );
  };

  const handleDownloadPdf = () => {
    if (!recetaSel) return;
    const content = printAreaRef.current?.innerHTML || '';
    const w = window.open('', '_blank', 'width=800,height=600');
    if (!w) return;
    w.document.open();
    w.document.write(`<!doctype html><html><head><title>Receta ${recetaSel.id}</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <style>
        @media print { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        .watermark-bg { position: relative; overflow: hidden; }
        .watermark-bg::after {
          content: ""; position: absolute; inset: 0;
          background: url('/medula_icono.png') no-repeat center center;
          background-size: contain; opacity: 0.06; pointer-events: none;
        }
      </style>
    </head><body>
      <div class="container p-3">${content}</div>
      <script>window.onload = function(){ window.print(); window.close(); }</script>
    </body></html>`);
    w.document.close();
  };

  // actualiza URL shallow
  const updateUrl = (pid, folio) => {
    const params = new URLSearchParams(location.search);
    if (pid) params.set('patient', pid); else params.delete('patient');
    if (folio) params.set('folio', folio); else params.delete('folio');
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', url);
  };

  // acciones UI
  const onSelectPaciente = (p) => {
    setPacienteSel(p);
    const first = p?.recetas?.[0] || null;
    setRecetaSel(first);
    updateUrl(p?.id || '', first?.id || '');
  };

  const onSelectReceta = (r) => {
    setRecetaSel(r);
    updateUrl(pacienteSel?.id || '', r?.id || '');
  };

  if (loading) return <div className="p-3 text-muted small">Cargando recetas…</div>;
  if (error) return <div className="alert alert-danger my-2" role="alert">{error}</div>;
  if (!pacienteSel) return null;

  return (
    <div className="row g-3">
      {/* Columna IZQUIERDA: Pacientes con recetas + búsqueda */}
      <div className="col-12 col-lg-4 col-xl-3">
        <div className="card h-100">
          <div className="card-header bg-white pb-2">
            <h5 className="card-title mb-2">Pacientes con recetas</h5>
            {/* Barra de búsqueda */}
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white"><i className="fas fa-search"/></span>
              <input className="form-control" placeholder="Buscar por nombre, RUN o centro" value={q} onChange={(e)=>{ setQ(e.target.value); setPage(1); }} />
            </div>
          </div>
          <div className="card-body p-0">
            <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {pacientes
                .filter(p => {
                  const norm = (s) => (s || '').toString().toLowerCase();
                  const qn = norm(q);
                  return !qn || norm(p.nombre).includes(qn) || norm(p.run).includes(qn) || norm(p.centro).includes(qn);
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
                        <span className="text-muted-foreground small fw-medium ms-2">{p.recetas?.length || 0} rec.</span>
                      </div>
                      <p className="text-muted-foreground small mb-1">{p.centro}</p>
                      <p className="small line-clamp-2 mb-0 text-break">Última: {(() => {
                        const rs = (p.recetas || []).slice().sort((a,b) => new Date(b.fecha_emision || b.createdAt || 0) - new Date(a.fecha_emision || a.createdAt || 0));
                        const last = rs[0];
                        const d = last ? new Date(last.fecha_emision || last.createdAt) : null;
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

      {/* Columna CENTRAL: Recetas del paciente seleccionado */}
      <div className="col-12 col-lg-5 col-xl-4">
        <div className="card h-100">
          <div className="card-header bg-white pb-2">
            <h5 className="card-title mb-0">Recetas de {pacienteSel.nombre}</h5>
          </div>
          <div className="card-body p-0">
            <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {(() => {
                const all = (pacienteSel.recetas || []).slice().sort((a,b)=> new Date(b.fecha_emision || b.createdAt || 0) - new Date(a.fecha_emision || a.createdAt || 0));
                const total = all.length;
                const totalPages = Math.max(1, Math.ceil(total / pageSize));
                const p = Math.min(page, totalPages);
                const start = (p - 1) * pageSize;
                const pageItems = all.slice(start, start + pageSize);
                return pageItems.map((r) => (
                  <div
                    key={r.id || r._id}
                    className={`consultation-item overflow-hidden ${String(recetaSel?.id || recetaSel?._id) === String(r.id || r._id) ? 'active' : ''}`}
                    role="button"
                    onClick={() => onSelectReceta(r)}
                  >
                    <div className="d-flex gap-3">
                      <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0">
                        <i className="fas fa-file-prescription text-primary"></i>
                      </div>
                      <div className="flex-grow-1 min-w-0 text-break">
                        <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
                          <div className="flex-grow-1 min-w-0">
                            <h6 className="fw-medium mb-0 d-flex align-items-center gap-2">
                              <span>Receta</span>
                              <span className="text-muted opacity-25 small d-none d-sm-inline" style={{ fontSize: '0.33em' }}>#{r.id || r._id}</span>
                            </h6>
                            <p className="text-muted-foreground small mb-0">Emitida por {getDoctorName(r)}</p>
                          </div>
                          <span className="text-muted-foreground small fw-medium ms-2">{(() => { const d = r.fecha_emision || r.createdAt; return d ? new Date(d).toLocaleString() : '—'; })()}</span>
                        </div>
                        <p className="text-muted-foreground small mb-1">{r?.centro_id?.nombre || r?.centro || '—'}</p>
                        <p className="small line-clamp-2 mb-0 text-break">
                          {Array.isArray(r?.medicamentos) ? r.medicamentos.map((m) => `${m.nombre} ${m.dosis || ''}`.trim()).join(' • ') : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
              {(pacienteSel.recetas || []).length === 0 && (
                <div className="p-3 text-muted small">Este paciente no tiene recetas.</div>
              )}
              {(() => {
                const total = (pacienteSel.recetas || []).length;
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

      {/* Columna DERECHA: Detalle + tarjetas */}
      <div className="col-12 col-lg-3 col-xl-5">
        {/* Detalle de receta */}
        {recetaSel && (
          <div className="card mb-3" ref={printAreaRef}>
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                  <span>Receta</span>
                  <span className="text-muted opacity-25 small d-none d-sm-inline" style={{ fontSize: '0.33em' }}>#{recetaSel.id || recetaSel._id}</span>
                </h5>
                <div className="d-flex align-items-center gap-2 flex-wrap flex-shrink-0">
                  <span className={statusBadgeClass(recetaSel.status || (recetaSel.activa ? 'Vigente' : 'Pendiente'))}>{recetaSel.status || (recetaSel.activa ? 'Vigente' : 'Pendiente')}</span>
                  <button className="btn btn-outline-secondary btn-sm" title="Verificar validez" onClick={handleVerify}>
                    <i className="fas fa-shield-check me-1"></i> Verificar
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" title="Descargar PDF" onClick={handleDownloadPdf}>
                    <i className="fas fa-file-pdf me-1"></i> PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body position-relative watermark-bg text-break">
              <div className="mb-4">
                <h6 className="fw-medium mb-2">Indicaciones de la Receta</h6>
                <p className="text-muted-foreground small bg-gray-100 p-3 rounded text-break">{recetaSel.indicaciones || recetaSel.notas || '—'}</p>
              </div>

              <div className="row mb-4 small">
                <div className="col-12 mb-2">
                  <p className="text-muted-foreground mb-0">Paciente</p>
                  <p className="fw-medium mb-0">{pacienteSel.nombre}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">ID Paciente</p>
                  <p className="fw-medium mb-0">{pacienteSel.run}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Médico</p>
                  <p className="fw-medium mb-0">{getDoctorName(recetaSel)}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Centro médico</p>
                  <p className="fw-medium mb-0">{recetaSel?.centro_id?.nombre || recetaSel.centro || '—'}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Folio</p>
                  <p className="fw-medium mb-0 small text-muted opacity-50" style={{ fontSize: '0.33em' }}>#{recetaSel.id || recetaSel._id}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Inicio</p>
                  <p className="fw-medium mb-0">{(() => { const d = recetaSel.fecha_emision || recetaSel.createdAt; return d ? new Date(d).toLocaleString() : '—'; })()}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Válida hasta</p>
                  <p className="fw-medium mb-0">{recetaSel.validaHasta || '—'}</p>
                </div>
              </div>

              <div>
                <h6 className="fw-medium mb-2">Medicamentos Prescritos</h6>
                <div className="d-flex flex-column gap-2">
                  {(Array.isArray(recetaSel?.medicamentos) ? recetaSel.medicamentos : []).map((m, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                      <i className="fas fa-pills text-success"></i>
                      <span className="small">
                        {m.nombre} {m.dosis || ''}{' '}
                        <span className="text-muted">
                          • {m.frecuencia || '—'}{m.duracion ? ` x ${m.duracion}` : ''}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 small">
                <p className="text-muted-foreground mb-1">Código de verificación</p>
                <div className="code-box">{verifCode}</div>
              </div>
            </div>
          </div>
        )}

        {/* Alertas + tarjetas complementarias */}
        {pacienteSel?.alergias?.length > 0 && (
          <div className="alert border-destructive bg-destructive-5 d-flex align-items-center">
            <i className="fas fa-exclamation-triangle text-destructive me-3"></i>
            <div className="text-destructive small">
              <strong>ALERGIAS:</strong><br />
              {pacienteSel.alergias.join(', ')}
            </div>
          </div>
        )}

        <ActiveMedicationsCard />
        <QuickActionsCard />
      </div>
    </div>
  );
}