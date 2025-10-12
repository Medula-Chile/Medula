import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function ModalAtencion({ open, onClose, pacienteId, doctorId, onSaved }) {
  const [stepReceta, setStepReceta] = useState(false);
  // Consulta
  const [consulta, setConsulta] = useState({
    motivo: '',
    sintomas: '',
    diagnostico: '',
    observaciones: '',
    tratamiento: ''
  });
  // Receta
  const [receta, setReceta] = useState({
    paciente_id: '',
    medico_id: '',
    fecha_emision: new Date().toISOString(),
    medicamentos: [],
    indicaciones: '',
    activa: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setConsulta({ motivo: '', sintomas: '', diagnostico: '', observaciones: '', tratamiento: '' });
      setReceta({
        paciente_id: pacienteId || '',
        medico_id: doctorId || '',
        fecha_emision: new Date().toISOString(),
        medicamentos: [],
        indicaciones: '',
        activa: true
      });
      setStepReceta(false);
      setErrors({});
    }
  }, [open, pacienteId, doctorId]);

  // Autocomplete medicamentos
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchMeds = async () => {
    try {
      setLoading(true);
      const resp = await axios.get('http://localhost:5000/api/medicamentos', { params: { q, activo: true } });
      setResults(Array.isArray(resp.data) ? resp.data.slice(0, 20) : []);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!q) { setResults([]); return; }
    const t = setTimeout(searchMeds, 300);
    return () => clearTimeout(t);
  }, [q]);

  const addMed = (med) => {
    setReceta(prev => ({
      ...prev,
      medicamentos: [...prev.medicamentos, {
        medicamento_id: med._id,
        nombre: med.nombre,
        dosis: med.dosis || '',
        frecuencia: '',
        duracion: '',
        instrucciones: ''
      }]
    }));
    setQ('');
    setResults([]);
  };

  const updateMedField = (idx, field, value) => {
    setReceta(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.map((m, i) => i === idx ? { ...m, [field]: value } : m)
    }));
  };

  const removeMed = (idx) => {
    setReceta(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.filter((_, i) => i !== idx)
    }));
  };

  const validate = () => {
    const e = {};
    if (!consulta.motivo?.trim()) e.motivo = 'Obligatorio';
    if (!consulta.diagnostico?.trim()) e.diagnostico = 'Obligatorio';
    if (stepReceta) {
      if (!receta.paciente_id || !receta.medico_id) e.recetaMeta = 'Paciente y médico son obligatorios';
      if (!Array.isArray(receta.medicamentos) || receta.medicamentos.length === 0) e.meds = 'Agrega al menos un medicamento';
      receta.medicamentos.forEach((m, i) => {
        if (!m.nombre?.trim() || !m.dosis?.trim() || !m.frecuencia?.trim() || !m.duracion?.trim()) {
          e[`med_${i}`] = 'Completa todos los campos';
        }
      });
      if ((receta.indicaciones || '').length > 1000) e.indicaciones = 'Máximo 1000 caracteres';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      consulta: { ...consulta },
      receta: stepReceta ? { ...receta } : null
    };
    const resp = await axios.post('http://localhost:5000/api/consultas', payload);
    if (onSaved) onSaved(resp.data?.consulta);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
      <div className="card shadow" style={{ maxWidth: 900, width: '95%' }} role="dialog" aria-modal="true">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Atención médica</h5>
          <button className="btn btn-sm btn-ghost" onClick={onClose} aria-label="Cerrar"><i className="fas fa-times"></i></button>
        </div>
        <div className="card-body">
          <form className="small" onSubmit={handleSave}>
            {/* Datos de Consulta */}
            <div className="row g-2 g-md-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Motivo de consulta *</label>
                <input className={`form-control ${errors.motivo?'is-invalid':''}`} value={consulta.motivo} onChange={(e)=>setConsulta({ ...consulta, motivo: e.target.value })} />
                {errors.motivo && <div className="invalid-feedback">{errors.motivo}</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Síntomas</label>
                <input className="form-control" value={consulta.sintomas} onChange={(e)=>setConsulta({ ...consulta, sintomas: e.target.value })} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Diagnóstico *</label>
                <input className={`form-control ${errors.diagnostico?'is-invalid':''}`} value={consulta.diagnostico} onChange={(e)=>setConsulta({ ...consulta, diagnostico: e.target.value })} />
                {errors.diagnostico && <div className="invalid-feedback">{errors.diagnostico}</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Tratamiento indicado</label>
                <input className="form-control" value={consulta.tratamiento} onChange={(e)=>setConsulta({ ...consulta, tratamiento: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label">Observaciones</label>
                <textarea className="form-control" rows={2} value={consulta.observaciones} onChange={(e)=>setConsulta({ ...consulta, observaciones: e.target.value })} />
              </div>
            </div>

            {/* Receta opcional */}
            <div className="mt-3">
              {!stepReceta ? (
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>setStepReceta(true)}>Agregar Receta</button>
              ) : (
                <div className="border rounded p-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-1">Receta médica</h6>
                    <span className="badge bg-secondary">{receta.medicamentos.length} medicamentos</span>
                  </div>
                  <div className="row g-2 small">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Paciente ID</label>
                      <input className="form-control" value={receta.paciente_id} onChange={(e)=>setReceta({ ...receta, paciente_id: e.target.value })} disabled={!!pacienteId} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Médico ID</label>
                      <input className="form-control" value={receta.medico_id} onChange={(e)=>setReceta({ ...receta, medico_id: e.target.value })} disabled={!!doctorId} />
                    </div>
                  </div>

                  {/* Buscador de medicamentos */}
                  <div className="mt-2">
                    <label className="form-label">Agregar medicamento</label>
                    <input className="form-control" placeholder="Buscar en catálogo..." value={q} onChange={(e)=>setQ(e.target.value)} />
                    {loading && <div className="text-muted small mt-1">Buscando...</div>}
                    {!loading && results.length > 0 && (
                      <ul className="list-group small mt-1">
                        {results.map(m => (
                          <li key={m._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                              <strong>{m.nombre}</strong>
                              <span className="text-muted"> • {m.principio_activo}</span>
                              {m.dosis ? <span className="text-muted"> • {m.dosis}</span> : null}
                            </span>
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={()=>addMed(m)}>Agregar</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Lista de medicamentos añadidos */}
                  {receta.medicamentos.length > 0 && (
                    <div className="table-responsive mt-2">
                      <table className="table table-sm align-middle">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Dosis *</th>
                            <th>Frecuencia *</th>
                            <th>Duración *</th>
                            <th>Instrucciones</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {receta.medicamentos.map((m, i) => (
                            <tr key={i} className={errors[`med_${i}`] ? 'table-warning' : ''}>
                              <td>{m.nombre}</td>
                              <td><input className="form-control form-control-sm" value={m.dosis} onChange={(e)=>updateMedField(i,'dosis', e.target.value)} /></td>
                              <td><input className="form-control form-control-sm" value={m.frecuencia} onChange={(e)=>updateMedField(i,'frecuencia', e.target.value)} /></td>
                              <td><input className="form-control form-control-sm" value={m.duracion} onChange={(e)=>updateMedField(i,'duracion', e.target.value)} /></td>
                              <td><input className="form-control form-control-sm" value={m.instrucciones||''} onChange={(e)=>updateMedField(i,'instrucciones', e.target.value)} /></td>
                              <td><button type="button" className="btn btn-link text-danger btn-sm" onClick={()=>removeMed(i)}>Quitar</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-2">
                    <label className="form-label">Indicaciones generales</label>
                    <textarea className={`form-control ${errors.indicaciones?'is-invalid':''}`} rows={2} value={receta.indicaciones} onChange={(e)=>setReceta({ ...receta, indicaciones: e.target.value })} />
                    {errors.indicaciones && <div className="invalid-feedback">{errors.indicaciones}</div>}
                  </div>

                  {errors.meds && <div className="alert alert-warning py-2 small mt-2">{errors.meds}</div>}
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
