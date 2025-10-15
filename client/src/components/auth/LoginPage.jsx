import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = React.useState('paciente');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [accept, setAccept] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert('Por favor, ingresa un correo válido.');
    if (!password) return alert('Por favor, ingresa tu contraseña.');
    if (!accept) return alert('Debes aceptar Términos y Privacidad.');

    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password, rol: role });
      localStorage.setItem('token', data.token);
      try { window.dispatchEvent(new Event('auth:login')); } catch {}

      if (role === 'medico') navigate('/doctor');
      else if (role === 'administrador') navigate('/admin');
      else navigate('/paciente/historial');
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      setError(serverMsg || err.message);
      console.error('Error de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root auth-bg-login">
      {/* Desktop: alinea a la derecha; móvil: centra */}
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center justify-content-lg-end py-5">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4 me-lg-5">
          <div className="card shadow-sm auth-card" role="main" aria-labelledby="titulo-login">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-3 auth-logo" aria-hidden="true">
                <img src="/MEDULABLACK2.png" alt="Logo Médula" style={{ width: 150, height: 'auto' }} />
              </div>
              
              <p className="text-center text-muted mb-4 auth-tagline">Cuida, organiza y protege</p>

              <form onSubmit={onSubmit} noValidate>
                <h2 className="text-center h5 mb-3">Inicio de Sesión</h2>

                {/* Selector de rol con Bootstrap */}
                <div className="d-flex justify-content-center mb-3" role="radiogroup" aria-label="Tipo de usuario">
                  <div className="btn-group" role="group" aria-label="Selector de rol">
                    <input
                      type="radio"
                      className="btn-check"
                      name="role"
                      id="rolePaciente"
                      autoComplete="off"
                      checked={role === 'paciente'}
                      onChange={() => setRole('paciente')}
                    />
                    <label className={`btn btn-outline-secondary btn-sm ${role === 'paciente' ? 'active' : ''}`} htmlFor="rolePaciente">
                      Soy paciente
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="role"
                      id="roleMedico"
                      autoComplete="off"
                      checked={role === 'medico'}
                      onChange={() => setRole('medico')}
                    />
                    <label className={`btn btn-outline-secondary btn-sm ${role === 'medico' ? 'active' : ''}`} htmlFor="roleMedico">
                      Soy médico
                    </label>
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label auth-label" htmlFor="inEmail">Correo electrónico</label>
                  <input
                    id="inEmail"
                    className="form-control auth-input"
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="ana@medula.cl"
                    required
                  />
                </div>

                {/* Contraseña */}
                <div className="mb-3">
                  <label className="form-label auth-label" htmlFor="inPass">Contraseña</label>
                  <input
                    id="inPass"
                    className="form-control auth-input"
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Aceptación */}
                <div className="form-check mb-3 auth-checkbox">
                  <input
                    id="inAccept"
                    className="form-check-input"
                    type="checkbox"
                    checked={accept}
                    onChange={(e)=>setAccept(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="inAccept" style={{ fontWeight: 'normal' }}>
                    Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>
                  </label>
                </div>

                {/* Acción principal */}
                <div className="d-grid gap-2 mb-2 auth-actions">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm py-2"
                    style={{ minWidth: 140 }}
                    disabled={loading}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {/* Enlace a registro */}
                <div className="text-center small auth-link mb-3">
                  ¿No tienes cuenta? <Link to="/auth/register">Regístrate aquí</Link>
                </div>

                {/* Separador */}
                <div className="position-relative text-center my-3 auth-divider">
                  <hr />
                  <span className="px-2 bg-white position-absolute top-50 start-50 translate-middle text-muted">o</span>
                </div>

                {/* ClaveÚnica */}
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => window.open('https://claveunica.gob.cl', '_blank')}
                  >
                    Ingresar con ClaveÚnica
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
