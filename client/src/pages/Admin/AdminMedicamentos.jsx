import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function AdminMedicamentos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    principio_activo: '',
    dosis: '',
    presentacion: '',
    laboratorio: '',
    codigo_estandar: '',
    descripcion: '',
    contraindicaciones: '',
    activo: true,
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const resp = await axios.get('http://localhost:5000/api/medicamentos', { params: { q } });
      setItems(Array.isArray(resp.data) ? resp.data : []);
    } catch (e) {
      console.error(e);
      setError('Error al cargar medicamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setForm({
      nombre: '', principio_activo: '', dosis: '', presentacion: '', laboratorio: '',
      codigo_estandar: '', descripcion: '', contraindicaciones: '', activo: true,
    });
  };

  const openNew = () => {
    resetForm();
    setEditing(false);
    setSelected(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (it) => {
    setForm({
      nombre: it.nombre || '',
      principio_activo: it.principio_activo || '',
      dosis: it.dosis || '',
      presentacion: it.presentacion || '',
      laboratorio: it.laboratorio || '',
      codigo_estandar: it.codigo_estandar || '',
      descripcion: it.descripcion || '',
      contraindicaciones: it.contraindicaciones || '',
      activo: !!it.activo,
    });
    setEditing(true);
    setSelected(it);
    setShowForm(true);
    setError('');
  };

  const closeForm = () => { setShowForm(false); setEditing(false); setSelected(null); setError(''); };

  const save = async () => {
    try {
      setError('');
      if (!form.nombre || !form.principio_activo || !form.dosis || !form.presentacion || !form.laboratorio) {
        setError('Nombre, principio activo, dosis, presentación y laboratorio son obligatorios');
        return;
      }
      if (editing && selected) {
        const resp = await axios.put(`http://localhost:5000/api/medicamentos/${selected._id}`, form);
        alert(resp.data?.message || 'Medicamento actualizado');
      } else {
        const resp = await axios.post('http://localhost:5000/api/medicamentos', form);
        alert(resp.data?.message || 'Medicamento creado');
      }
      closeForm();
      fetchItems();
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.error || 'Error al guardar medicamento';
      setError(msg);
    }
  };

  const removeItem = async (it) => {
    if (!window.confirm(`¿Eliminar "${it.nombre}"?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/medicamentos/${it._id}`);
      fetchItems();
    } catch (e) {
      setError('Error al eliminar');
    }
  };

  // Bulk import JSON
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('[\n  {"nombre":"Paracetamol","principio_activo":"Paracetamol","dosis":"500 mg","presentacion":"Tabletas","laboratorio":"Genérico"}\n]');
  const bulkImport = async () => {
    try {
      let items;
      try { items = JSON.parse(bulkText); } catch { setError('JSON inválido'); return; }
      if (!Array.isArray(items) || !items.length) { setError('Debe ser un arreglo con objetos'); return; }
      const resp = await axios.post('http://localhost:5000/api/medicamentos/bulk', { items });
      alert(resp.data?.message || 'Inserción masiva completada');
      setBulkOpen(false);
      fetchItems();
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.error || 'Error en inserción masiva';
      setError(msg);
    }
  };

  const filtered = useMemo(() => items, [items]);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Gestión de Medicamentos</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={openNew}>+ Agregar</button>
          <button className="btn btn-outline-secondary" onClick={fetchItems} disabled={loading}>🔄 Actualizar</button>
          <button className="btn btn-outline-primary" onClick={() => setBulkOpen(true)}>⬆️ Importar JSON</button>
          <button className="btn btn-outline-success" onClick={async()=>{ try { const r = await axios.post('http://localhost:5000/api/medicamentos/seed'); alert(r.data?.message || 'Semilla creada'); fetchItems(); } catch (e) { setError(e.response?.data?.message || 'Error al sembrar'); } }}>🌱 Sembrar 100+</button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <label className="form-label small">Buscar</label>
              <div className="input-group">
                <input className="form-control" placeholder="Nombre, principio activo, laboratorio..." value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') fetchItems(); }} />
                <button className="btn btn-outline-secondary" onClick={fetchItems}>🔍</button>
                {q && <button className="btn btn-outline-secondary" onClick={()=>{ setQ(''); fetchItems(); }}>✕</button>}
              </div>
            </div>
            <div className="col-12 col-md-3 align-self-end">
              <div className="form-check mt-4">
                <input id="chkActivos" className="form-check-input" type="checkbox" onChange={(e)=>{
                  const val = e.target.checked; axios.get('http://localhost:5000/api/medicamentos', { params: { q, activo: val } }).then(r=>setItems(r.data)).catch(()=>setError('Error al filtrar')); }} />
                <label className="form-check-label" htmlFor="chkActivos">Solo activos</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}
      {loading && <div className="p-3 text-muted small">Cargando...</div>}

      {/* Tabla */}
      {!loading && (
        <div className="card">
          <div className="card-header"><h5 className="mb-0">Listado ({filtered.length})</h5></div>
          <div className="card-body p-0">
            {filtered.length === 0 ? (
              <div className="p-3 text-muted small">Sin resultados.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Principio activo</th>
                      <th>Dosis</th>
                      <th>Presentación</th>
                      <th>Laboratorio</th>
                      <th>Código</th>
                      <th>Estado</th>
                      <th style={{ width: 140 }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(it => (
                      <tr key={it._id} className={!it.activo ? 'table-secondary' : ''}>
                        <td><strong>{it.nombre}</strong></td>
                        <td><small className="text-muted">{it.principio_activo}</small></td>
                        <td>{it.dosis}</td>
                        <td>{it.presentacion}</td>
                        <td>{it.laboratorio}</td>
                        <td>{it.codigo_estandar || '—'}</td>
                        <td>
                          <span className={`badge ${it.activo ? 'bg-success' : 'bg-danger'}`}>{it.activo ? 'Activo' : 'Inactivo'}</span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={()=>openEdit(it)} title="Editar">✏️</button>
                            <button className="btn btn-outline-danger" onClick={()=>removeItem(it)} title="Eliminar">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Crear/Editar */}
      {showForm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
          <div className="card shadow" style={{ maxWidth: 700, width: '95%' }} role="dialog" aria-modal="true">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{editing ? 'Editar medicamento' : 'Nuevo medicamento'}</h5>
              <button className="btn btn-sm btn-ghost" onClick={closeForm} aria-label="Cerrar"><i className="fas fa-times"></i></button>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}
              <div className="row g-2 small">
                <div className="col-12 col-md-6">
                  <label className="form-label">Nombre *</label>
                  <input className="form-control" value={form.nombre} onChange={(e)=>setForm({ ...form, nombre: e.target.value })} maxLength={100} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Principio activo *</label>
                  <input className="form-control" value={form.principio_activo} onChange={(e)=>setForm({ ...form, principio_activo: e.target.value })} />
                </div>
                <div className="col-6 col-md-4">
                  <label className="form-label">Dosis *</label>
                  <input className="form-control" value={form.dosis} onChange={(e)=>setForm({ ...form, dosis: e.target.value })} />
                </div>
                <div className="col-6 col-md-4">
                  <label className="form-label">Presentación *</label>
                  <input className="form-control" value={form.presentacion} onChange={(e)=>setForm({ ...form, presentacion: e.target.value })} />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Laboratorio *</label>
                  <input className="form-control" value={form.laboratorio} onChange={(e)=>setForm({ ...form, laboratorio: e.target.value })} />
                </div>
                <div className="col-6 col-md-4">
                  <label className="form-label">Código estándar</label>
                  <input className="form-control" value={form.codigo_estandar} onChange={(e)=>setForm({ ...form, codigo_estandar: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea rows={2} className="form-control" value={form.descripcion} onChange={(e)=>setForm({ ...form, descripcion: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">Contraindicaciones</label>
                  <textarea rows={2} className="form-control" value={form.contraindicaciones} onChange={(e)=>setForm({ ...form, contraindicaciones: e.target.value })} />
                </div>
                <div className="col-12 form-check mt-2">
                  <input id="chkActivo" type="checkbox" className="form-check-input" checked={form.activo} onChange={(e)=>setForm({ ...form, activo: e.target.checked })} />
                  <label className="form-check-label" htmlFor="chkActivo">Activo</label>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-outline-secondary btn-sm" onClick={closeForm}>Cancelar</button>
                <button className="btn btn-primary btn-sm" onClick={save}>{editing ? 'Actualizar' : 'Crear'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Import masivo */}
      {bulkOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
          <div className="card shadow" style={{ maxWidth: 800, width: '95%' }} role="dialog" aria-modal="true">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Importar medicamentos (JSON)</h5>
              <button className="btn btn-sm btn-ghost" onClick={()=>setBulkOpen(false)} aria-label="Cerrar"><i className="fas fa-times"></i></button>
            </div>
            <div className="card-body">
              <p className="small text-muted">Pega un arreglo JSON de medicamentos con campos: nombre, principio_activo, dosis, presentacion, laboratorio, (opcional: codigo_estandar, descripcion, contraindicaciones, activo).</p>
              <textarea className="form-control" rows={10} value={bulkText} onChange={(e)=>setBulkText(e.target.value)} />
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-outline-secondary btn-sm" onClick={()=>setBulkOpen(false)}>Cancelar</button>
                <button className="btn btn-primary btn-sm" onClick={bulkImport}>Importar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
