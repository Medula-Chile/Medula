import React from 'react';
import ActiveMedicationsCard from '../../components/paciente/shared/ActiveMedicationsCard';
import QuickActionsCard from '../../components/paciente/shared/QuickActionsCard';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function RecetasDoctor() {
  // Vista DOCTOR: navegar pacientes -> recetas -> detalle
  const [pacientes, setPacientes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    const base = import.meta.env.BASE_URL || '/';
    axios
      .get(`${base}mock/pacientes_recetas.json`)
      .then((r) => {
        if (!mounted) return;
        const arr = Array.isArray(r.data) ? r.data : [];
        setPacientes(arr);
        setError('');
      })
      .catch(() => mounted && setError('No se pudo cargar la lista de pacientes.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  // ---- selección por query (?patient= & ?folio=)
  const location = useLocation();
  const getQueryParam = (name) => new URLSearchParams(location.search).get(name);

  const [pacienteSel, setPacienteSel] = React.useState(null);
  const [recetaSel, setRecetaSel] = React.useState(null);

  React.useEffect(() => {
    if (pacientes.length === 0) return;

    const qPatient = getQueryParam('patient');
    const qFolio = getQueryParam('folio');

    let p = pacientes[0];
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
  }, [location.search, pacientes]);

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

  if (loading) return <div className="p-3 text-muted small">Cargando pacientes…</div>;
  if (error) return <div className="alert alert-danger my-2" role="alert">{error}</div>;
  if (!pacienteSel) return null;

  return (
    <div className="row g-3">
      {/* Columna IZQUIERDA: Pacientes */}
      <div className="col-12 col-lg-4 col-xl-3">
        <div className="card h-100">
          <div className="card-header bg-white pb-2">
            <h5 className="card-title mb-0">Pacientes</h5>
          </div>
          <div className="card-body p-0">
            <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {pacientes.map((p) => (
                <div
                  key={p.id}
                  className={`consultation-item ${pacienteSel.id === p.id ? 'active' : ''}`}
                  role="button"
                  onClick={() => onSelectPaciente(p)}
                >
                  <div className="d-flex gap-3">
                    <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0">
                      <i className="fas fa-user-injured text-primary"></i>
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="fw-medium mb-0">{p.nombre}</h6>
                          <p className="text-muted-foreground small mb-0">{p.run}</p>
                        </div>
                        <span className="text-muted-foreground small fw-medium ms-2">{p.id}</span>
                      </div>
                      <p className="text-muted-foreground small mb-1">{p.centro}</p>
                      <p className="small line-clamp-2 mb-0">{p.recetas?.length || 0} receta(s)</p>
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
              {(pacienteSel.recetas || []).map((r) => (
                <div
                  key={r.id}
                  className={`consultation-item ${recetaSel?.id === r.id ? 'active' : ''}`}
                  role="button"
                  onClick={() => onSelectReceta(r)}
                >
                  <div className="d-flex gap-3">
                    <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0">
                      <i className="fas fa-file-prescription text-primary"></i>
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="fw-medium mb-0">Receta {r.id}</h6>
                          <p className="text-muted-foreground small mb-0">Emitida por {r.doctor}</p>
                        </div>
                        <span className="text-muted-foreground small fw-medium ms-2">{r.fechaLabel}</span>
                      </div>
                      <p className="text-muted-foreground small mb-1">{r.centro}</p>
                      <p className="small line-clamp-2 mb-0">
                        {r.meds.map((m) => `${m.nombre} ${m.dosis}`).join(' • ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {(pacienteSel.recetas || []).length === 0 && (
                <div className="p-3 text-muted small">Este paciente no tiene recetas.</div>
              )}
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
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Receta {recetaSel.id}</h5>
                <div className="d-flex align-items-center gap-2">
                  <span className={statusBadgeClass(recetaSel.status)}>{recetaSel.status}</span>
                  <button className="btn btn-outline-secondary btn-sm" title="Verificar validez" onClick={handleVerify}>
                    <i className="fas fa-shield-check me-1"></i> Verificar
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" title="Descargar PDF" onClick={handleDownloadPdf}>
                    <i className="fas fa-file-pdf me-1"></i> PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body position-relative watermark-bg">
              <div className="mb-4">
                <h6 className="fw-medium mb-2">Indicaciones de la Receta</h6>
                <p className="text-muted-foreground small bg-gray-100 p-3 rounded">{recetaSel.notas}</p>
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
                  <p className="fw-medium mb-0">{recetaSel.doctor}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Centro médico</p>
                  <p className="fw-medium mb-0">{recetaSel.centro}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Folio</p>
                  <p className="fw-medium mb-0">{recetaSel.id}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Inicio</p>
                  <p className="fw-medium mb-0">{recetaSel.fechaLabel}</p>
                </div>
                <div className="col-6 mb-2">
                  <p className="text-muted-foreground mb-0">Válida hasta</p>
                  <p className="fw-medium mb-0">{recetaSel.validaHasta}</p>
                </div>
              </div>

              <div>
                <h6 className="fw-medium mb-2">Medicamentos Prescritos</h6>
                <div className="d-flex flex-column gap-2">
                  {recetaSel.meds.map((m, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                      <i className="fas fa-pills text-success"></i>
                      <span className="small">
                        {m.nombre} {m.dosis}{' '}
                        <span className="text-muted">
                          • {m.frecuencia}{m.duracionDias ? ` x ${m.duracionDias} días` : ''}
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