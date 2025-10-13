import React, { useEffect, useMemo, useState } from 'react';
import http from '../../api/http';

export default function AdminRecetasList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRaw, setShowRaw] = useState(false);
  const [detail, setDetail] = useState(null);

  // filtros
  const [q, setQ] = useState('');
  const [paciente, setPaciente] = useState('');
  const [medico, setMedico] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const fetchRecetas = async () => {
    try {
      setLoading(true);
      setError('');
      // recetaController actual no recibe filtros; podríamos filtrar client-side por ahora
      const resp = await http.get('/api/recetas');
      let arr = Array.isArray(resp.data) ? resp.data : [];
      // Filtrado básico cliente
      if (q) {
        const rx = new RegExp(q, 'i');
        arr = arr.filter(r => rx.test(r.indicaciones||'') || r.medicamentos?.some(m => rx.test(m?.nombre) || rx.test(m?.dosis)));
      }
      if (paciente) arr = arr.filter(r => String(r?.paciente_id?._id || r?.paciente_id) === String(paciente));
      if (medico) arr = arr.filter(r => String(r?.medico_id?._id || r?.medico_id) === String(medico));
      if (desde) arr = arr.filter(r => new Date(r.fecha_emision) >= new Date(desde));
      if (hasta) arr = arr.filter(r => new Date(r.fecha_emision) <= new Date(hasta));
      setItems(arr);
    } catch (e) {
      setError(e?.response?.data?.message || 'Error al cargar recetas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecetas(); }, []);

  const filtered = useMemo(() => items, [items]);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Recetas médicas</h2>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-secondary">Recibidas: {filtered.length}</span>
          <button className="btn btn-outline-dark" onClick={()=>setShowRaw(s=>!s)}>{showRaw ? 'Ocultar JSON' : 'Ver JSON'}</button>
          <button className="btn btn-outline-secondary" onClick={fetchRecetas} disabled={loading}>🔄 Actualizar</button>
        </div>
      </div>

      {/* filtros */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-md-4">
              <label className="form-label small">Buscar (indicaciones, medicamentos)</label>
              <div className="input-group">
                <input className="form-control" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="texto libre" onKeyDown={(e)=>{ if (e.key==='Enter') fetchRecetas(); }} />
                <button className="btn btn-outline-secondary" onClick={fetchRecetas}>🔍</button>
                {!!q && <button className="btn btn-outline-secondary" onClick={()=>{ setQ(''); fetchRecetas(); }}>✕</button>}
              </div>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small">Paciente ID</label>
              <input className="form-control" value={paciente} onChange={(e)=>setPaciente(e.target.value)} placeholder="ObjectId" />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small">Médico ID</label>
              <input className="form-control" value={medico} onChange={(e)=>setMedico(e.target.value)} placeholder="ObjectId" />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small">Desde</label>
              <input type="date" className="form-control" value={desde} onChange={(e)=>setDesde(e.target.value)} />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small">Hasta</label>
              <input type="date" className="form-control" value={hasta} onChange={(e)=>setHasta(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}
      {showRaw && (
        <div className="card mb-3">
          <div className="card-header"><strong>Respuesta cruda del API</strong></div>
          <div className="card-body" style={{ maxHeight: 300, overflow: 'auto' }}>
            <pre className="small mb-0">{JSON.stringify(items, null, 2)}</pre>
          </div>
        </div>
      )}
      {loading && <div className="p-3 text-muted small">Cargando...</div>}

      {!loading && (
        <div className="card">
          <div className="card-header"><h5 className="mb-0">Resultados ({filtered.length})</h5></div>
          <div className="card-body p-0">
            {filtered.length === 0 ? (
              <div className="p-3 text-muted small">Sin resultados.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Folio</th>
                      <th>Paciente</th>
                      <th>Médico</th>
                      <th>Indicaciones</th>
                      <th>Medicamentos</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => {
                      const fecha = r.fecha_emision ? new Date(r.fecha_emision).toLocaleString() : '-';
                      const pacienteNombre = r?.paciente_id?.usuario_id?.nombre || r?.paciente_id?.nombre || r?.paciente_id || '-';
                      const medicoNombre = r?.medico_id?.nombre || r?.medico_id?.email || r?.medico_id || '-';
                      const medsCount = Array.isArray(r.medicamentos) ? r.medicamentos.length : 0;
                      return (
                        <tr key={r._id}>
                          <td>{fecha}</td>
                          <td><code>{r._id}</code></td>
                          <td>{pacienteNombre}</td>
                          <td>{medicoNombre}</td>
                          <td className="text-truncate" style={{ maxWidth: 240 }}>{r.indicaciones || '—'}</td>
                          <td><span className="badge bg-primary">{medsCount}</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary" onClick={()=>setDetail(r)}>Ver detalle</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal detalle */}
      {detail && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
          <div className="card shadow" style={{ maxWidth: 800, width: '95%' }} role="dialog" aria-modal="true">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Detalle receta <code>{detail._id}</code></h5>
              <button className="btn btn-sm btn-ghost" onClick={()=>setDetail(null)} aria-label="Cerrar"><i className="fas fa-times"></i></button>
            </div>
            <div className="card-body small">
              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <label className="form-label">Paciente</label>
                  <div className="form-control bg-light">{detail?.paciente_id?.usuario_id?.nombre || detail?.paciente_id?.nombre || detail?.paciente_id || '-'}</div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Médico</label>
                  <div className="form-control bg-light">{detail?.medico_id?.nombre || detail?.medico_id?.email || detail?.medico_id || '-'}</div>
                </div>
                <div className="col-12">
                  <label className="form-label">Indicaciones</label>
                  <div className="form-control bg-light" style={{ whiteSpace: 'pre-wrap' }}>{detail?.indicaciones || '—'}</div>
                </div>
              </div>
              <div className="mt-3">
                <h6>Medicamentos ({Array.isArray(detail?.medicamentos)?detail.medicamentos.length:0})</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Dosis</th>
                        <th>Frecuencia</th>
                        <th>Duración</th>
                        <th>Instrucciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(detail?.medicamentos||[]).map((m, i) => (
                        <tr key={i}>
                          <td>{m.nombre}</td>
                          <td>{m.dosis}</td>
                          <td>{m.frecuencia}</td>
                          <td>{m.duracion}</td>
                          <td>{m.instrucciones||'—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
