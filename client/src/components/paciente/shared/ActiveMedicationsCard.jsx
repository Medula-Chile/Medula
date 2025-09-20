import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ActiveMedicationsCard() {
  const [meds, setMeds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    const base = import.meta.env.BASE_URL || '/';
    axios.get(`${base}mock/medicamentos.json`)
      .then(r => { if (mounted) { setMeds(Array.isArray(r.data) ? r.data : []); setError(''); }})
      .catch(() => { if (mounted) setError('No se pudo cargar la lista de medicamentos.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const estadoOrder = { ACTIVO: 1, PENDIENTE: 2, INACTIVO: 3 };
  const toUpper = (s) => (s || '').toString().trim().toUpperCase();
  const ordered = React.useMemo(() => {
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

  return (
    <div className="card mb-3">
      <div className="card-header bg-white pb-2">
        <h6 className="card-title mb-0">Medicamentos Activos</h6>
      </div>
      <div className="card-body active-meds-scroll">
        {loading && <div className="text-muted small">Cargando…</div>}
        {!!error && !loading && <div className="text-danger small">{error}</div>}
        {!loading && !error && activos.length === 0 && (
          <div className="text-muted small">Sin activos</div>
        )}
        {!loading && !error && activos.map((m) => (
          <div key={`act-${m.id}-${m.nombre}`} className="d-flex align-items-center gap-2 small mb-2">
            <i className="fas fa-pills text-success small"></i>
            <span>
              {m.nombre} {m.dosis}{' '}
              <button className="btn btn-link p-0 align-baseline" onClick={() => navigate(`/paciente/recetas?folio=${encodeURIComponent(m.folio || m.id)}`)}>
                <span className="text-muted">({m.folio || m.id})</span>
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
