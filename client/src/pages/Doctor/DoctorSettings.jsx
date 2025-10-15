import React from 'react';

export default function DoctorSettings() {
  const [notifEmail, setNotifEmail] = React.useState(false);
  const [notifSMS, setNotifSMS] = React.useState(false);
  const [notifUrgent, setNotifUrgent] = React.useState(true);
  const [theme, setTheme] = React.useState('system');
  const [lang, setLang] = React.useState('es');

  // Cargar preferencias desde localStorage
  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('medula_doctor_config')) || {};
      if (typeof saved.notifEmail === 'boolean') setNotifEmail(saved.notifEmail);
      if (typeof saved.notifSMS === 'boolean') setNotifSMS(saved.notifSMS);
      if (typeof saved.notifUrgent === 'boolean') setNotifUrgent(saved.notifUrgent);
      if (typeof saved.theme === 'string') setTheme(saved.theme);
      if (typeof saved.lang === 'string') setLang(saved.lang);
    } catch {}
  }, []);

  // Guardar preferencias en localStorage
  React.useEffect(() => {
    const data = { notifEmail, notifSMS, notifUrgent, theme, lang };
    localStorage.setItem('medula_doctor_config', JSON.stringify(data));
  }, [notifEmail, notifSMS, notifUrgent, theme, lang]);

  const handleClearLocal = () => {
    if (confirm('¿Estás seguro de que deseas limpiar todos los datos locales? Esto eliminará tus preferencias.')) {
      localStorage.removeItem('medula_doctor_config');
      localStorage.removeItem('medula_doctor_profile');
      window.location.reload();
    }
  };

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">Configuración - Perfil Médico</h5>
          </div>
          <div className="card-body">
            <div className="row g-3 small">
              <div className="col-12 col-md-6">
                <h6 className="mb-2">Notificaciones Médicas</h6>
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="inNotifEmail" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} />
                  <label className="form-check-label" htmlFor="inNotifEmail">Notificaciones por Email</label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="inNotifSMS" checked={notifSMS} onChange={(e) => setNotifSMS(e.target.checked)} />
                  <label className="form-check-label" htmlFor="inNotifSMS">Notificaciones por SMS</label>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="inNotifUrgent" checked={notifUrgent} onChange={(e) => setNotifUrgent(e.target.checked)} />
                  <label className="form-check-label" htmlFor="inNotifUrgent">Alertas de casos urgentes</label>
                </div>
                <p className="text-muted-foreground mt-2 mb-0">Recibe notificaciones sobre nuevas consultas y actualizaciones.</p>
              </div>

              <div className="col-12 col-md-6">
                <h6 className="mb-2">Preferencias de Visualización</h6>
                <div className="mb-2">
                  <label className="form-label mb-1" htmlFor="inTheme">Tema de interfaz</label>
                  <select id="inTheme" className="form-select form-select-sm" value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="system">Del sistema</option>
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="medical">Modo médico (azul)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label mb-1" htmlFor="inLang">Idioma de la interfaz</label>
                  <select id="inLang" className="form-select form-select-sm" value={lang} onChange={(e) => setLang(e.target.value)}>
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <p className="text-muted-foreground mt-2 mb-0">Personaliza la apariencia del sistema.</p>
              </div>

              <div className="col-12"><hr className="my-2" /></div>

              <div className="col-12 col-md-6">
                <h6 className="mb-2">Gestión de Sesión</h6>
                <div className="d-flex gap-2 flex-wrap">
                  <button className="btn btn-outline-secondary btn-sm">Cerrar sesión (este dispositivo)</button>
                  <button className="btn btn-outline-danger btn-sm">Cerrar sesión en todos los dispositivos</button>
                </div>
                <p className="text-muted-foreground mt-2 mb-0">Si usas ClaveÚnica, el cierre global puede requerir revocar desde el proveedor.</p>
              </div>  

              <div className="col-12"><hr className="my-2" /></div>

              <div className="col-12">
                <h6 className="mb-2">Preferencias Clínicas</h6>
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <label className="form-label mb-1" htmlFor="inTimeFormat">Formato de hora</label>
                    <select id="inTimeFormat" className="form-select form-select-sm">
                      <option value="24">24 horas (17:30)</option>
                      <option value="12">12 horas (5:30 PM)</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label mb-1" htmlFor="inDefaultView">Vista predeterminada</label>
                    <select id="inDefaultView" className="form-select form-select-sm">
                      <option value="day">Vista diaria</option>
                      <option value="week">Vista semanal</option>
                      <option value="month">Vista mensual</option>
                      <option value="agenda">Lista de agenda</option>
                    </select>
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 mb-0">Configuración específica para tu flujo de trabajo médico.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}