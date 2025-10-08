import React, { useState, useEffect, useRef, useMemo } from 'react';
import TimelineMedico from './components/TimelineMedico';
import ConsultationDetailDoctor from './components/ConsultationDetailDoctor';
import { useAuth } from '../../contexts/AuthContext';
import { subscribe, getAssignments, seedIfEmpty, upsertAssignment } from './data/assignmentsStore';

export default function DoctorInicio() {
  // Vista principal del Médico
  // Estructura: Timeline (izquierda), Detalle (centro), Panel derecho (métricas/avisos)
  // Obtener el usuario (doctor) activo de la sesión
  const { user } = useAuth();
  const doctorName = (user?.fullName || user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ')).trim() || 'Médico/a';
  const doctorSpecialty = (user?.specialty || user?.especialidad || user?.profession || user?.titulo || 'Medicina General');

  // Fuente de datos: store maestro de asignaciones
  const [allItems, setAllItems] = useState(() => getAssignments());
  const [activeId, setActiveId] = useState(allItems[0]?.id ?? null);
  // Seed inicial si está vacío
  useEffect(() => { seedIfEmpty({ doctorName, doctorSpecialty }); }, [doctorName, doctorSpecialty]);
  // Suscripción al store
  useEffect(() => {
    const unsub = subscribe((arr) => {
      // Mantener nombre/especialidad sincronizados del usuario
      const merged = arr.map(it => ({
        ...it,
        medico: doctorName || it.medico,
        especialidad: doctorSpecialty || it.especialidad,
      }));
      setAllItems(merged);
      if (!merged.find(it => String(it.id) === String(activeId))) {
        setActiveId(merged[0]?.id ?? null);
      }
    });
    // Inicial
    const init = getAssignments();
    setAllItems(init.map(it => ({ ...it, medico: doctorName || it.medico, especialidad: doctorSpecialty || it.especialidad })));
    return () => unsub();
  }, [doctorName, doctorSpecialty]);

  // Filtrar solo las atenciones de hoy para el timeline
  const todayItems = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
    const start = new Date(y, m, d, 0, 0, 0, 0);
    const end = new Date(y, m, d, 23, 59, 59, 999);
    const inToday = (iso) => {
      if (!iso) return false;
      const dt = new Date(iso);
      return dt >= start && dt <= end;
    };
    const byTime = (a, b) => new Date(a.when || 0) - new Date(b.when || 0);
    return allItems.filter(it => inToday(it.when)).slice().sort(byTime);
  }, [allItems]);
  const consulta = useMemo(() => (todayItems.find(x => String(x.id) === String(activeId)) || null), [todayItems, activeId]);
  const [open, setOpen] = useState(false);

  // Asegurar selección válida dentro de los items de hoy
  useEffect(() => {
    if (!Array.isArray(todayItems)) return;
    if (todayItems.length === 0) return; // no forzar nada si no hay atenciones hoy
    const belongs = todayItems.some(it => String(it.id) === String(activeId));
    if (!belongs) {
      setActiveId(todayItems[0]?.id ?? null);
    }
  }, [todayItems, activeId]);
  
  // Formulario del modal de atención
  const [form, setForm] = useState({
    observaciones: '',
    presion: '',
    temperatura: '',
    pulso: '',
    proximoControl: '',
    recetaId: '',
    // Medicamentos detallados (nuevos)
    medicamentosDet: [],
    medNombre: '',
    medDias: '',
    medFrecuencia: '',
    // Exámenes solicitados
    examenes: [],
    examenNombre: '',
    // Licencia médica
    licenciaOtorga: false,
    licenciaDias: '',
    licenciaNota: '',
  });
  const [errors, setErrors] = useState({});

  // Ref para enfocar el primer campo de medicamentos tras agregar
  const medNombreRef = useRef(null);

  // Mantener nombre/especialidad en store cuando cambie el usuario (opcional)
  useEffect(() => {
    if (!doctorName && !doctorSpecialty) return;
    // No mutamos todos en bloque, ya que el store emitirá y sincronizará en la suscripción superior
  }, [doctorName, doctorSpecialty]);

  const openModal = () => {
    if (consulta) {
      setForm({
        observaciones: consulta.observaciones && consulta.observaciones !== '—' ? consulta.observaciones : '',
        presion: consulta?.vitals?.presion || '',
        temperatura: consulta?.vitals?.temperatura || '',
        pulso: consulta?.vitals?.pulso || '',
        proximoControl: consulta.proximoControl && consulta.proximoControl !== '—' ? consulta.proximoControl : '',
        recetaId: consulta.recetaId || '',
        medicamentos: (consulta.medicamentos || []).join('\n'),
        medicamentosDet: Array.isArray(consulta.medicamentosDet) ? consulta.medicamentosDet : [],
        medNombre: '',
        medDias: '',
        medFrecuencia: '',
        examenes: Array.isArray(consulta.examenes) ? consulta.examenes : [],
        examenNombre: '',
        licenciaOtorga: Boolean(consulta?.licencia?.otorga) || false,
        licenciaDias: consulta?.licencia?.dias || '',
        licenciaNota: consulta?.licencia?.nota || '',
      });
      setErrors({});
    }
    setOpen(true);
  };

  // Previsualización en vivo en el detalle: mezclar datos del formulario sobre la consulta activa cuando el modal está abierto
  const consultaPreview = useMemo(() => {
    if (!consulta) return null;
    if (!open) return consulta;
    return {
      ...consulta,
      observaciones: form.observaciones?.trim() || consulta.observaciones,
      proximoControl: form.proximoControl?.trim() || consulta.proximoControl,
      recetaId: form.recetaId?.trim() || consulta.recetaId,
      vitals: {
        presion: form.presion?.trim() || consulta?.vitals?.presion || null,
        temperatura: form.temperatura?.trim() || consulta?.vitals?.temperatura || null,
        pulso: form.pulso?.trim() || consulta?.vitals?.pulso || null,
      },
      medicamentos: [],
      medicamentosDet: Array.isArray(form.medicamentosDet) ? form.medicamentosDet : consulta.medicamentosDet,
      examenes: Array.isArray(form.examenes) ? form.examenes : consulta.examenes,
      licencia: {
        otorga: !!form.licenciaOtorga,
        dias: form.licenciaOtorga ? (Number(form.licenciaDias) || null) : null,
        nota: form.licenciaOtorga ? (form.licenciaNota || '') : '',
      },
      estado: consulta.estado,
    };
  }, [consulta, open, form]);
  const closeModal = () => setOpen(false);
  const validate = () => { const e = {}; setErrors(e); return true; };

  // Handler para agregar medicamento detallado y enfocarse en el siguiente
  const addMedicamento = () => {
    const nombre = form.medNombre?.trim();
    const dias = form.medDias ? Number(form.medDias) : null;
    const frecuencia = form.medFrecuencia?.trim();
    if (!nombre) return;
    const nuevo = { nombre, dias, frecuencia };
    setForm(prev => ({
      ...prev,
      medicamentosDet: [...(prev.medicamentosDet || []), nuevo],
      medNombre: '', medDias: '', medFrecuencia: ''
    }));
    // Reenfocar al primer input para ingresar una nueva línea
    setTimeout(() => { medNombreRef.current?.focus(); }, 0);
  };
  const handleSave = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    if (!activeId) return;
    const current = allItems.find(it => String(it.id) === String(activeId));
    if (!current) return;
    upsertAssignment({
      ...current,
      observaciones: form.observaciones?.trim() || '—',
      proximoControl: form.proximoControl?.trim() || '—',
      recetaId: form.recetaId?.trim() || null,
      vitals: { presion: form.presion?.trim() || null, temperatura: form.temperatura?.trim() || null, pulso: form.pulso?.trim() || null },
      medicamentos: [],
      medicamentosDet: Array.isArray(form.medicamentosDet) ? form.medicamentosDet : [],
      examenes: Array.isArray(form.examenes) ? form.examenes : [],
      licencia: { otorga: !!form.licenciaOtorga, dias: form.licenciaOtorga ? Number(form.licenciaDias) || null : null, nota: form.licenciaOtorga ? (form.licenciaNota || '') : '' },
      estado: 'Completado',
    });
    setOpen(false);
  };

  return (<>
    <div className="container-fluid">
      <div className="row g-3">
        {/* Nueva disposición: Timeline (izq), Detalle (centro) y Sidebar (der) */}
        <div className="col-12 col-lg-5 col-xl-4">
          <TimelineMedico items={todayItems} activeId={activeId} onSelect={setActiveId} onStart={openModal} />
        </div>
        <div className="col-12 col-lg-7 col-xl-5">
          <ConsultationDetailDoctor consulta={consultaPreview} />
        </div>
        <div className="col-12 col-xl-3">
          {/* Panel del Médico (métricas) */}
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Panel del Médico</h5>
              <span className="custom-badge border-success text-success">Beta</span>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <div className="p-3 border rounded bg-gray-100 d-flex align-items-center gap-3">
                    <i className="fas fa-calendar-check text-primary fa-lg" />
                    <div>
                      <p className="mb-0 small text-muted">Citas de hoy</p>
                      <p className="mb-0 fw-semibold">5</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="p-3 border rounded bg-gray-100 d-flex align-items-center gap-3">
                    <i className="fas fa-user-md text-success fa-lg" />
                    <div>
                      <p className="mb-0 small text-muted">Pacientes en sala</p>
                      <p className="mb-0 fw-semibold">2</p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* Agenda Próxima */}
          <div className="card mt-3">
            <div className="card-header bg-white">
              <h6 className="mb-0">Agenda Próxima</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0 small">
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span>10:00 - Juan Pérez</span>
                  <span className="text-muted">Consulta General</span>
                </li>
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span>10:30 - María Soto</span>
                  <span className="text-muted">Controles</span>
                </li>
                <li className="d-flex justify-content-between py-2">
                  <span>11:00 - Pedro Díaz</span>
                  <span className="text-muted">Resultados</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="card mt-3">
            <div className="card-header bg-white">
              <h6 className="mb-0">Notificaciones</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0 small">
                <li className="py-2 border-bottom d-flex align-items-center gap-2">
                  <i className="fas fa-info-circle text-primary" /> Nueva derivación recibida para revisión.
                </li>
                <li className="py-2 border-bottom d-flex align-items-center gap-2">
                  <i className="fas fa-shield-alt text-success" /> Sistema conectado de forma segura.
                </li>
                
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modal de registro de atención (estilo PerfilPage) */}
    {open && (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
        <div className="card shadow" style={{ maxWidth: 720, width: '95%' }} role="dialog" aria-modal="true">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Registrar atención</h5>
            <button className="btn btn-sm btn-ghost" onClick={closeModal} aria-label="Cerrar"><i className="fas fa-times"></i></button>
          </div>
          <div className="card-body">
            <form className="small" onSubmit={handleSave}>
              <div className="row g-2 g-md-3">
                <div className="col-12">
                  <label className="form-label">Observaciones</label>
                  <textarea className="form-control" rows={3} value={form.observaciones} onChange={(e)=>setForm({ ...form, observaciones: e.target.value })} placeholder="Motivo de consulta, hallazgos, indicaciones..." />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Presión</label>
                  <input type="text" className="form-control" value={form.presion} onChange={(e)=>setForm({ ...form, presion: e.target.value })} placeholder="120/80" />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Temperatura</label>
                  <input type="text" className={`form-control ${errors.temperatura ? 'is-invalid' : ''}`} value={form.temperatura} onChange={(e)=>setForm({ ...form, temperatura: e.target.value })} placeholder="36.5°C" />
                  {errors.temperatura && <div className="invalid-feedback">{errors.temperatura}</div>}
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Pulso</label>
                  <input type="text" className="form-control" value={form.pulso} onChange={(e)=>setForm({ ...form, pulso: e.target.value })} placeholder="72 bpm" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Próximo control</label>
                  <input type="text" className="form-control" value={form.proximoControl} onChange={(e)=>setForm({ ...form, proximoControl: e.target.value })} placeholder="15 Oct 2025" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Folio de Receta (opcional)</label>
                  <input type="text" className="form-control" value={form.recetaId} onChange={(e)=>setForm({ ...form, recetaId: e.target.value })} placeholder="R-123" />
                </div>
                {/* Se elimina el textarea legacy de medicamentos para usar solo la sección detallada */}
                {/* Medicamentos detallados (nuevos): nombre, días, frecuencia */}
                <div className="col-12 mt-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label mb-0">Medicamentos detallados</label>
                  </div>
                  <div className="row g-2 align-items-end">
                    <div className="col-12 col-md-5">
                      <label className="form-label">Nombre</label>
                      <input ref={medNombreRef} type="text" className="form-control" value={form.medNombre} onChange={(e)=>setForm({ ...form, medNombre: e.target.value })} onKeyDown={(e)=>{ if (e.key==='Enter'){ e.preventDefault(); addMedicamento(); } }} placeholder="Paracetamol 500mg" />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label">Días</label>
                      <input type="number" min="1" className="form-control" value={form.medDias} onChange={(e)=>setForm({ ...form, medDias: e.target.value })} onKeyDown={(e)=>{ if (e.key==='Enter'){ e.preventDefault(); addMedicamento(); } }} placeholder="3" />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label">Frecuencia</label>
                      <input type="text" className="form-control" value={form.medFrecuencia} onChange={(e)=>setForm({ ...form, medFrecuencia: e.target.value })} onKeyDown={(e)=>{ if (e.key==='Enter'){ e.preventDefault(); addMedicamento(); } }} placeholder="1 cada 8h" />
                    </div>
                    <div className="col-12 col-md-1 d-grid">
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={addMedicamento}>Agregar</button>
                    </div>
                  </div>
                  {Array.isArray(form.medicamentosDet) && form.medicamentosDet.length > 0 && (
                    <ul className="list-group list-group-flush mt-2 small">
                      {form.medicamentosDet.map((m, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                          <span>{m.nombre} {m.dias?`• ${m.dias} días`:''} {m.frecuencia?`• ${m.frecuencia}`:''}</span>
                          <button type="button" className="btn btn-link btn-sm text-danger" onClick={()=>{
                            setForm(prev => ({
                              ...prev,
                              medicamentosDet: prev.medicamentosDet.filter((_, i)=>i!==idx)
                            }));
                          }}>Quitar</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Exámenes solicitados */}
                <div className="col-12 mt-3">
                  <label className="form-label">Solicitar exámenes</label>
                  <div className="row g-2 align-items-end">
                    <div className="col-12 col-md-10">
                      <input type="text" className="form-control" value={form.examenNombre} onChange={(e)=>setForm({ ...form, examenNombre: e.target.value })} placeholder="Hemograma, Radiografía de tórax, etc." />
                    </div>
                    <div className="col-12 col-md-2 d-grid">
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>{
                        const nombre = form.examenNombre?.trim();
                        if (!nombre) return;
                        setForm(prev => ({ ...prev, examenes: [...(prev.examenes||[]), nombre], examenNombre: '' }));
                      }}>Agregar</button>
                    </div>
                  </div>
                  {Array.isArray(form.examenes) && form.examenes.length > 0 && (
                    <ul className="list-group list-group-flush mt-2 small">
                      {form.examenes.map((ex, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                          <span>{ex}</span>
                          <button type="button" className="btn btn-link btn-sm text-danger" onClick={()=>{
                            setForm(prev => ({ ...prev, examenes: prev.examenes.filter((_, i)=>i!==idx) }));
                          }}>Quitar</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Licencia médica */}
                <div className="col-12 mt-3">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="licenciaSwitch" checked={!!form.licenciaOtorga} onChange={(e)=>setForm({ ...form, licenciaOtorga: e.target.checked })} />
                    <label className="form-check-label" htmlFor="licenciaSwitch">Otorgar licencia médica</label>
                  </div>
                  {form.licenciaOtorga && (
                    <div className="row g-2 mt-1">
                      <div className="col-12 col-md-3">
                        <label className="form-label">Días</label>
                        <input type="number" min="1" className="form-control" value={form.licenciaDias} onChange={(e)=>setForm({ ...form, licenciaDias: e.target.value })} placeholder="7" />
                      </div>
                      <div className="col-12 col-md-9">
                        <label className="form-label">Notas</label>
                        <input type="text" className="form-control" value={form.licenciaNota} onChange={(e)=>setForm({ ...form, licenciaNota: e.target.value })} placeholder="Motivo y recomendaciones" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </>);
}
