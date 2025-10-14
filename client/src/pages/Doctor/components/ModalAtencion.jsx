import React, { useEffect, useMemo, useState, useRef } from 'react';
import api from '../../../services/api';

export default function ModalAtencion({ open, onClose, pacienteId, doctorId, citaId, onSaved }) {
  const [stepReceta, setStepReceta] = useState(false);
  // Consulta
  const [consulta, setConsulta] = useState({
    motivo: '',
    sintomas: '',
    diagnostico: '',
    observaciones: '',
    tratamiento: ''
  });
  // Exámenes y Licencia
  const [examenNombre, setExamenNombre] = useState('');
  // examenes: [{ nombre: string, adjuntoUrl?: string }]
  const [examenes, setExamenes] = useState([]);
  const [licenciaOtorga, setLicenciaOtorga] = useState(false);
  const [licenciaDias, setLicenciaDias] = useState('');
  const [licenciaNota, setLicenciaNota] = useState('');
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
  const topRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Info básica para mostrar nombres
  const [pacienteInfo, setPacienteInfo] = useState(null);
  const [medicoInfo, setMedicoInfo] = useState(null);
  const [citaInfo, setCitaInfo] = useState(null);

  useEffect(() => {
    if (open) {
      setConsulta({ motivo: '', sintomas: '', diagnostico: '', observaciones: '', tratamiento: '' });
      setExamenNombre('');
      setExamenes([]);
      setLicenciaOtorga(false);
      setLicenciaDias('');
      setLicenciaNota('');
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

  // Mantener receta en sync si cambian los IDs desde props
  useEffect(() => {
    setReceta(prev => ({ ...prev, paciente_id: pacienteId || prev.paciente_id }));
  }, [pacienteId]);
  useEffect(() => {
    setReceta(prev => ({ ...prev, medico_id: doctorId || prev.medico_id }));
  }, [doctorId]);

  // Fallback: si no viene pacienteId pero sí citaId, intentar obtener el paciente desde la cita
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!open) return;
      if (pacienteId) { setCitaInfo(null); return; }
      if (!citaId) { setCitaInfo(null); return; }
      try {
        const r = await api.get(`/citas/${citaId}`);
        const c = r.data || {};
        const pid = c?.paciente_id?._id || c?.paciente_id || c?.pacienteId || null;
        if (!cancelled) {
          setCitaInfo(c);
          if (pid) {
            setReceta(prev => ({ ...prev, paciente_id: pid }));
            try {
              const p = await api.get(`/pacientes/${pid}`);
              if (!cancelled) setPacienteInfo(p.data || null);
            } catch { /* ignore */ }
          }
        }
      } catch { if (!cancelled) setCitaInfo(null); }
    };
    run();
    return () => { cancelled = true; };
  }, [open, citaId, pacienteId]);

  // Si tenemos pacienteInfo pero receta.paciente_id está vacío, intentar inferirlo
  useEffect(() => {
    if (!open) return;
    if (receta.paciente_id) return;
    const pid = pacienteInfo?._id || pacienteInfo?.id || pacienteInfo?.paciente?._id || pacienteInfo?.paciente?.id || null;
    if (pid) setReceta(prev => ({ ...prev, paciente_id: pid }));
  }, [open, pacienteInfo]);

  // Cargar nombres
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (pacienteId) {
          const r = await api.get(`/pacientes/${pacienteId}`);
          if (!cancelled) setPacienteInfo(r.data || null);
        } else {
          if (!cancelled) setPacienteInfo(null);
        }
      } catch { if (!cancelled) setPacienteInfo(null); }
    };
    run();
    return () => { cancelled = true; };
  }, [pacienteId]);
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (doctorId) {
          try {
            const r = await api.get(`/medicos/${doctorId}`);
            if (!cancelled) setMedicoInfo(r.data || null);
          } catch (err) {
            // Fallback: si doctorId es _id de Usuario, intentar obtener nombre de usuario
            try {
              const u = await api.get(`/users/${doctorId}`);
              if (!cancelled) setMedicoInfo({ usuario: { nombre: u.data?.nombre || u.data?.fullName || u.data?.email || '' } });
            } catch {
              if (!cancelled) setMedicoInfo(null);
            }
          }
        } else {
          if (!cancelled) setMedicoInfo(null);
        }
      } catch { if (!cancelled) setMedicoInfo(null); }
    };
    run();
    return () => { cancelled = true; };
  }, [doctorId]);

  // Exámenes helpers
  const addExamen = () => {
    const nombre = (examenNombre || '').trim();
    if (!nombre) return;
    setExamenes(prev => [...prev, { nombre, adjuntoUrl: null }]);
    setExamenNombre('');
  };
  const removeExamen = (idx) => {
    setExamenes(prev => prev.filter((_, i) => i !== idx));
  };
  const handleUploadAdjunto = async (file, idx) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await api.post('/examenes/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = r.data?.file?.url || null;
      if (url) {
        setExamenes(prev => prev.map((ex, i) => i === idx ? { ...ex, adjuntoUrl: url } : ex));
      }
    } catch (e) {
      // noop, mostrar en UI con alerta si se desea
      setSubmitError(prev => (prev ? prev + ' • ' : '') + 'No se pudo subir adjunto de examen');
    }
  };

  // Autocomplete medicamentos
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchMeds = async () => {
    try {
      setLoading(true);
      const resp = await api.get('/medicamentos', { params: { q, activo: true } });
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
    if (licenciaOtorga) {
      if (!licenciaDias) e.licenciaDias = 'Días requeridos';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    if (!validate()) {
      setSubmitError('Completa los campos obligatorios en Consulta (Motivo, Diagnóstico) y Receta.');
      // Desplazar al inicio del modal para ver el mensaje
      try { topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
      return;
    }
    try {
      setSaving(true);
      const payload = {
        cita_id: citaId || null,
        consulta: {
          ...consulta,
          // solo nombres para la consulta
          examenes: Array.isArray(examenes) ? examenes.map(x => x?.nombre).filter(Boolean) : [],
          licencia: {
            otorga: !!licenciaOtorga,
            dias: licenciaOtorga ? Number(licenciaDias) || null : null,
            nota: licenciaOtorga ? (licenciaNota || '') : ''
          }
        },
        receta: stepReceta ? { ...receta } : null
      };
      const resp = await api.post('/consultas', payload);
      // Crear exámenes en paralelo (no bloqueante)
      try {
        const pid = receta.paciente_id || pacienteId || null;
        const mid = doctorId || receta.medico_id || null;
        const consultaId = resp?.data?.consulta?._id || null;
        if (pid && mid && Array.isArray(examenes) && examenes.length > 0) {
          const tasks = examenes.map((ex) => api.post('/examenes', {
            paciente_id: pid,
            medico_solicitante: mid,
            consulta_id: consultaId,
            tipo_examen: String(ex?.nombre || '').trim(),
            observaciones: consulta?.observaciones || '',
            archivo_adjunto: ex?.adjuntoUrl || undefined
          }));
          const results = await Promise.allSettled(tasks);
          const ok = results.filter(r => r.status === 'fulfilled').length;
          const fail = results.length - ok;
          if (ok > 0) {
            setSubmitSuccess(prev => (prev ? `${prev} • ` : '') + `Exámenes creados: ${ok}${fail ? ` (fallidos: ${fail})` : ''}`);
          } else if (fail > 0) {
            setSubmitError(prev => (prev ? `${prev} • ` : '') + `No se pudieron crear ${fail} exámenes`);
          }
        }
      } catch (exErr) {
        // no bloquear flujo; sólo informar
        setSubmitError(prev => (prev ? `${prev} • ` : '') + 'Fallo al crear exámenes');
      }
      // Marcar cita como completada en BD si se entregó citaId
      if (citaId) {
        try { await api.put(`/citas/${citaId}`, { estado: 'completada' }); } catch { /* no romper si falla */ }
      }
      if (onSaved) onSaved(resp.data?.consulta);
      setSubmitSuccess('Consulta guardada correctamente');
      // Mostrar confirmación breve antes de cerrar
      await new Promise(resolve => setTimeout(resolve, 900));
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'No se pudo guardar la consulta';
      setSubmitError(msg);
      console.error('Guardar consulta error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
      <div
        className="card shadow"
        style={{ maxWidth: 900, width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        role="dialog"
        aria-modal="true"
      >
        <div ref={topRef} className="card-header d-flex justify-content-between align-items-center" style={{ position: 'sticky', top: 0, zIndex: 1, background: '#fff' }}>
          <h5 className="mb-0">Atención médica</h5>
          <button className="btn btn-sm btn-ghost" onClick={onClose} aria-label="Cerrar"><i className="fas fa-times"></i></button>
        </div>
        <div className="card-body" style={{ flex: 1, overflow: 'auto' }}>
          {submitError && (
            <div className="alert alert-danger py-2 small" role="alert" style={{ position: 'sticky', top: 0 }}>{submitError}</div>
          )}
          {submitSuccess && (
            <div className="alert alert-success py-2 small" role="alert" style={{ position: 'sticky', top: submitError ? 36 : 0 }}>{submitSuccess}</div>
          )}
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
                      {/* Mostrar nombre del paciente, si disponible */}
                      <small className="text-muted">
                        {(
                          pacienteInfo?.usuario?.nombre ||
                          pacienteInfo?.usuario_id?.nombre ||
                          pacienteInfo?.nombre ||
                          citaInfo?.paciente_id?.usuario?.nombre ||
                          citaInfo?.paciente?.usuario?.nombre ||
                          ''
                        )}
                      </small>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Médico ID</label>
                      <input className="form-control" value={receta.medico_id} onChange={(e)=>setReceta({ ...receta, medico_id: e.target.value })} disabled={!!doctorId} />
                      {/* Mostrar nombre del médico, si disponible */}
                      <small className="text-muted">{doctorId && medicoInfo?.usuario?.nombre ? medicoInfo.usuario.nombre : ''}</small>
                    </div>
                  </div>

                  {/* Buscador de medicamentos */}
                  <div className="mt-2">
                    <label className="form-label">Agregar medicamento</label>
                    <input className="form-control" placeholder="Buscar en catálogo..." value={q} onChange={(e)=>setQ(e.target.value)} />
                    {loading && <div className="text-muted small mt-1">Buscando...</div>}
                    {!loading && results.length > 0 && (
                      <ul className="list-group small mt-1" style={{ maxHeight: '40vh', overflow: 'auto' }}>
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

            {/* Exámenes solicitados */}
            <div className="mt-3">
              <h6 className="fw-medium mb-2">Exámenes solicitados</h6>
              <div className="row g-2 align-items-end">
                <div className="col-12 col-md-10">
                  <input type="text" className="form-control" placeholder="Hemograma, Rx Tórax, etc." value={examenNombre} onChange={(e)=>setExamenNombre(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter'){ e.preventDefault(); addExamen(); } }} />
                </div>
                <div className="col-12 col-md-2 d-grid">
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={addExamen}>Agregar</button>
                </div>
              </div>
              {Array.isArray(examenes) && examenes.length > 0 && (
                <ul className="list-group list-group-flush mt-2 small">
                  {examenes.map((ex, idx) => (
                    <li key={idx} className="list-group-item">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                        <div className="flex-grow-1">
                          <span className="fw-medium">{ex?.nombre}</span>
                          {ex?.adjuntoUrl ? (
                            <a href={ex.adjuntoUrl} target="_blank" rel="noreferrer" className="ms-2 text-decoration-underline">Adjunto</a>
                          ) : (
                            <span className="ms-2 text-muted">Sin adjunto</span>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <label className="btn btn-outline-secondary btn-sm mb-0">
                            Subir adjunto
                            <input type="file" accept="application/pdf,image/*" hidden onChange={(e)=>handleUploadAdjunto(e.target.files?.[0], idx)} />
                          </label>
                          <button type="button" className="btn btn-link btn-sm text-danger" onClick={()=>removeExamen(idx)}>Quitar</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Licencia médica */}
            <div className="mt-3">
              <h6 className="fw-medium mb-2">Licencia médica</h6>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="licenciaSwitch" checked={!!licenciaOtorga} onChange={(e)=>setLicenciaOtorga(e.target.checked)} />
                <label className="form-check-label" htmlFor="licenciaSwitch">Otorgar licencia</label>
              </div>
              {licenciaOtorga && (
                <div className="row g-2 mt-1">
                  <div className="col-12 col-md-3">
                    <label className="form-label">Días</label>
                    <input type="number" min="1" className={`form-control ${errors.licenciaDias?'is-invalid':''}`} value={licenciaDias} onChange={(e)=>setLicenciaDias(e.target.value)} placeholder="7" />
                    {errors.licenciaDias && <div className="invalid-feedback">{errors.licenciaDias}</div>}
                  </div>
                  <div className="col-12 col-md-9">
                    <label className="form-label">Notas</label>
                    <input type="text" className="form-control" value={licenciaNota} onChange={(e)=>setLicenciaNota(e.target.value)} placeholder="Motivo y recomendaciones" />
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose} disabled={saving}>Cancelar</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
