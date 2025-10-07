import React, { useEffect, useMemo, useState } from 'react';
import ConsultationDetailDoctor from './components/ConsultationDetailDoctor';
import { useAuth } from '../../contexts/AuthContext';
import { subscribe, getAssignments, upsertAssignment, removeAssignment, seedIfEmpty } from './data/assignmentsStore';

export default function DoctorPacientes() {
  // Vista de administración: lista maestra de asignaciones (pasadas, presentes y futuras)
  const { user } = useAuth();
  const doctorName = (user?.fullName || user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ')).trim() || 'Médico/a';
  const doctorSpecialty = (user?.specialty || user?.especialidad || user?.profession || user?.titulo || 'Medicina General');

  const [items, setItems] = useState(() => getAssignments());
  const [activeId, setActiveId] = useState(items[0]?.id ?? null);

  // Seed inicial si está vacío (reutiliza data mock existente)
  useEffect(() => { seedIfEmpty({ doctorName, doctorSpecialty }); }, [doctorName, doctorSpecialty]);

  // Suscripción a store
  useEffect(() => {
    const unsub = subscribe((arr) => {
      setItems(arr);
      if (!arr.find(it => String(it.id) === String(activeId))) {
        setActiveId(arr[0]?.id ?? null);
      }
    });
    // Inicial
    setItems(getAssignments());
    return () => unsub();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtros
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filtered = useMemo(() => {
    const norm = (s) => (s || '').toString().toLowerCase();
    const qn = norm(q);
    const fromD = from ? new Date(from) : null;
    const toD = to ? new Date(to) : null;
    const inRange = (iso) => {
      if (!iso) return true;
      const d = new Date(iso);
      if (fromD && d < fromD) return false;
      if (toD) { const end = new Date(toD); end.setHours(23,59,59,999); if (d > end) return false; }
      return true;
    };
    const byDate = (a, b) => new Date(a.when || 0) - new Date(b.when || 0);
    return items
      .filter(it => !qn || norm(it.paciente).includes(qn) || norm(it.resumen).includes(qn) || norm(it.centro).includes(qn))
      .filter(it => !estado || it.estado === estado)
      .filter(it => inRange(it.when))
      .slice()
      .sort(byDate);
  }, [items, q, estado, from, to]);

  const active = useMemo(() => filtered.find(x => String(x.id) === String(activeId)) || items.find(x => String(x.id) === String(activeId)) || null, [filtered, items, activeId]);

  // Modal Add/Edit
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    paciente: '',
    especialidad: '',
    centro: '',
    resumen: '',
    estado: 'En espera',
    when: '',
  });

  const openNew = () => { setEditId(null); setForm({ paciente: '', especialidad: doctorSpecialty, centro: '', resumen: '', estado: 'En espera', when: '' }); setOpen(true); };
  const openEdit = (it) => { setEditId(it.id); setForm({ paciente: it.paciente||'', especialidad: it.especialidad||doctorSpecialty, centro: it.centro||'', resumen: it.resumen||'', estado: it.estado||'En espera', when: it.when ? it.when.substring(0,16) : '' }); setOpen(true); };
  const close = () => setOpen(false);

  const save = (e) => {
    e.preventDefault();
    const id = editId ?? Date.now();
    const d = form.when ? new Date(form.when) : new Date();
    const pad = (n) => String(n).padStart(2,'0');
    const fecha = `${d.toLocaleDateString(undefined,{ day:'2-digit', month:'short' })} • ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    upsertAssignment({
      id,
      paciente: form.paciente?.trim() || '—',
      medico: doctorName,
      especialidad: form.especialidad?.trim() || doctorSpecialty,
      centro: form.centro?.trim() || '—',
      resumen: form.resumen?.trim() || '—',
      estado: form.estado || 'En espera',
      when: d.toISOString(),
      fecha,
      observaciones: '—',
      proximoControl: '—',
      recetaId: null,
      vitals: { presion: null, temperatura: null, pulso: null },
      medicamentos: [],
      medicamentosDet: [],
      examenes: [],
      licencia: { otorga: false, dias: null, nota: '' },
    });
    setActiveId(id);
    setOpen(false);
  };

  const cancelItem = (id) => {
    const it = items.find(x => String(x.id) === String(id));
    if (!it) return;
    upsertAssignment({ ...it, estado: 'Cancelado' });
  };

  const removeItem = (id) => {
    if (!window.confirm('¿Eliminar esta asignación?')) return;
    removeAssignment(id);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Pacientes asignados</h4>
        <div className="d-flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={openNew}><i className="fas fa-plus me-2"/>Agregar</button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-md-4">
              <label className="form-label small">Buscar</label>
              <input className="form-control" placeholder="Paciente, centro o resumen" value={q} onChange={(e)=>setQ(e.target.value)} />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small">Estado</label>
              <select className="form-select" value={estado} onChange={(e)=>setEstado(e.target.value)}>
                <option value="">Todos</option>
                <option>En espera</option>
                <option>En progreso</option>
                <option>Completado</option>
                <option>Cancelado</option>
                <option>No presentado</option>
              </select>
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label small">Desde</label>
              <input type="date" className="form-control" value={from} onChange={(e)=>setFrom(e.target.value)} />
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label small">Hasta</label>
              <input type="date" className="form-control" value={to} onChange={(e)=>setTo(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6 col-xl-5">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Listado de asignaciones</h6>
            </div>
            <div className="card-body p-0">
              <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {filtered.map((it) => {
                  const isActive = String(activeId) === String(it.id);
                  return (
                    <div key={it.id} className={`consultation-item ${isActive?'active':''}`} onClick={()=>setActiveId(it.id)} role="button">
                      <div className="d-flex gap-3">
                        <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0"><i className="fas fa-user-injured text-primary"></i></div>
                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <div className="min-w-0">
                              <h6 className="fw-medium mb-0">{it.paciente || 'Paciente'}</h6>
                              <p className="text-muted-foreground small mb-0">{it.especialidad} • {it.centro}</p>
                            </div>
                            <div className="text-end">
                              <span className="badge bg-light text-dark border me-2">{it.estado}</span>
                              <span className="text-muted-foreground small fw-medium">{it.fecha}</span>
                            </div>
                          </div>
                          <p className="small line-clamp-2 mb-1">{it.resumen}</p>
                          <div className="d-flex gap-2">
                            <button className="btn btn-outline-secondary btn-xxs" onClick={(e)=>{ e.stopPropagation(); openEdit(it); }}><i className="fas fa-edit me-1"/>Editar</button>
                            <button className="btn btn-outline-warning btn-xxs" onClick={(e)=>{ e.stopPropagation(); cancelItem(it.id); }}><i className="fas fa-ban me-1"/>Cancelar</button>
                            <button className="btn btn-outline-danger btn-xxs" onClick={(e)=>{ e.stopPropagation(); removeItem(it.id); }}><i className="fas fa-trash me-1"/>Eliminar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="p-3 text-muted small">Sin resultados para los filtros aplicados.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6 col-xl-7">
          <ConsultationDetailDoctor consulta={active} />
        </div>
      </div>

      {/* Modal Add/Edit */}
      {open && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
          <div className="card shadow" style={{ maxWidth: 640, width: '95%' }} role="dialog" aria-modal="true">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{editId? 'Editar asignación' : 'Nueva asignación'}</h5>
              <button className="btn btn-sm btn-ghost" onClick={close} aria-label="Cerrar"><i className="fas fa-times"></i></button>
            </div>
            <div className="card-body">
              <form className="small" onSubmit={save}>
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Paciente</label>
                    <input className="form-control" value={form.paciente} onChange={(e)=>setForm({ ...form, paciente: e.target.value })} placeholder="Nombre del paciente" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Especialidad</label>
                    <input className="form-control" value={form.especialidad} onChange={(e)=>setForm({ ...form, especialidad: e.target.value })} placeholder="Medicina General" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Centro/Box</label>
                    <input className="form-control" value={form.centro} onChange={(e)=>setForm({ ...form, centro: e.target.value })} placeholder="Consulta 1" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Estado</label>
                    <select className="form-select" value={form.estado} onChange={(e)=>setForm({ ...form, estado: e.target.value })}>
                      <option>En espera</option>
                      <option>En progreso</option>
                      <option>Completado</option>
                      <option>Cancelado</option>
                      <option>No presentado</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Resumen</label>
                    <input className="form-control" value={form.resumen} onChange={(e)=>setForm({ ...form, resumen: e.target.value })} placeholder="Motivo/nota breve" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Fecha y hora</label>
                    <input type="datetime-local" className="form-control" value={form.when} onChange={(e)=>setForm({ ...form, when: e.target.value })} />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={close}>Cancelar</button>
                  <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
