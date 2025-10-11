import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { listSpecialties } from '../../services/specialties';
import { listCenters } from '../../services/centers';
import { createDoctor } from '../../services/doctors';

export default function DoctorProfile() {
  const { user } = useAuth();
  const [datos, setDatos] = React.useState({
    nombre: 'Dr. Carlos Rodríguez Méndez',
    run: '12.345.678-9',
    nacimiento: '01 Ene 1985',
    especialidad: 'Cardiología',
    subespecialidad: 'Cardiología Intervencional',
    telefono: '+56 9 1234 5678',
    email: 'carlos.rodriguez@clinica.com',
    direccion: 'Av. Médica 456, Comuna, Ciudad',
    añosExperiencia: '15',
    universidad: 'Universidad de Chile',
    tituloProfesional: 'Médico Cirujano',
    institucionFormacion: 'Universidad de Chile',
    disponibilidadHoraria: 'L-V 09:00-17:00',
    centroId: '',
    contactoDirecto: '+56 9 1234 5678',
    activo: true,
  });

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    nombre: '', run: '', nacimiento: '', especialidad: '', subespecialidad: '',
    telefono: '', email: '', direccion: '', añosExperiencia: '', universidad: '',
    tituloProfesional: '', institucionFormacion: '',
    disponibilidadHoraria: '', centroId: '', contactoDirecto: '', activo: true,
  });
  const [errors, setErrors] = React.useState({});
  const [especialidades, setEspecialidades] = React.useState([]);
  const [centros, setCentros] = React.useState([]);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('medula_doctor_profile'));
      if (saved && typeof saved === 'object') setDatos((d) => ({ ...d, ...saved }));
    } catch {}
  }, []);

  React.useEffect(() => {
    localStorage.setItem('medula_doctor_profile', JSON.stringify(datos));
  }, [datos]);

  // Cargar catálogos (especialidades, centros)
  React.useEffect(() => {
    (async () => {
      try {
        const [esp, ctr] = await Promise.all([
          listSpecialties(),
          listCenters({ limite: 100 })
        ]);
        setEspecialidades(Array.isArray(esp) ? esp : []);
        // centros puede venir como {centros: []} o array
        setCentros(Array.isArray(ctr) ? ctr : (ctr?.centros || []));
      } catch (e) {
        console.error('Error cargando catálogos', e);
      }
    })();
  }, []);

  const openModal = () => { setForm(datos); setErrors({}); setOpen(true); };
  const closeModal = () => setOpen(false);
  const vEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const vPhoneCl = (s) => /^\+56\s?9\s?\d{4}\s?\d{4}$/.test(s);
  const validate = () => {
    const e = {};
    if (!vEmail(form.email)) e.email = 'Correo inválido.';
    if (!vPhoneCl(form.telefono)) e.telefono = 'Formato +56 9 XXXX XXXX';
    if (!form.direccion || form.direccion.trim().length < 8) e.direccion = 'Mínimo 8 caracteres.';
    if (!form.especialidad) e.especialidad = 'Especialidad requerida';
    if (!form.tituloProfesional) e.tituloProfesional = 'Título profesional requerido';
    if (!form.institucionFormacion) e.institucionFormacion = 'Institución de formación requerida';
    const n = Number(form.añosExperiencia);
    if (Number.isNaN(n) || n < 0 || n > 60) e.añosExperiencia = 'Debe estar entre 0 y 60';
    if (!form.disponibilidadHoraria) e.disponibilidadHoraria = 'Disponibilidad requerida';
    if (!form.centroId) e.centroId = 'Centro requerido';
    if (!form.contactoDirecto || !vPhoneCl(form.contactoDirecto)) e.contactoDirecto = 'Contacto directo inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const toMedicoPayload = (vm, usuarioId) => ({
    usuario_id: usuarioId,
    especialidad: vm.especialidad,
    centro_id: vm.centroId,
    titulo_profesional: vm.tituloProfesional,
    institucion_formacion: vm.institucionFormacion,
    años_experiencia: Number(vm.añosExperiencia ?? 0),
    disponibilidad_horaria: vm.disponibilidadHoraria,
    contacto_directo: vm.contactoDirecto,
    activo: Boolean(vm.activo),
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!user?._id) {
      alert('No hay usuario autenticado. Inicia sesión.');
      return;
    }
    const payload = toMedicoPayload(form, user._id);
    try {
      setSaving(true);
      const resp = await createDoctor(payload);
      // Actualizamos el estado local visual y cerramos modal
      setDatos(form);
      alert(resp?.message || 'Médico guardado');
      setOpen(false);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error al guardar médico';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // especialidades cargadas desde API (listSpecialties)

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Perfil Médico</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={openModal}>
              <i className="fas fa-pen me-1"></i> Editar
            </button>
          </div>
          <div className="card-body">
            <div className="row small g-3">
              <div className="col-12 col-md-6">
                <p className="text-muted-foreground mb-0">Nombre</p>
                <p className="fw-medium mb-0">{datos.nombre}</p>
              </div>
              <div className="col-6 col-md-3">
                <p className="text-muted-foreground mb-0">RUN</p>
                <p className="fw-medium mb-0">{datos.run}</p>
              </div>
              <div className="col-6 col-md-3">
                <p className="text-muted-foreground mb-0">Nacimiento</p>
                <p className="fw-medium mb-0">{datos.nacimiento}</p>
              </div>

              <div className="col-6 col-md-4">
                <p className="text-muted-foreground mb-0">Especialidad</p>
                <p className="fw-medium mb-0">{datos.especialidad}</p>
              </div>
              <div className="col-6 col-md-4">
                <p className="text-muted-foreground mb-0">Subespecialidad</p>
                <p className="fw-medium mb-0">{datos.subespecialidad || 'No especificada'}</p>
              </div>
              <div className="col-6 col-md-4">
                <p className="text-muted-foreground mb-0">Años de Experiencia</p>
                <p className="fw-medium mb-0">{datos.añosExperiencia} años</p>
              </div>

              <div className="col-6 col-md-4">
                <p className="text-muted-foreground mb-0">Teléfono</p>
                <p className="fw-medium mb-0">{datos.telefono}</p>
              </div>
              <div className="col-6 col-md-4">
                <p className="text-muted-foreground mb-0">Email</p>
                <p className="fw-medium mb-0">{datos.email}</p>
              </div>
              <div className="col-6 col-md-4">
                <p className="text-muted-foreground mb-0">Dirección</p>
                <p className="fw-medium mb-0">{datos.direccion}</p>
              </div>

              <div className="col-12">
                <p className="text-muted-foreground mb-0">Universidad</p>
                <p className="fw-medium mb-0">{datos.universidad}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
          <div className="card shadow" style={{ maxWidth: 720, width: '95%' }} role="dialog" aria-modal="true">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Editar perfil médico</h5>
              <button className="btn btn-sm btn-ghost" onClick={closeModal} aria-label="Cerrar"><i className="fas fa-times"></i></button>
            </div>
            <div className="card-body">
              <form className="small" onSubmit={handleSave}>
                <div className="row g-2 g-md-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Especialidad Principal</label>
                    <select className={`form-select ${errors.especialidad ? 'is-invalid' : ''}`} value={form.especialidad} onChange={(e)=>setForm({ ...form, especialidad: e.target.value })}>
                      <option value="">Seleccionar especialidad</option>
                      {especialidades.map(o => (
                        <option key={o._id || o.nombre} value={o.nombre || o}>
                          {o.nombre || o}
                        </option>
                      ))}
                    </select>
                    {errors.especialidad && <div className="invalid-feedback">{errors.especialidad}</div>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Subespecialidad</label>
                    <input type="text" className="form-control" value={form.subespecialidad} onChange={(e)=>setForm({ ...form, subespecialidad: e.target.value })} placeholder="Ej: Cardiología Intervencional" />
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label className="form-label">Título Profesional</label>
                    <input type="text" className={`form-control ${errors.tituloProfesional ? 'is-invalid' : ''}`} value={form.tituloProfesional} onChange={(e)=>setForm({ ...form, tituloProfesional: e.target.value })} placeholder="Médico Cirujano" />
                    {errors.tituloProfesional && <div className="invalid-feedback">{errors.tituloProfesional}</div>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Años de Experiencia</label>
                    <input type="number" className={`form-control ${errors.añosExperiencia ? 'is-invalid' : ''}`} value={form.añosExperiencia} onChange={(e)=>setForm({ ...form, añosExperiencia: e.target.value })} placeholder="15" min="0" max="60" />
                    {errors.añosExperiencia && <div className="invalid-feedback">{errors.añosExperiencia}</div>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input type="tel" className={`form-control ${errors.telefono ? 'is-invalid' : ''}`} value={form.telefono} onChange={(e)=>setForm({ ...form, telefono: e.target.value })} placeholder="+56 9 1234 5678" />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} placeholder="doctor@clinica.com" />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Institución de formación</label>
                    <input type="text" className={`form-control ${errors.institucionFormacion ? 'is-invalid' : ''}`} value={form.institucionFormacion} onChange={(e)=>setForm({ ...form, institucionFormacion: e.target.value })} placeholder="Universidad de Chile" />
                    {errors.institucionFormacion && <div className="invalid-feedback">{errors.institucionFormacion}</div>}
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label">Dirección</label>
                    <input type="text" className={`form-control ${errors.direccion ? 'is-invalid' : ''}`} value={form.direccion} onChange={(e)=>setForm({ ...form, direccion: e.target.value })} placeholder="Av. Médica 456, Comuna, Ciudad" />
                    {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Centro de Salud</label>
                    <select className={`form-select ${errors.centroId ? 'is-invalid' : ''}`} value={form.centroId} onChange={(e)=>setForm({ ...form, centroId: e.target.value })}>
                      <option value="">Seleccionar centro</option>
                      {centros.map(c => (
                        <option key={c._id} value={c._id}>{c.nombre}</option>
                      ))}
                    </select>
                    {errors.centroId && <div className="invalid-feedback">{errors.centroId}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Disponibilidad Horaria</label>
                    <input type="text" className={`form-control ${errors.disponibilidadHoraria ? 'is-invalid' : ''}`} value={form.disponibilidadHoraria} onChange={(e)=>setForm({ ...form, disponibilidadHoraria: e.target.value })} placeholder="L-V 09:00-17:00" />
                    {errors.disponibilidadHoraria && <div className="invalid-feedback">{errors.disponibilidadHoraria}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Contacto directo</label>
                    <input type="tel" className={`form-control ${errors.contactoDirecto ? 'is-invalid' : ''}`} value={form.contactoDirecto} onChange={(e)=>setForm({ ...form, contactoDirecto: e.target.value })} placeholder="+56 9 1234 5678" />
                    {errors.contactoDirecto && <div className="invalid-feedback">{errors.contactoDirecto}</div>}
                  </div>

                  <div className="col-12 col-md-6 d-flex align-items-end">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="activoSwitch" checked={form.activo} onChange={(e)=>setForm({ ...form, activo: e.target.checked })} />
                      <label className="form-check-label" htmlFor="activoSwitch">Activo</label>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeModal}>Cancelar</button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}