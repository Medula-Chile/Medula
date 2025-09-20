import React from 'react';
import ActiveMedicationsCard from '../shared/ActiveMedicationsCard';
import QuickActionsCard from '../shared/QuickActionsCard';
import { useLocation } from 'react-router-dom';

export default function RecetasPage() {
  const recetas = [
    { id: 'R-120', fecha: '2024-08-15', fechaLabel: '15 Ago 2024', doctor: 'Dr. Ana Silva', centro: 'CESFAM Norte', status: 'Vigente', validaHasta: '15 Sep 2024', notas: 'Tomar según indicación. Evitar duplicidad con otros analgésicos.', meds: [ { nombre: 'Paracetamol', dosis: '500 mg', frecuencia: 'cada 8 horas' }, { nombre: 'Ibuprofeno', dosis: '200 mg', frecuencia: 'cada 8 horas' }, { nombre: 'Omeprazol', dosis: '20 mg', frecuencia: 'cada 24 horas' } ] },
    { id: 'R-342', fecha: '2024-07-02', fechaLabel: '02 Jul 2024', doctor: 'Dr. Carlos Mendoza', centro: 'Hospital Regional', status: 'Vigente', validaHasta: '02 Oct 2024', notas: 'Controlar glicemias al iniciar tratamiento y registrar adherencia.', meds: [ { nombre: 'Aspirina', dosis: '100 mg', frecuencia: 'cada 12 horas' }, { nombre: 'Metformina', dosis: '850 mg', frecuencia: 'cada 12 horas' } ] },
    { id: 'R-555', fecha: '2024-05-18', fechaLabel: '18 May 2024', doctor: 'Dr. Roberto Sánchez', centro: 'Hospital El Salvador', status: 'Vencida', validaHasta: '18 Jun 2024', notas: 'Continuar solo si es indicado en próximo control.', meds: [ { nombre: 'Vitamina D3', dosis: '1000 IU', frecuencia: 'cada 24 horas' }, { nombre: 'Calcio', dosis: '600 mg', frecuencia: 'cada 24 horas' } ] },
  ];

  const location = useLocation();
  const getQueryParam = (name) => new URLSearchParams(location.search).get(name);
  const [activa, setActiva] = React.useState(recetas[0]);
  React.useEffect(() => {
    const folio = getQueryParam('folio');
    if (!folio) return;
    const found = recetas.find(r => r.id === folio);
    if (found) setActiva(found);
  }, [location.search]);

  const activos = ['Vitaminas prenatales', 'Ácido fólico 5mg', 'Calcio 600mg'];

  const printAreaRef = React.useRef(null);

  const statusBadgeClass = (s) => s === 'Vigente' ? 'custom-badge border-success text-white bg-success' : s === 'Pendiente' ? 'custom-badge border-warning text-dark bg-warning' : 'custom-badge border-secondary text-white bg-secondary';
  const computeVerificationCode = React.useCallback((r) => {
    const raw = `${r.id}|${r.fecha}`; let hash = 0; for (let i = 0; i < raw.length; i++) { hash = ((hash << 5) - hash) + raw.charCodeAt(i); hash |= 0; }
    return `VRF-${Math.abs(hash).toString(16).toUpperCase()}`;
  }, []);
  const paciente = { nombre: 'María Elena Contreras', id: 'RUN 12.345.678-9' };
  const verifCode = React.useMemo(() => computeVerificationCode(activa), [activa, computeVerificationCode]);
  const handleVerify = () => {
    alert(`Receta ${activa.id}\nEstado: ${activa.status}\nEmitida: ${activa.fechaLabel}\nVálida hasta: ${activa.validaHasta}\nCódigo de verificación: ${verifCode}`);
  };

  const handleDownloadPdf = () => {
    // Solución simple: abrir ventana con el HTML del área e invocar print
    const content = printAreaRef.current?.innerHTML || '';
    const w = window.open('', '_blank', 'width=800,height=600');
    if (!w) return;
    w.document.open();
    w.document.write(`<!doctype html><html><head><title>Receta ${activa.id}</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <link rel="stylesheet" href="/src/pages/Paciente/plantilla.css">
    </head><body>
      <div class="container p-3">${content}</div>
      <script>window.onload = function(){ window.print(); window.close(); }</script>
    </body></html>`);
    w.document.close();
  };

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-5 col-xl-4">
        <div className="card h-100">
          <div className="card-header bg-white pb-2">
            <h5 className="card-title mb-0">Mis Recetas</h5>
          </div>
          <div className="card-body p-0">
            <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {recetas.map((r) => (
                <div key={r.id} className={`consultation-item ${activa.id === r.id ? 'active' : ''}`} role="button" onClick={() => setActiva(r)}>
                  <div className="d-flex gap-3">
                    <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0">
                      <i className="fas fa-file-prescription text-primary"></i>
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="fw-medium mb-0">Receta {r.id}</h6>
                          <p className="text-muted-foreground small mb-0">{r.doctor}</p>
                        </div>
                        <span className="text-muted-foreground small fw-medium ms-2">{r.fechaLabel}</span>
                      </div>
                      <p className="text-muted-foreground small mb-1">{r.centro}</p>
                      <p className="small line-clamp-2 mb-0">{r.meds.map(m => `${m.nombre} ${m.dosis}`).join(' • ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-7 col-xl-5">
        <div className="card" ref={printAreaRef}>
          <div className="card-header bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Receta {activa.id}</h5>
              <div className="d-flex align-items-center gap-2">
                <span className={statusBadgeClass(activa.status)}>{activa.status}</span>
                <button className="btn btn-outline-secondary btn-sm" title="Verificar validez" onClick={handleVerify}>
                  <i className="fas fa-shield-check me-1"></i> Verificar
                </button>
                <button className="btn btn-outline-secondary btn-sm" title="Descargar PDF" onClick={handleDownloadPdf}>
                  <i className="fas fa-file-pdf me-1"></i> PDF
                </button>
              </div>
            </div>
          </div>
          <div className="card-body position-relative">
            <div className="mb-4">
              <h6 className="fw-medium mb-2">Indicaciones de la Receta</h6>
              <p className="text-muted-foreground small bg-gray-100 p-3 rounded">{activa.notas}</p>
            </div>

            <div className="row mb-4 small">
              <div className="col-12 col-md-12 mb-2">
                <p className="text-muted-foreground mb-0">Paciente</p>
                <p className="fw-medium mb-0">{paciente.nombre}</p>
              </div>
              <div className="col-6 col-md-6 mb-2">
                <p className="text-muted-foreground mb-0">ID Paciente</p>
                <p className="fw-medium mb-0">{paciente.id}</p>
              </div>
              <div className="col-6 col-md-6 mb-2">
                <p className="text-muted-foreground mb-0">Médico</p>
                <p className="fw-medium mb-0">{activa.doctor}</p>
              </div>
              <div className="col-6 col-md-6 mb-2">
                <p className="text-muted-foreground mb-0">Centro médico</p>
                <p className="fw-medium mb-0">{activa.centro}</p>
              </div>
              <div className="col-6 col-md-6 mb-2">
                <p className="text-muted-foreground mb-0">Folio</p>
                <p className="fw-medium mb-0">{activa.id}</p>
              </div>
              <div className="col-6 col-md-6 mb-2">
                <p className="text-muted-foreground mb-0">Inicio</p>
                <p className="fw-medium mb-0">{activa.fechaLabel}</p>
              </div>
              <div className="col-6 col-md-6 mb-2">
                <p className="text-muted-foreground mb-0">Válida hasta</p>
                <p className="fw-medium mb-0">{activa.validaHasta}</p>
              </div>
            </div>

            <div>
              <h6 className="fw-medium mb-2">Medicamentos Prescritos</h6>
              <div className="d-flex flex-column gap-2">
                {activa.meds.map((m, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                    <i className="fas fa-pills text-success"></i>
                    <span className="small">{m.nombre} {m.dosis} <span className="text-muted">• {m.frecuencia}</span></span>
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
      </div>

      <div className="col-12 col-xl-3">
        <div className="alert border-destructive bg-destructive-5 d-flex align-items-center">
          <i className="fas fa-exclamation-triangle text-destructive me-3"></i>
          <div className="text-destructive small">
            <strong>ALERGIAS:</strong><br />
            Penicilina
          </div>
        </div>

        <ActiveMedicationsCard items={activos} />
        <QuickActionsCard />
      </div>
    </div>
  );
}
