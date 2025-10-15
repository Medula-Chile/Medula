import React from 'react';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export default function ActiveMedicationsCard({ maxItems = 7 }) {
  // Tarjeta lateral que muestra un resumen de medicamentos activos del paciente.
  // Carga datos reales desde el backend (consultas con recetas)
  const [meds, setMeds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    // Carga inicial de medicamentos desde el backend
    let mounted = true;
    const fetchMedicamentos = async () => {
      try {
        setLoading(true);
        setError('');

        // 1) Paciente actual
        const meResp = await api.get('/pacientes/me');
        const pacienteId = meResp?.data?._id;
        if (!pacienteId) {
          if (mounted) {
            setMeds([]);
            setError('No se pudo identificar al paciente actual');
          }
          return;
        }

        // 2) Consultas del paciente (param correcto: paciente)
        const consultasResp = await api.get('/consultas', { params: { paciente: pacienteId } });
        const consultas = Array.isArray(consultasResp.data) ? consultasResp.data : [];

        // 3) Extraer medicamentos de las recetas embebidas
        const medicamentosMap = new Map();
        for (const consulta of consultas) {
          const receta = consulta?.receta;
          if (!receta || !Array.isArray(receta.medicamentos)) continue;
          const recetaId = receta._id || consulta._id;
          const fechaEmision = receta.fecha_emision || consulta.createdAt;
          const activa = typeof receta.activa === 'boolean' ? receta.activa : true;
          for (const med of receta.medicamentos) {
            const key = `${recetaId}-${med?.nombre || ''}`;
            if (!medicamentosMap.has(key)) {
              medicamentosMap.set(key, {
                id: recetaId,
                folio: recetaId,
                nombre: med?.nombre || '',
                dosis: med?.dosis || '',
                frecuencia: med?.frecuencia || '',
                inicio: fechaEmision ? new Date(fechaEmision).toLocaleDateString('es-CL') : '',
                estado: activa ? 'ACTIVO' : 'INACTIVO',
              });
            }
          }
        }

        if (mounted) {
          setMeds(Array.from(medicamentosMap.values()));
          setError('');
        }
      } catch (err) {
        console.error('Error cargando medicamentos:', err);
        if (mounted) {
          setMeds([]);
          setError('No se pudo cargar la lista de medicamentos.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchMedicamentos();
    return () => { mounted = false; };
  }, [user]);

  const estadoOrder = { ACTIVO: 1, PENDIENTE: 2, INACTIVO: 3 };
  const toUpper = (s) => (s || '').toString().trim().toUpperCase();
  const ordered = React.useMemo(() => {
    // Normaliza estado y aplica una ligera restricción para no sobrecargar la tarjeta.
    const base = meds.map(m => ({
      id: m.id || 'R-XXX',
      folio: m.folio,
      nombre: m.nombre || '',
      dosis: m.dosis || '',
      frecuencia: m.frecuencia || '',
      inicio: m.inicio || '',
      estado: toUpper(m.estado) === 'SUSPENDIDO' ? 'INACTIVO' : toUpper(m.estado || 'INACTIVO'),
    }));
    let a = 0, p = 0;
    const constrained = base.map((m) => {
      if (m.estado === 'ACTIVO') {
        if (a < 7) { a++; return m; }
        return { ...m, estado: 'INACTIVO' };
      }
      if (m.estado === 'PENDIENTE') {
        if (p < 2) { p++; return m; }
        return { ...m, estado: 'INACTIVO' };
      }
      return m;
    });
    return [...constrained].sort((x, y) => (estadoOrder[x.estado] ?? 99) - (estadoOrder[y.estado] ?? 99));
  }, [meds]);

  const activos = ordered.filter(m => m.estado === 'ACTIVO');
  
  // Paginación
  const totalPages = Math.ceil(activos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const activosPaginados = activos.slice(startIndex, endIndex);
  
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="card mb-3">
      <div className="card-header bg-white pb-2">
        <h6 className="card-title mb-0">Medicamentos Activos</h6>
      </div>
      <div className="card-body">
        {/* Estados de carga y error */}
        {loading && <div className="text-muted small">Cargando…</div>}
        {!!error && !loading && <div className="text-danger small">{error}</div>}
        
        {/* Lista de medicamentos activos o texto vacío */}
        {!loading && !error && activos.length === 0 && (
          <div className="text-muted small">Sin medicamentos activos</div>
        )}
        
        {!loading && !error && activosPaginados.map((m) => (
          <div key={`act-${m.id}-${m.nombre}`} className="d-flex align-items-start gap-2 mb-2">
            <i className="fas fa-pills text-success small mt-1"></i>
            <div className="flex-grow-1 min-w-0">
              <div className="small">
                <span className="fw-medium">{m.nombre}</span>
                {m.dosis && <span className="text-muted"> {m.dosis}</span>}
              </div>
              <button 
                className="btn btn-link p-0 text-decoration-none small" 
                onClick={() => navigate(`/paciente/recetas?folio=${encodeURIComponent(m.folio || m.id)}`)}
                title="Ver receta"
              >
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  ({(m.folio || m.id).slice(-8)})
                </span>
              </button>
            </div>
          </div>
        ))}
        
        {/* Paginación - solo mostrar si hay más de itemsPerPage medicamentos */}
        {!loading && !error && activos.length > itemsPerPage && (
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
            <small className="text-muted">
              {startIndex + 1}-{Math.min(endIndex, activos.length)} de {activos.length}
            </small>
            <div className="btn-group btn-group-sm" role="group">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!canPrev}
                title="Anterior"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={!canNext}
                title="Siguiente"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

