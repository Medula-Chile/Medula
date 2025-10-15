import React from 'react';
import ActiveMedicationsCard from '../shared/ActiveMedicationsCard';;
import MedicamentosList from '../shared/MedicamentosList';
import { useLocation } from 'react-router-dom';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

export default function RecetasPage() {
  const { user } = useAuth();
  const [recetas, setRecetas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [pacienteId, setPacienteId] = React.useState(null);
  const [alergias, setAlergias] = React.useState([]);

  // Resolver el pacienteId del usuario autenticado usando endpoint protegido /me
  React.useEffect(() => {
    const resolvePacienteId = async () => {
      try {
        setLoading(true);
        setError('');
        // Requiere JWT; el interceptor de api agrega Authorization automáticamente
        const pacienteResp = await api.get('/pacientes/me');
        const paciente = pacienteResp?.data;
        if (!paciente?._id) {
          setError('No se pudo identificar su perfil de paciente. Inicie sesión nuevamente.');
          setLoading(false);
          return;
        }
        console.log('✅ Paciente actual:', paciente._id);
        setPacienteId(paciente._id);
        if (Array.isArray(paciente.alergias)) {
          setAlergias(paciente.alergias.filter(Boolean));
        }
      } catch (err) {
        console.error('❌ Error obteniendo paciente actual (/me):', err);
        setError('No se pudo obtener su perfil de paciente');
      } finally {
        setLoading(false);
      }
    };
    resolvePacienteId();
  }, [user]);

  React.useEffect(() => {
    const fetchRecetas = async () => {
      if (!pacienteId) {
        // Esperar a que se resuelva el pacienteId
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        console.log('🔍 Buscando recetas para paciente:', pacienteId);
        
        // ✅ Llamada al backend filtrando por el paciente actual
        const response = await api.get(`/recetas/paciente/${pacienteId}`);
        
        console.log('📋 Recetas recibidas de la API:', response.data);

        // Normalizar datos según la estructura de tu controller
        const recetasNormalizadas = response.data.map(receta => {
          // Extraer nombres anidados según tu populate
          const nombrePaciente = receta.paciente_id?.usuario_id?.nombre || 
                               receta.paciente_id?.nombre || 
                               'Paciente';
          
          // El medico_id puede ser un objeto Medico o un objeto Usuario
          const nombreMedico = (
            receta.medico_id?.usuario_id?.nombre || 
            receta.medico_id?.nombre || 
            'Dr. No especificado'
          );
          
          const especialidadMedico = receta.medico_id?.especialidad || 'Médico General';
          
          // Calcular fecha de vencimiento (30 días desde emisión por defecto)
          const fechaEmision = new Date(receta.fecha_emision);
          const fechaVencimiento = new Date(fechaEmision);
          fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
          
          const ahora = new Date();
          const estaVigente = receta.activa && fechaVencimiento > ahora;

          return {
            id: receta._id,
            doctor: `Dr. ${nombreMedico}`,
            centro: especialidadMedico,
            fechaLabel: fechaEmision.toLocaleDateString('es-CL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            validaHasta: estaVigente 
              ? fechaVencimiento.toLocaleDateString('es-CL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })
              : 'Expirada',
            status: estaVigente ? 'Vigente' : 'Expirada',
            notas: receta.indicaciones || 'Sin indicaciones adicionales',
            meds: Array.isArray(receta.medicamentos) 
              ? receta.medicamentos.map(med => ({
                  nombre: med.nombre,
                  dosis: med.dosis,
                  frecuencia: med.frecuencia,
                  duracionDias: med.duracion,
                  instrucciones: med.instrucciones || ''
                }))
              : [],
            // Campos originales de la BD
            fecha_emision: receta.fecha_emision,
            activa: receta.activa,
            paciente_id: receta.paciente_id,
            medico_id: receta.medico_id
          };
        });

        setRecetas(recetasNormalizadas);
        
      } catch (err) {
        console.error('❌ Error cargando recetas:', err);
        
        if (err.response?.status === 404) {
          setError('No se encontraron recetas para este paciente');
        } else if (err.response?.status === 500) {
          setError('Error del servidor al cargar las recetas');
        } else {
          setError('Error al cargar las recetas: ' + (err.message || 'Error desconocido'));
        }
        
        // Fallback opcional a datos mock
        await loadMockData();
      } finally {
        setLoading(false);
      }
    };

    // Función de fallback a datos mock
    const loadMockData = async () => {
      try {
        const base = import.meta.env.BASE_URL || '/';
        const mockResponse = await axios.get(`${base}mock/recetas.json`);
        if (mockResponse.data) {
          const normalized = normalizeMockData(mockResponse.data);
          setRecetas(normalized);
          setError(''); // Limpiar error si los mocks cargan
          console.log('📋 Usando datos mock como fallback');
        }
      } catch (mockErr) {
        console.error('Error cargando datos mock:', mockErr);
      }
    };

    // Normalizar datos mock (mantener compatibilidad)
    const normalizeMockData = (arr) => {
      return (Array.isArray(arr) ? arr : []).map((it, idx) => {
        const meds = Array.isArray(it.meds)
          ? it.meds
          : Array.isArray(it.medicamentos)
            ? it.medicamentos.map(m => ({
                nombre: m?.nombre || m?.medicamento || '',
                dosis: m?.dosis || '',
                frecuencia: m?.frecuencia || '',
                duracionDias: m?.duracion || m?.duracionDias || null,
                instrucciones: m?.instrucciones || ''
              }))
            : [];
        const fecha = it.fecha || it.fecha_emision || it.createdAt || it.fechaLabel || null;
        const fechaLabel = it.fechaLabel || (fecha ? new Date(fecha).toLocaleDateString('es-CL') : '—');
        return {
          id: it.id || it._id || `item-${idx}`,
          doctor: it.doctor || it.medico || it.medico_id?.nombre || '—',
          centro: it.centro || it.centro_id?.nombre || '—',
          fechaLabel,
          validaHasta: it.validaHasta || it.fecha_validez || '—',
          status: it.status || it.estado || (it.activa ? 'Vigente' : 'Expirada'),
          notas: it.notas || it.indicaciones || it.descripcion || '—',
          meds,
        };
      });
    };

    fetchRecetas();
  }, [pacienteId]);

  const location = useLocation();
  const getQueryParam = (name) => new URLSearchParams(location.search).get(name);
  const [activa, setActiva] = React.useState(null);
  
  React.useEffect(() => {
    if (!recetas || recetas.length === 0) {
      setActiva(null);
      return;
    }
    
    const folio = getQueryParam('folio');
    if (folio) {
      const found = recetas.find(r => r.id === folio);
      setActiva(found || recetas[0]);
    } else {
      setActiva(recetas[0]);
    }
  }, [location.search, recetas]);

  const printAreaRef = React.useRef(null);

  // Clases para badge de estado de receta
  const statusBadgeClass = (s) => 
    s === 'Vigente' ? 'custom-badge border-success text-white bg-success' : 
    s === 'Expirada' ? 'custom-badge border-secondary text-white bg-secondary' : 
    'custom-badge border-warning text-dark bg-warning';

  // Genera un código de verificación reproducible
  const computeVerificationCode = React.useCallback((r) => {
    if (!r) return '';
    const raw = `${r.id}|${r.fecha_emision || r.fechaLabel}`; 
    let hash = 0; 
    for (let i = 0; i < raw.length; i++) { 
      hash = ((hash << 5) - hash) + raw.charCodeAt(i); 
      hash |= 0; 
    }
    return `VRF-${Math.abs(hash).toString(16).toUpperCase().padStart(6, '0')}`;
  }, []);

  // Datos del paciente desde el contexto de autenticación
  const paciente = { 
    nombre: user?.nombre || user?.user?.nombre || 'Paciente', 
    id: user?.rut || user?.user?.rut || user?.id || 'ID no disponible' 
  };

  const verifCode = React.useMemo(() => (activa ? computeVerificationCode(activa) : ''), [activa, computeVerificationCode]);
  
  const handleVerify = () => {
    if (!activa) return;
    alert(`Receta ${activa.id}\nEstado: ${activa.status}\nEmitida: ${activa.fechaLabel}\nVálida hasta: ${activa.validaHasta}\nCódigo de verificación: ${verifCode}`);
  };

  const handleDownloadPdf = () => {
    if (!activa) return;
    const content = printAreaRef.current?.innerHTML || '';
    const w = window.open('', '_blank', 'width=800,height=600');
    if (!w) return;
    w.document.open();
    w.document.write(`<!doctype html><html><head><title>Receta ${activa.id}</title>
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
        .code-box {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          padding: 8px 12px;
          border-radius: 4px;
          font-family: monospace;
          font-weight: bold;
        }
      </style>
    </head><body>
      <div class="container p-3">${content}</div>
      <script>window.onload = function(){ window.print(); setTimeout(() => window.close(), 500); }</script>
    </body></html>`);
    w.document.close();
  };

  // Estados de carga y error mejorados
  if (loading) {
    return (
      <div className="row g-3">
        <div className="col-12">
          <div className="card h-100">
            <div className="card-body d-flex justify-content-center align-items-center">
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando sus recetas...</p>
                <small className="text-muted">Paciente ID: {pacienteId}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && recetas.length === 0) {
    return (
      <div className="row g-3">
        <div className="col-12">
          <div className="card h-100">
            <div className="card-body">
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
                <div className="mt-2">
                  <small className="text-muted">
                    Usuario: {user?.nombre || user?.email} 
                  </small>
                </div>
                <button 
                  className="btn btn-outline-primary btn-sm mt-2"
                  onClick={() => window.location.reload()}
                >
                  <i className="fas fa-redo me-1"></i>
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activa && recetas.length === 0) {
    return (
      <div className="row g-3">
        <div className="col-12">
          <div className="card h-100">
            <div className="card-body text-center py-5">
              <i className="fas fa-file-prescription fa-3x text-muted mb-3"></i>
              <h6>No se encontraron recetas</h6>
              <p className="text-muted small">No tienes recetas registradas en tu historial</p>
              <div className="mt-3">
                <small className="text-muted">
                  Paciente ID: {pacienteId}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-5 col-xl-4">
        {/* Columna izquierda: listado de recetas */}
        <div className="card h-100">
          <div className="card-header bg-white pb-2">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Mis Recetas</h5>
              <span className="badge bg-primary">{recetas.length}</span>
            </div>
            <p className="text-muted small mb-0">{recetas.length} receta(s) en tu historial</p>
          </div>
          <div className="card-body p-0">
            <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {recetas.map((r) => (
                <div 
                  key={r.id} 
                  className={`consultation-item ${activa?.id === r.id ? 'active' : ''}`} 
                  role="button" 
                  onClick={() => setActiva(r)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex gap-3">
                    <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0">
                      <i className="fas fa-file-prescription text-primary"></i>
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="fw-medium mb-0">Receta {r.id.slice(-8)}</h6>
                          <p className="text-muted-foreground small mb-0">{r.doctor}</p>
                        </div>
                        <span className="text-muted-foreground small fw-medium ms-2">{r.fechaLabel}</span>
                      </div>
                      <p className="text-muted-foreground small mb-1">{r.centro}</p>
                      <p className="small line-clamp-2 mb-0">
                        {Array.isArray(r.meds) ? r.meds.map(m => `${m.nombre || ''} ${m.dosis || ''}`.trim()).join(' • ') : '—'}
                      </p>
                      <span className={`badge ${statusBadgeClass(r.status)} mt-1`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-7 col-xl-5">
        {/* Columna central: detalle de la receta activa */}
        {activa && (
          <div className="card" ref={printAreaRef}>
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Receta {activa.id.slice(-8)}</h5>
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
            <div className="card-body position-relative watermark-bg">
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
                  <p className="fw-medium mb-0">{activa.id.slice(-8)}</p>
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
                      <span className="small">
                        {m.nombre} {m.dosis} 
                        <span className="text-muted">
                          • {m.frecuencia}
                          {m.duracionDias && ` x ${m.duracionDias}`}
                          {m.instrucciones && ` (${m.instrucciones})`}
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
      </div>

      <div className="col-12 col-xl-3">
        {/* Columna derecha: alertas y tarjetas complementarias */}
        {alergias.length > 0 && (
          <div className="alert border-destructive bg-destructive-5 d-flex align-items-start">
            <i className="fas fa-exclamation-triangle text-destructive me-3 mt-1"></i>
            <div className="text-destructive small">
              <strong>ALERGIAS:</strong><br />
              {alergias.map((alergia, idx) => (
                <span key={idx}>
                  {alergia}
                  {idx < alergias.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        )}

        <ActiveMedicationsCard />
      </div>
    </div>
  );
}