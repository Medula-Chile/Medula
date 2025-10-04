import React from 'react';
import axios from 'axios';

export default function ConsultationDetailDoctor({ consulta }) {
  if (!consulta) return null;
  const presion = consulta?.vitals?.presion ?? '—';
  const temperatura = consulta?.vitals?.temperatura ?? '—';
  const pulso = consulta?.vitals?.pulso ?? '—';

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
  const printAreaRef = React.useRef(null);
  const examenes = Array.isArray(consulta.examenes) ? consulta.examenes : [];
  const statusBadgeClass = (s) => s === 'Vigente' ? 'custom-badge border-success text-white bg-success' : s === 'Pendiente' ? 'custom-badge border-warning text-dark bg-warning' : 'custom-badge border-secondary text-white bg-secondary';
  const licOtorga = !!consulta?.licencia?.otorga;
  const licDias = licOtorga ? (consulta?.licencia?.dias ?? '—') : '—';
  const licNota = licOtorga ? (consulta?.licencia?.nota || '—') : '—';

  const estado = consulta.estado || 'En progreso';
  const estadoClass = estado === 'Completado'
    ? 'custom-badge border-success text-white bg-success'
    : (estado === 'En progreso'
      ? 'custom-badge border-warning text-dark bg-warning'
      : 'custom-badge border-secondary text-white bg-secondary');

  const handleVerify = () => { };

  // Nueva función para descargar/imprimir PDF
  const handleDownloadPdf = () => {
    const content = printAreaRef.current?.innerHTML || '';
    const w = window.open('', '_blank', 'width=800,height=600');
    if (!w) return;
    w.document.open();
    w.document.write(`<!doctype html><html><head><title>Orden de Examen</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <style>
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .watermark-bg { position: relative; overflow: hidden; }
        .watermark-bg::after {
          content: "";
          position: absolute; inset: 0;
          background: url('/medula_icono.png') no-repeat center center;
          background-size: contain;
          opacity: 0.06; pointer-events: none;
        }
      </style>
    </head><body>
      <div class="container p-3">${content}</div>
      <script>window.onload = function(){ window.print(); window.close(); }</script>
    </body></html>`);
    w.document.close();
  };

  return (
    <div className="card" ref={printAreaRef}>
      <div className="card-header bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Ordenes de examen</h5>
          <div className="d-flex align-items-center gap-2">
            {/* <span className={estadoClass}>{estado}</span> */}
            <button className="btn btn-outline-secondary btn-sm" title="Descargar PDF" onClick={handleDownloadPdf}>
              <i className="fas fa-file-pdf me-1"></i> PDF
            </button>
            <button className={statusBadgeClass('Vigente')} disabled>
              Vigente
            </button>
          </div>
        </div>
      </div>
      <div className="card-body watermark-bg">
        <div className="mb-4">
          <h6 className="fw-medium mb-2">Orden de examen R-001</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">
            <li>Nombre completo: Maria Elene Contreras</li>
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
        <div className="mb-4">
          <div>
            <h6 className="fw-medium mb-2">Nombre del hospital </h6>
            <p className="text-muted-foreground small bg-gray-100 p-3 rounded">
              <li>Hospital Felix Bulnes</li>
            </p>
          </div>
          <div className="mb-4">
          </div>
          <h6 className="fw-medium mb-2"> Lista de exámenes solicitados </h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">
            <li> Hemograma</li>
            <li> Radiografía de tórax</li>
            <li>Examen de colesterol</li>
          </p>
          <div className="mb-4">
            <h6 className="fw-medium mb-2" >Observaciones adicionales</h6>
            <p className="text-muted-foreground small bg-gray-100 p-3 rounded">
              <li> Recomendaciones para el paciente no tomar medicamentos antes del examen, Ayuno 9 horas minimo y maximo 12 horas.</li>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}