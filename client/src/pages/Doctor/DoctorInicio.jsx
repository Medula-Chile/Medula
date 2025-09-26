import React, { useState } from 'react';
import Timeline from '../../components/paciente/historial/Timeline';
import ConsultationDetail from '../../components/paciente/historial/ConsultationDetail';

export default function DoctorInicio() {
  // Página inicial (dashboard) del Portal del Médico.
  // Presenta un resumen con métricas, agenda próxima y notificaciones.
  // Además, sección de trabajo con Timeline y detalle para iniciar atención.
  const [items, setItems] = useState([
    { id: 101, especialidad: 'Medicina General', medico: 'Dr. Juan Pérez', fecha: 'Hoy • 10:00', centro: 'Consulta 1', resumen: 'Juan Pérez, control general.', observaciones: '—', estado: 'En espera', proximoControl: '—', medicamentos: [], vitals: { presion: null, temperatura: null, pulso: null }, recetaId: null },
    { id: 102, especialidad: 'Resultados', medico: 'Dr. Ricardo Soto', fecha: 'Hoy • 10:30', centro: 'Consulta 2', resumen: 'Pedro Díaz, revisión de resultados.', observaciones: '—', estado: 'En espera', proximoControl: '—', medicamentos: [], vitals: { presion: null, temperatura: null, pulso: null }, recetaId: null },
    { id: 103, especialidad: 'Ginecología', medico: 'Dra. Ana Silva', fecha: 'Hoy • 11:00', centro: 'Consulta 3', resumen: 'Control post-tratamiento.', observaciones: '—', estado: 'En espera', proximoControl: '—', medicamentos: [], vitals: { presion: null, temperatura: null, pulso: null }, recetaId: null },
    { id: 104, especialidad: 'Cardiología', medico: 'Dra. Paula Contreras', fecha: 'Hoy • 11:30', centro: 'Consulta 4', resumen: 'Chequeo de hipertensión.', observaciones: '—', estado: 'En espera', proximoControl: '—', medicamentos: [], vitals: { presion: null, temperatura: null, pulso: null }, recetaId: null },
    { id: 105, especialidad: 'Endocrinología', medico: 'Dr. Marcelo Rivas', fecha: 'Hoy • 12:00', centro: 'Consulta 5', resumen: 'Ajuste terapéutico.', observaciones: '—', estado: 'En espera', proximoControl: '—', medicamentos: [], vitals: { presion: null, temperatura: null, pulso: null }, recetaId: null },
    { id: 106, especialidad: 'Hematología', medico: 'Dr. Ricardo Soto', fecha: 'Hoy • 12:30', centro: 'Consulta 6', resumen: 'Control anemia ferropénica.', observaciones: '—', estado: 'En espera', proximoControl: '—', medicamentos: [], vitals: { presion: null, temperatura: null, pulso: null }, recetaId: null },
    { id: 107, especialidad: 'Oftalmología', medico: 'Dr. Roberto Sánchez', fecha: 'Hoy • 13:00', centro: 'Consulta 7', resumen: 'Evaluación de agudeza visual.', observaciones: '—', estado: 'En espera', proximoControl: '—', medicamentos: [], vitals: { presion: null, temperatura: null, pulso: null }, recetaId: null },
  ]);
  const [activeId, setActiveId] = useState(101);
  const consulta = items.find(x => x.id === activeId);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ observaciones: '', presion: '', temperatura: '', pulso: '', proximoControl: '', recetaId: '', medicamentos: '' });
  const [errors, setErrors] = useState({});

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
      });
      setErrors({});
    }
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const validate = () => { const e = {}; setErrors(e); return true; };
  const handleSave = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setItems(prev => prev.map(it => it.id !== activeId ? it : ({
      ...it,
      observaciones: form.observaciones?.trim() || '—',
      proximoControl: form.proximoControl?.trim() || '—',
      recetaId: form.recetaId?.trim() || null,
      vitals: { presion: form.presion?.trim() || null, temperatura: form.temperatura?.trim() || null, pulso: form.pulso?.trim() || null },
      medicamentos: form.medicamentos ? form.medicamentos.split(/\r?\n/).map(s => s.trim()).filter(Boolean) : [],
      estado: 'En progreso',
    })));
    setOpen(false);
  };

  return (<>
    <div className="container-fluid">
      <div className="row g-3">
        {/* Nueva disposición: Timeline (izq), Detalle (centro) y Sidebar (der) */}
        <div className="col-12 col-lg-5 col-xl-4">
          <Timeline items={items} activeId={activeId} onSelect={setActiveId} />
        </div>
        <div className="col-12 col-lg-7 col-xl-5">
          <div className="d-flex justify-content-end mb-2">
            <button className="btn btn-primary btn-sm" onClick={openModal} disabled={!consulta}>
              <i className="fas fa-stethoscope me-1" /> Iniciar atención
            </button>
          </div>
          <ConsultationDetail consulta={consulta} />
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
                <div className="col-12">
                  <div className="p-3 border rounded bg-gray-100 d-flex align-items-center gap-3">
                    <i className="fas fa-file-prescription text-warning fa-lg" />
                    <div>
                      <p className="mb-0 small text-muted">Recetas pendientes</p>
                      <p className="mb-0 fw-semibold">3</p>
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
                <li className="py-2 d-flex align-items-center gap-2">
                  <i className="fas fa-bell text-warning" /> Tienes 3 recetas por firmar.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sección anterior (dashboard) se mantiene abajo por ahora */}
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Panel del Médico</h5>
              <span className="custom-badge border-success text-success">Beta</span>
            </div>
            <div className="card-body">
              {/* Descripción breve del panel */}
              <p className="text-muted-foreground mb-3">
                Bienvenido/a al panel del profesional. Aquí podrás gestionar tu agenda, pacientes y recetas.
              </p>
              {/* Tarjetas de métricas */}
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <div className="p-3 border rounded bg-gray-100 d-flex align-items-center gap-3">
                    <i className="fas fa-calendar-check text-primary fa-lg" />
                    <div>
                      <p className="mb-0 small text-muted">Citas de hoy</p>
                      <p className="mb-0 fw-semibold">5</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="p-3 border rounded bg-gray-100 d-flex align-items-center gap-3">
                    <i className="fas fa-user-md text-success fa-lg" />
                    <div>
                      <p className="mb-0 small text-muted">Pacientes en sala</p>
                      <p className="mb-0 fw-semibold">2</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="p-3 border rounded bg-gray-100 d-flex align-items-center gap-3">
                    <i className="fas fa-file-prescription text-warning fa-lg" />
                    <div>
                      <p className="mb-0 small text-muted">Recetas pendientes</p>
                      <p className="mb-0 fw-semibold">3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agenda próxima */}
        <div className="col-12 col-lg-6">
          <div className="card">
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
        </div>

        {/* Notificaciones */}
        <div className="col-12 col-lg-6">
          <div className="card">
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
                <li className="py-2 d-flex align-items-center gap-2">
                  <i className="fas fa-bell text-warning" /> Tienes 3 recetas por firmar.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de trabajo: Timeline y Detalle para iniciar atención */}
      <div className="col-12">
        <div className="row g-3">
          <div className="col-12 col-xl-5">
            <Timeline items={items} activeId={activeId} onSelect={setActiveId} />
          </div>
          <div className="col-12 col-xl-7">
            <div className="d-flex justify-content-end mb-2">
              <button className="btn btn-primary btn-sm" onClick={openModal} disabled={!consulta}>
                <i className="fas fa-stethoscope me-1" /> Iniciar atención
              </button>
            </div>
            <ConsultationDetail consulta={consulta} />
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
                <div className="col-12">
                  <label className="form-label">Medicamentos (uno por línea)</label>
                  <textarea className="form-control" rows={3} value={form.medicamentos} onChange={(e)=>setForm({ ...form, medicamentos: e.target.value })} placeholder="Paracetamol 500mg • 1 cada 8h x 3 días
Ibuprofeno 200mg • 1 cada 12h x 5 días" />
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
