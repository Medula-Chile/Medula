import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export default function MedicamentosPage() {
  const { user } = useAuth();
  const [meds, setMeds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [pacienteId, setPacienteId] = React.useState(null);
  const [pacienteIdLoading, setPacienteIdLoading] = React.useState(true);
  const [alergias, setAlergias] = React.useState([]);
  const navigate = useNavigate();
  const goToReceta = (recetaId) => navigate(`/paciente/recetas?folio=${encodeURIComponent(recetaId)}`);

  // Resolver pacienteId desde el usuario autenticado
  React.useEffect(() => {
    if (!user) {
      setPacienteIdLoading(false);
      return;
    }
    
    const fetchPacienteId = async () => {
      try {
        setPacienteIdLoading(true);
        if (user.pacienteId) {
          setPacienteId(user.pacienteId);
          setPacienteIdLoading(false);
          return;
        }
        
        const userId = user.id || user._id;
        if (!userId) {
          setPacienteIdLoading(false);
          return;
        }
        
        const resp = await axios.get('http://localhost:5000/api/pacientes');
        const pacientes = Array.isArray(resp.data.pacientes) ? resp.data.pacientes : (Array.isArray(resp.data) ? resp.data : []);
        const paciente = pacientes.find(p => 
          String(p.usuario_id?._id || p.usuario_id) === String(userId)
        );
        
        if (paciente) {
          setPacienteId(paciente._id);
          setAlergias(paciente.alergias || []);
        }
      } catch (err) {
        console.error('Error obteniendo pacienteId:', err);
      } finally {
        setPacienteIdLoading(false);
      }
    };
    
    fetchPacienteId();
  }, [user]);

  const displayFrecuencia = React.useCallback((m) => {
    const f = m.frecuencia || '';
    const d = m.duracion || m.duracionDias;
    if (f && f.toLowerCase().includes('diario')) return f;
    return `${f}${d ? ` x ${d} días` : ''}`;
  }, []);

  React.useEffect(() => {
    if (pacienteIdLoading) {
      setLoading(true);
      return;
    }
    
    if (!pacienteId) {
      setLoading(false);
      if (!pacienteIdLoading) {
        setError('No se pudo identificar al paciente.');
      }
      return;
    }
    
    let mounted = true;
    setLoading(true);
    setError('');
    
    const fetchMedicamentos = async () => {
      try {
        // Obtener todas las consultas del paciente
        const consultasResp = await axios.get('http://localhost:5000/api/consultas', {
          params: { paciente: pacienteId }
        });
        const consultas = Array.isArray(consultasResp.data) ? consultasResp.data : [];
        
        // Extraer medicamentos de las recetas embebidas en las consultas
        const medicamentosMap = new Map();
        
        for (const consulta of consultas) {
          const receta = consulta.receta;
          if (!receta || !Array.isArray(receta.medicamentos)) continue;
          
          const recetaId = receta._id || consulta._id;
          const fechaEmision = receta.fecha_emision || consulta.createdAt;
          const activa = receta.activa !== undefined ? receta.activa : true;
          
          for (const med of receta.medicamentos) {
            const key = `${recetaId}-${med.nombre}`;
            if (!medicamentosMap.has(key)) {
              medicamentosMap.set(key, {
                id: recetaId,
                folio: recetaId,
                nombre: med.nombre || '',
                dosis: med.dosis || '',
                frecuencia: med.frecuencia || '',
                duracion: med.duracion || '',
                instrucciones: med.instrucciones || '',
                inicio: fechaEmision ? new Date(fechaEmision).toLocaleDateString('es-CL') : '',
                estado: activa ? 'ACTIVO' : 'INACTIVO',
                recetaId: recetaId
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
          setError('No se pudo cargar la lista de medicamentos.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchMedicamentos();
    return () => { mounted = false; };
  }, [pacienteId, pacienteIdLoading]);

  // Normalización de estados y orden
  const estadoOrder = { ACTIVO: 1, PENDIENTE: 2, INACTIVO: 3 };
  const toUpper = (s) => (s || '').toString().trim().toUpperCase();
  const ordered = React.useMemo(() => {
    // Normaliza y ordena por estado (manteniendo el orden de prioridad definido).
    const base = meds.map(m => ({
      id: m.id || 'R-XXX',
      folio: m.folio,
      nombre: m.nombre || '',
      dosis: m.dosis || '',
      frecuencia: m.frecuencia || '',
      duracion: m.duracion || '',
      duracionDias: m.duracionDias,
      inicio: m.inicio || '',
      estado: toUpper(m.estado) === 'SUSPENDIDO' ? 'INACTIVO' : toUpper(m.estado || 'INACTIVO'),
      recetaId: m.recetaId
    }));
    // Respetar estados del mock y solo ordenar por estado sin imponer topes
    return [...base].sort((a, b) => (estadoOrder[a.estado] ?? 99) - (estadoOrder[b.estado] ?? 99));
  }, [meds]);

  // Paginación simple
  const [page, setPage] = React.useState(1);
  const pageSize = 8;
  // Filtrado por búsqueda (ID o nombre)
  const orderedFiltered = React.useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return ordered;
    return ordered.filter(m =>
      (m.id || '').toLowerCase().includes(q) ||
      (m.nombre || '').toLowerCase().includes(q)
    );
  }, [ordered, query]);
  const totalPages = Math.max(1, Math.ceil(orderedFiltered.length / pageSize));
  const start = (page - 1) * pageSize;
  const current = orderedFiltered.slice(start, start + pageSize);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="row g-3">
      <div className="col-12 col-md-12 col-lg-9">
        <div className="card h-100">
          <div className="card-header bg-white pb-2">
            <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center">
              <h5 className="card-title mb-0">Mis Medicamentos</h5>
              <form
                className="d-flex align-items-center gap-2"
                role="search"
                onSubmit={(e) => { e.preventDefault(); setPage(1); }}
                aria-label="Buscar medicamentos por ID o nombre"
              >
                <div className="input-group input-group-sm" style={{ minWidth: 240 }}>
                  <span className="input-group-text"><i className="fas fa-search" /></span>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Buscar por ID o nombre"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                    aria-label="Buscar por ID o nombre de medicamento"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  Buscar
                </button>
              </form>
            </div>
          </div>
          <div className="card-body px-2 pt-0 pb-3">
            {/* Cabecera de columnas (solo cuando hay datos y no está cargando) */}
            {!loading && !error && (
              <div className="row gx-2 gy-0 border-bottom small text-muted fw-semibold py-2 px-2 position-sticky top-0 bg-white" style={{ zIndex: 1 }}>
                <div className="col-6 col-md-2">Nombre</div>
                <div className="col-6 col-md-2">Dosis</div>
                <div className="col-12 col-md-2 d-none d-md-block">Frecuencia</div>
                <div className="col-6 col-md-2 d-none d-md-block">Duración</div>
                <div className="col-6 col-md-2 d-none d-md-block">Inicio</div>
                <div className="col-6 col-md-1 d-none d-md-block">Receta</div>
                <div className="col-6 col-md-1 d-none d-md-block text-end pe-2">Estado</div>
              </div>
            )}
            {loading && <div className="p-3 text-center text-muted small">Cargando medicamentos…</div>}
            {!!error && !loading && <div className="alert alert-danger my-2" role="alert">{error}</div>}

            {!loading && !error && (
              <div className="px-2">
                {current.map(m => (
                  <div key={`${m.id}-${m.nombre}`} className="row gx-2 gy-2 py-2 border-bottom align-items-center small">
                    <div className="col-6 col-md-2 fw-medium">{m.nombre}</div>
                    <div className="col-6 col-md-2">{m.dosis}</div>
                    <div className="col-12 col-md-2 d-none d-md-block">{m.frecuencia || '—'}</div>
                    <div className="col-6 col-md-2 d-none d-md-block">{m.duracion || '—'}</div>
                    <div className="col-6 col-md-2 d-none d-md-block">{m.inicio}</div>
                    <div className="col-6 col-md-1 d-none d-md-block">
                      <button
                        className="btn btn-link p-0"
                        title="Ver receta"
                        aria-label={`Ver receta ${m.recetaId}`}
                        onClick={() => goToReceta(m.recetaId)}
                      >
                        <i className="fas fa-file-prescription"></i>
                      </button>
                    </div>
                    <div className="col-6 col-md-1 d-none d-md-block text-end pe-2">
                      <span className={`badge ${m.estado === 'ACTIVO' ? 'bg-success' : m.estado === 'PENDIENTE' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {m.estado.charAt(0)}{m.estado.slice(1).toLowerCase()}
                      </span>
                    </div>
                    {/* Resumen móvil */}
                    <div className="col-12 d-md-none small text-muted mt-1">
                      {m.frecuencia || '—'} • {m.duracion || '—'} • {m.inicio} • 
                      <button
                        className="btn btn-link p-0 align-baseline ms-1 me-1"
                        title="Ver receta"
                        aria-label={`Ver receta ${m.recetaId}`}
                        onClick={() => goToReceta(m.recetaId)}
                      >
                        Receta
                      </button>
                      • {m.estado.charAt(0)}{m.estado.slice(1).toLowerCase()}
                    </div>
                  </div>
                ))}
                {orderedFiltered.length === 0 && (
                  <div className="p-3 text-center text-muted small">Sin resultados para "{query}"</div>
                )}
              </div>)}

            {!loading && !error && (
              <div className="d-flex justify-content-between align-items-center pt-2 px-2">
                <small className="text-muted">Mostrando {orderedFiltered.length === 0 ? 0 : start + 1}-{Math.min(start + pageSize, orderedFiltered.length)} de {orderedFiltered.length}</small>
                <nav aria-label="Paginación de medicamentos">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${!canPrev ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => canPrev && setPage((p) => p - 1)}>«</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                      </li>
                    ))}
                    <li className={`page-item ${!canNext ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => canNext && setPage((p) => p + 1)}>»</button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-12 col-md-12 col-lg-3 col-xl-3">
        {alergias.length > 0 && (
          <div className="alert border-destructive bg-destructive-5 d-flex align-items-center">
            <i className="fas fa-exclamation-triangle text-destructive me-3"></i>
            <div className="text-destructive small">
              <strong>ALERGIAS:</strong><br />
              {alergias.join(', ')}
            </div>
          </div>
        )}

        {/* Resumen de medicamentos activos (top 5) con enlaces a receta */}
        <div className="card mb-3">
          <div className="card-header bg-white pb-2">
            <h6 className="card-title mb-0">Medicamentos Activos</h6>
          </div>
          <div className="card-body">
            {(ordered.filter(m=>m.estado==='ACTIVO').slice(0,5)).map((m)=> (
              <div key={`act-${m.id}-${m.nombre}`} className="d-flex align-items-center gap-2 small mb-2">
                <i className="fas fa-pills text-success small"></i>
                <span>{m.nombre} {m.dosis} <button className="btn btn-link p-0 align-baseline" onClick={()=>goToReceta(m.recetaId)} title="Ver receta"><i className="fas fa-file-prescription text-muted"></i></button></span>
              </div>
            ))}
            {ordered.filter(m=>m.estado==='ACTIVO').length === 0 && (
              <div className="text-muted small">Sin activos</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

