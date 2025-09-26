import React from 'react';

export default function DoctorProfile() {
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
  });

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    nombre: '', run: '', nacimiento: '', especialidad: '', subespecialidad: '', 
    telefono: '', email: '', direccion: '', añosExperiencia: '', universidad: ''
  });
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('medula_doctor_profile'));
      if (saved && typeof saved === 'object') setDatos((d) => ({ ...d, ...saved }));
    } catch {}
  }, []);

  React.useEffect(() => {
    localStorage.setItem('medula_doctor_profile', JSON.stringify(datos));
  }, [datos]);

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
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSave = (e) => { e.preventDefault(); if (!validate()) return; setDatos(form); setOpen(false); };

  const especialidades = [
    'Cardiología', 'Dermatología', 'Endocrinología', 'Gastroenterología', 'Geriatría',
    'Ginecología', 'Hematología', 'Infectología', 'Medicina Interna', 'Nefrología',
    'Neurología', 'Oncología', 'Pediatría', 'Neumología', 'Reumatología',
    'Traumatología', 'Urología', 'Oftalmología', 'Otorrinolaringología', 'Psiquiatría'
  ];

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
                      {especialidades.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors.especialidad && <div className="invalid-feedback">{errors.especialidad}</div>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Subespecialidad</label>
                    <input type="text" className="form-control" value={form.subespecialidad} onChange={(e)=>setForm({ ...form, subespecialidad: e.target.value })} placeholder="Ej: Cardiología Intervencional" />
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label className="form-label">Años de Experiencia</label>
                    <input type="number" className="form-control" value={form.añosExperiencia} onChange={(e)=>setForm({ ...form, añosExperiencia: e.target.value })} placeholder="15" min="0" max="60" />
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
                    <label className="form-label">Universidad</label>
                    <input type="text" className="form-control" value={form.universidad} onChange={(e)=>setForm({ ...form, universidad: e.target.value })} placeholder="Universidad de Chile" />
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label">Dirección</label>
                    <input type="text" className={`form-control ${errors.direccion ? 'is-invalid' : ''}`} value={form.direccion} onChange={(e)=>setForm({ ...form, direccion: e.target.value })} placeholder="Av. Médica 456, Comuna, Ciudad" />
                    {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
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
    </div>
  );
}