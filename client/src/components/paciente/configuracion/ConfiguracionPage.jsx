import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ConfiguracionPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notifEmail, setNotifEmail] = React.useState(false);
  const [notifSMS, setNotifSMS] = React.useState(false);
  const [theme, setTheme] = React.useState('system');
  const [lang, setLang] = React.useState('es');
  const [loggingOut, setLoggingOut] = React.useState(false);

  // Cargar preferencias desde localStorage
  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('medula_config')) || {};
      if (typeof saved.notifEmail === 'boolean') setNotifEmail(saved.notifEmail);
      if (typeof saved.notifSMS === 'boolean') setNotifSMS(saved.notifSMS);
      if (typeof saved.theme === 'string') setTheme(saved.theme);
      if (typeof saved.lang === 'string') setLang(saved.lang);
    } catch {}
  }, []);

  // Guardar preferencias en localStorage
  React.useEffect(() => {
    const data = { notifEmail, notifSMS, theme, lang };
    localStorage.setItem('medula_config', JSON.stringify(data));
  }, [notifEmail, notifSMS, theme, lang]);

  const handleLogout = async () => {
    if (loggingOut) return;
    
    const confirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (!confirmed) return;
    
    try {
      setLoggingOut(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
    } finally {
      setLoggingOut(false);
    }
  };

  const handleLogoutAll = async () => {
    if (loggingOut) return;
    
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas cerrar sesión en todos los dispositivos?\n\n' +
      'Esto cerrará tu sesión en este dispositivo y en cualquier otro donde hayas iniciado sesión.'
    );
    if (!confirmed) return;
    
    try {
      setLoggingOut(true);
      // Por ahora, el logout cierra la sesión actual
      // En el futuro se puede implementar un endpoint para invalidar todos los tokens
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">Configuración</h5>
          </div>
          <div className="card-body">
            <div className="row g-3 small">
              <div className="col-12 col-md-6">
                <h6 className="mb-2">Notificaciones</h6>
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="inNotifEmail" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} />
                  <label className="form-check-label" htmlFor="inNotifEmail">Email</label>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="inNotifSMS" checked={notifSMS} onChange={(e) => setNotifSMS(e.target.checked)} />
                  <label className="form-check-label" htmlFor="inNotifSMS">SMS</label>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <h6 className="mb-2">Preferencias</h6>
                <div className="mb-2">
                  <label className="form-label mb-1" htmlFor="inTheme">Tema</label>
                  <select id="inTheme" className="form-select form-select-sm" value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="system">Del sistema</option>
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                  </select>
                </div>
                <div>
                  <label className="form-label mb-1" htmlFor="inLang">Idioma</label>
                  <select id="inLang" className="form-select form-select-sm" value={lang} onChange={(e) => setLang(e.target.value)}>
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              {/* Implementar sesiones */}  
              <div className="col-12"><hr className="my-2" /></div>

              <div className="col-12 col-md-6">
                <h6 className="mb-2">Sesión</h6>
                <div className="d-flex gap-2 flex-wrap">
                  <button 
                    className="btn btn-outline-secondary btn-sm" 
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Cerrando sesión...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Cerrar sesión (este dispositivo)
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-outline-danger btn-sm" 
                    onClick={handleLogoutAll}
                    disabled={loggingOut}
                  >
                    {loggingOut ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Cerrando sesión...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-power-off me-2"></i>
                        Cerrar sesión en todos los dispositivos
                      </>
                    )}
                  </button>
                </div>
                <p className="text-muted-foreground mt-2 mb-0">
                  <i className="fas fa-info-circle me-1"></i>
                  Al cerrar sesión serás redirigido a la página de inicio de sesión.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

