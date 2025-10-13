import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
// Página de inicio de sesión (Login)
// Maneja selección de rol, validación básica y redirección según el rol seleccionado.
export default function LoginPage() {
  // Estados locales y utilidades de navegación
  const navigate = useNavigate();
  const [role, setRole] = React.useState('paciente');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [accept, setAccept] = React.useState(true);

  // Estado para manejar errores y carga
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Manejador de envío del formulario: valida datos y autentica
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert('Por favor, ingresa un correo válido.');
    if (!password) return alert('Por favor, ingresa tu contraseña.');
    if (!accept) return alert('Debes aceptar Términos y Privacidad.');

    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', {
        email,
        password,
        rol: role
      });

      // Guardar el token
      localStorage.setItem('token', data.token);
      // Notificar al resto de la app que hubo login
      try { window.dispatchEvent(new Event('auth:login')); } catch {}

      // Redirigir según rol
      if (role === 'medico') {
        navigate('/doctor');
      } else if (role === 'administrador') {
        navigate('/admin');
      } else {
        navigate('/paciente/historial');
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      setError(serverMsg || err.message);
      console.error('Error de login:', err);
    } finally {
      setLoading(false);
    }
  };

  // Render de la vista de Login y su formulario
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card border shadow-sm p-4" role="main" aria-labelledby="titulo-login" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-3" aria-hidden="true">
          <img src="/medula_icono.png" alt="Logo Médula" className="img-fluid" style={{ width: 120 }} />
        </div>
        <h1 id="titulo-login" className="text-center mb-1 fw-bold text-primary">MEDULA</h1>
        <p className="text-center text-muted mb-4">Cuida, organiza y protege</p>

        <form onSubmit={onSubmit} noValidate>
          <h2 className="text-center h5 mb-3">Inicio de Sesión</h2>

          {/* Selector de rol (paciente / médico) */}
          <div className="btn-group w-100 mb-3" role="radiogroup" aria-label="Tipo de usuario">
            <button type="button" className={`btn btn-outline-primary ${role === 'paciente' ? 'active' : ''}`} aria-pressed={role === 'paciente'} onClick={() => setRole('paciente')}>Soy paciente</button>
            <button type="button" className={`btn btn-outline-primary ${role === 'medico' ? 'active' : ''}`} aria-pressed={role === 'medico'} onClick={() => setRole('medico')}>Soy médico</button>
          </div>

          {/* Campo de email */}
          <label className="form-label" htmlFor="inEmail">Email</label>
          <input id="inEmail" className="form-control mb-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingresa email" required />

          {/* Campo de contraseña */}
          <label className="form-label" htmlFor="inPass">Contraseña</label>
          <input id="inPass" className="form-control mb-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ingresa tu contraseña" required />

          {/* Aceptación de Términos y Política de Privacidad */}
          <div className="form-check mb-3">
            <input id="inAccept" className="form-check-input" type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
            <label className="form-check-label" htmlFor="inAccept">
              Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>
            </label>
          </div>

          {/* Acción principal: enviar formulario */}
          <button
            type="submit"
            className="btn btn-primary w-100 mb-2"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Enlace para ir a la página de registro */}
          <div className="text-center">
            ¿No tienes cuenta? <Link to="/auth/register" className="text-decoration-none">Regístrate aquí</Link>
          </div>

          {/* Separador de opciones */}
          <div className="text-center my-3">
            <span className="bg-light px-2">o</span>
          </div>

          {/* Alternativa de ingreso con ClaveÚnica (placeholder) */}
          <div className="text-center">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={() => window.open('https://claveunica.gob.cl', '_blank')}>Ingresar con ClaveÚnica</button>
          </div>
        </form>
      </div>
    </div>
  );
}
