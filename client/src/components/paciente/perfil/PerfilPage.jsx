import React from 'react';

export default function PerfilPage() {
  // Página de perfil del paciente.
  // Muestra un resumen de datos y permite editar campos de contacto en un modal.
  const [datos, setDatos] = React.useState({
    nombre: 'María Elena Contreras',
    run: '12.345.678-9',
    nacimiento: '01 Ene 1990',
    fonasa: 'FONASA B',
    sangre: 'O+',
    telefono: '+56 9 1234 5678',
    email: 'maria@example.com',
    direccion: 'Calle 123, Comuna, Ciudad',
    emergNombre: 'Juan Contreras',
    emergRelacion: 'Padre',
    emergTelefono: '+56 9 9876 5432',
  });

  // Control del modal de edición y del formulario local (con errores de validación)
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    nombre: '', run: '', nacimiento: '', fonasa: '', sangre: '', telefono: '', email: '', direccion: '', emergNombre: '', emergRelacion: '', emergTelefono: ''
  });
  const [errors, setErrors] = React.useState({});

  // Carga inicial desde localStorage para persistir datos entre sesiones (demo)
  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('medula_profile'));
      if (saved && typeof saved === 'object') setDatos((d) => ({ ...d, ...saved }));
    } catch {}
  }, []);

  // Guarda automáticamente en localStorage cuando cambian los datos guardados
  React.useEffect(() => {
    localStorage.setItem('medula_profile', JSON.stringify(datos));
  }, [datos]);

  // Helpers para abrir/cerrar modal y setear campos del formulario
  const openModal = () => { setForm(datos); setErrors({}); setOpen(true); };
  const closeModal = () => setOpen(false);
  const setF = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  // Validadores simples
  const vEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const vPhoneCl = (s) => /^\+56\s?9\s?\d{4}\s?\d{4}$/.test(s);
  const validate = () => {
    const e = {};
    if (!vEmail(form.email)) e.email = 'Correo inválido.';
    if (!vPhoneCl(form.telefono)) e.telefono = 'Formato +56 9 XXXX XXXX';
    if (!form.direccion || form.direccion.trim().length < 8) e.direccion = 'Mínimo 8 caracteres.';
    if (form.emergTelefono && !vPhoneCl(form.emergTelefono)) e.emergTelefono = 'Formato +56 9 XXXX XXXX';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  // Guarda cambios del modal si la validación es correcta
  const handleSave = (e) => { e.preventDefault(); if (!validate()) return; setDatos(form); setOpen(false); };

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Resumen de Perfil</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={openModal}>
              <i className="fas fa-pen me-1"></i> Editar
            </button>
          </div>
          <div className="card-body">
            <div className="row small g-3">
              {/* Datos generales */}
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

              <div className="col-6 col-md-3">
                <p className="text-muted-foreground mb-0">FONASA</p>
                <p className="fw-medium mb-0">{datos.fonasa}</p>
              </div>
              <div className="col-6 col-md-3">
                <p className="text-muted-foreground mb-0">Grupo sanguíneo</p>
                <p className="fw-medium mb-0">{datos.sangre}</p>
              </div>
              <div className="col-6 col-md-3">
                <p className="text-muted-foreground mb-0">Teléfono</p>
                <p className="fw-medium mb-0">{datos.telefono}</p>
              </div>
              <div className="col-6 col-md-3">
                <p className="text-muted-foreground mb-0">Email</p>
                <p className="fw-medium mb-0">{datos.email}</p>
              </div>
              <div className="col-12 col-md-6">
                <p className="text-muted-foreground mb-0">Dirección</p>
                <p className="fw-medium mb-0">{datos.direccion}</p>
              </div>

              {/* Contacto de emergencia */}
              <div className="col-12">
                <hr className="my-2" />
                <h6 className="mb-2">Contacto de emergencia</h6>
              </div>
              <div className="col-12 col-md-4">
                <p className="text-muted-foreground mb-0">Nombre</p>
                <p className="fw-medium mb-0">{datos.emergNombre}</p>
              </div>
              <div className="col-6 col-md-4">
                <p className="text-muted-foreground mb-0">Relación</p>
                <p className="fw-medium mb-0">{datos.emergRelacion}</p>
              </div>
              <div className="col-6 col-md-4">
                <p className="text-muted-foreground mb-0">Teléfono</p>
                <p className="fw-medium mb-0">{datos.emergTelefono}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición de datos */}
      {open && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
          <div className="card shadow" style={{ maxWidth: 720, width: '95%' }} role="dialog" aria-modal="true">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Editar datos de contacto</h5>
              <button className="btn btn-sm btn-ghost" onClick={closeModal} aria-label="Cerrar"><i className="fas fa-times"></i></button>
            </div>
            <div className="card-body">
              <form className="small" onSubmit={handleSave}>
                <div className="row g-2 g-md-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">FONASA</label>
                    <select className="form-select" value={form.fonasa} onChange={(e)=>setForm({ ...form, fonasa: e.target.value })}>
                      {['FONASA A','FONASA B','FONASA C','FONASA D'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Grupo sanguíneo</label>
                    <select className="form-select" value={form.sangre} onChange={(e)=>setForm({ ...form, sangre: e.target.value })}>
                      {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input type="tel" className={`form-control ${errors.telefono ? 'is-invalid' : ''}`} value={form.telefono} onChange={(e)=>setForm({ ...form, telefono: e.target.value })} placeholder="+56 9 1234 5678" />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} placeholder="nombre@correo.com" />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Dirección</label>
                    <input type="text" className={`form-control ${errors.direccion ? 'is-invalid' : ''}`} value={form.direccion} onChange={(e)=>setForm({ ...form, direccion: e.target.value })} placeholder="Calle 123, Comuna, Ciudad" />
                    {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
                  </div>
                  <div className="col-12">
                    <hr className="my-2" />
                    <h6 className="mb-2">Contacto de emergencia</h6>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" value={form.emergNombre} onChange={(e)=>setForm({ ...form, emergNombre: e.target.value })} placeholder="Nombre y Apellido" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Relación</label>
                    <input type="text" className="form-control" value={form.emergRelacion} onChange={(e)=>setForm({ ...form, emergRelacion: e.target.value })} placeholder="Familiar/Amigo" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Teléfono</label>
                    <input type="tel" className={`form-control ${errors.emergTelefono ? 'is-invalid' : ''}`} value={form.emergTelefono || ''} onChange={(e)=>setForm({ ...form, emergTelefono: e.target.value })} placeholder="+56 9 9876 5432" />
                    {errors.emergTelefono && <div className="invalid-feedback">{errors.emergTelefono}</div>}
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

