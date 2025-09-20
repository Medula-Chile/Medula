import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MedicamentosPage() {
  const [meds, setMeds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios.get('/mock/medicamentos.json')
      .then(r => { if (mounted) { setMeds(Array.isArray(r.data) ? r.data : []); setError(''); }})
      .catch(() => { if (mounted) setError('No se pudo cargar la lista de medicamentos.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  // Normalización de estados y orden
  const estadoOrder = { ACTIVO: 1, PENDIENTE: 2, INACTIVO: 3 };
  const toUpper = (s) => (s || '').toString().trim().toUpperCase();
  const ordered = React.useMemo(() => {
    const base = meds.map((m) => ({
      id: m.id || 'R-XXX',
      nombre: m.nombre || '',
      dosis: m.dosis || '',
      frecuencia: m.frecuencia || '',
      inicio: m.inicio || '',
      estado: toUpper(m.estado) === 'SUSPENDIDO' ? 'INACTIVO' : toUpper(m.estado || 'INACTIVO'),
    }));
    let active = 0, pending = 0;
    const constrained = base.map((m) => {
      if (m.estado === 'ACTIVO') {
        if (active < 7) { active++; return m; }
        return { ...m, estado: 'INACTIVO' };
      }
      if (m.estado === 'PENDIENTE') {
        if (pending < 2) { pending++; return m; }
        return { ...m, estado: 'INACTIVO' };
      }
      return m;
    });
    return [...constrained].sort((a, b) => (estadoOrder[a.estado] ?? 99) - (estadoOrder[b.estado] ?? 99));
  }, [meds]);

  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(ordered.length / pageSize));
  const start = (page - 1) * pageSize;
  const current = ordered.slice(start, start + pageSize);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="row g-3">
      <div className="col-12 col-md-12 col-lg-9">
        <div className="card h-100">
          <div className="card-header bg-white pb-2">
            <h5 className="card-title mb-0">Mis Medicamentos</h5>
          </div>
          <div className="card-body px-2 pt-0 pb-3 overflow-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
            {!loading && !error && (
            <div className="row gx-2 gy-0 border-bottom small text-muted fw-semibold py-2 px-2 position-sticky top-0 bg-white" style={{ zIndex: 1 }}>
              <div className="col-6 col-md-3">Nombre</div>
              <div className="col-6 col-md-2">Dosis</div>
              <div className="col-12 col-md-3 d-none d-md-block">Frecuencia</div>
              <div className="col-6 col-md-2 d-none d-md-block">Inicio</div>
              <div className="col-6 col-md-1 d-none d-md-block">ID</div>
              <div className="col-6 col-md-1 d-none d-md-block text-end pe-2">Estado</div>
            </div>)}

            {loading && <div className="p-3 text-center text-muted small">Cargando medicamentos…</div>}
            {!!error && !loading && <div className="alert alert-danger my-2" role="alert">{error}</div>}

            {!loading && !error && (
            <div className="px-2">
              {current.map(m => (
                <div key={`${m.id}-${m.nombre}`} className="row gx-2 gy-2 py-2 border-bottom align-items-center small">
                  <div className="col-6 col-md-3 fw-medium">{m.nombre}</div>
                  <div className="col-6 col-md-2">{m.dosis}</div>
                  <div className="col-12 col-md-3 d-none d-md-block">{m.frecuencia}</div>
                  <div className="col-6 col-md-2 d-none d-md-block">{m.inicio}</div>
                  <div className="col-6 col-md-1 d-none d-md-block">
                    <button className="btn btn-link p-0" onClick={() => navigate(`/paciente/recetas?folio=${encodeURIComponent(m.id)}`)}>{m.id}</button>
                  </div>
                  <div className="col-6 col-md-1 d-none d-md-block text-end pe-2">
                    <span className={`badge ${m.estado === 'ACTIVO' ? 'bg-success' : m.estado === 'PENDIENTE' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                      {m.estado.charAt(0)}{m.estado.slice(1).toLowerCase()}
                    </span>
                  </div>
                  {/* Resumen móvil */}
                  <div className="col-12 d-md-none small text-muted mt-1">
                    {m.frecuencia} • {m.inicio} • 
                    <button className="btn btn-link p-0 align-baseline ms-1 me-1" onClick={() => navigate(`/paciente/recetas?folio=${encodeURIComponent(m.id)}`)}>{m.id}</button>
                    • {m.estado.charAt(0)}{m.estado.slice(1).toLowerCase()}
                  </div>
                </div>
              ))}
            </div>)}

            {!loading && !error && (
              <div className="d-flex justify-content-between align-items-center pt-2 px-2">
                <small className="text-muted">Mostrando {start + 1}-{Math.min(start + pageSize, ordered.length)} de {ordered.length}</small>
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
        <div className="alert border-destructive bg-destructive-5 d-flex align-items-center">
          <i className="fas fa-exclamation-triangle text-destructive me-3"></i>
          <div className="text-destructive small">
            <strong>ALERGIAS:</strong><br />
            Penicilina
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-header bg-white pb-2">
            <h6 className="card-title mb-0">Medicamentos Activos</h6>
          </div>
          <div className="card-body">
            {(ordered.filter(m=>m.estado==='ACTIVO').slice(0,5)).map((m)=> (
              <div key={`act-${m.id}-${m.nombre}`} className="d-flex align-items-center gap-2 small mb-2">
                <i className="fas fa-pills text-success small"></i>
                <span>{m.nombre} {m.dosis} <button className="btn btn-link p-0 align-baseline" onClick={()=>navigate(`/paciente/recetas?folio=${encodeURIComponent(m.id)}`)}><span className="text-muted">({m.id})</span></button></span>
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
