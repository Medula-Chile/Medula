import React, { useEffect, useMemo, useState } from 'react';
import http from '../../api/http';

export default function AdminConsultas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRaw, setShowRaw] = useState(false);

  // filtros
  const [q, setQ] = useState('');
  const [paciente, setPaciente] = useState('');
  const [medico, setMedico] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (q) params.q = q;
      if (paciente) params.paciente = paciente;
      if (medico) params.medico = medico;
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;
      const resp = await http.get('/api/consultas', { params });
      setItems(Array.isArray(resp.data) ? resp.data : []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Error al cargar consultas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConsultas(); }, []);

  const filtered = useMemo(() => items, [items]);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Consultas médicas</h2>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-secondary">Recibidas: {filtered.length}</span>
          <button className="btn btn-outline-dark" onClick={()=>setShowRaw(s=>!s)}>{showRaw ? 'Ocultar JSON' : 'Ver JSON'}</button>
          <button className="btn btn-outline-secondary" onClick={fetchConsultas} disabled={loading}>🔄 Actualizar</button>
        </div>
      </div>

      {/* filtros */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-md-4">
              <label className="form-label small">Buscar (motivo, diagnóstico, observaciones, tratamiento)</label>
              <div className="input-group">
                <input className="form-control" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="texto libre" onKeyDown={(e)=>{ if (e.key==='Enter') fetchConsultas(); }} />
                <button className="btn btn-outline-secondary" onClick={fetchConsultas}>🔍</button>
                {!!q && <button className="btn btn-outline-secondary" onClick={()=>{ setQ(''); fetchConsultas(); }}>✕</button>}
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
                      <th>Paciente</th>
                      <th>Médico</th>
                      <th>Motivo</th>
                      <th>Diagnóstico</th>
                      <th>Receta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => {
                      const fecha = new Date(c.createdAt).toLocaleString();
                      const pacienteNombre = c?.receta?.paciente_id?.usuario_id?.nombre || c?.receta?.paciente_id?._id || '-';
                      const medicoNombre = c?.receta?.medico_id?.nombre || c?.receta?.medico_id?.email || c?.receta?.medico_id || '-';
                      const tieneReceta = !!c?.receta;
                      const medsCount = c?.receta?.medicamentos?.length || 0;
                      return (
                        <tr key={c._id}>
                          <td>{fecha}</td>
                          <td>{pacienteNombre}</td>
                          <td>{medicoNombre}</td>
                          <td className="text-truncate" style={{ maxWidth: 240 }}>{c.motivo}</td>
                          <td className="text-truncate" style={{ maxWidth: 240 }}>{c.diagnostico}</td>
                          <td>{tieneReceta ? <span className="badge bg-primary">{`Sí (${medsCount})`}</span> : <span className="badge bg-secondary">No</span>}</td>
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
    </div>
  );
}
