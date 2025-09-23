import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
// Página de inicio de sesión (Login)
// Maneja selección de rol, validación básica y redirección según el rol seleccionado.
export default function LoginPage() {
  // Estados locales y utilidades de navegación
  const navigate = useNavigate();
  const [role, setRole] = React.useState('paciente');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [accept, setAccept] = React.useState(true);

  // Manejador de envío del formulario: valida datos y redirige según rol
  const onSubmit = (e) => {
    e.preventDefault();
    // Validación simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert('Por favor, ingresa un correo válido.');
    if (!password) return alert('Por favor, ingresa tu contraseña.');
    if (!accept) return alert('Debes aceptar Términos y Privacidad.');
    // Redirigir según rol
    if (role === 'medico') {
      navigate('/doctor');
    } else {
      navigate('/paciente/historial');
    }
  };

  // Render de la vista de Login y su formulario
  return (
    <div className="auth-root">
      <div className="auth-card" role="main" aria-labelledby="titulo-login">
        <div className="auth-logo" aria-hidden="true">
          <img src="/medula_icono.png" alt="Logo Médula" style={{ width: 120, height: 'auto' }} />
        </div>
        <h1 id="titulo-login" className="auth-app-name">MEDULA</h1>
        <p className="auth-tagline">Cuida, organiza y protege</p>

        <form onSubmit={onSubmit} noValidate>
          <h2 className="text-center h5 mb-3">Inicio de Sesión</h2>

          {/* Selector de rol (paciente / médico) */}
          <div className="auth-toggle" role="radiogroup" aria-label="Tipo de usuario">
            <button type="button" className={`btn btn-outline-secondary btn-sm ${role==='paciente' ? 'btn-active' : ''}`} aria-pressed={role==='paciente'} onClick={()=>setRole('paciente')}>Soy paciente</button>
            <button type="button" className={`btn btn-outline-secondary btn-sm ${role==='medico' ? 'btn-active' : ''}`} aria-pressed={role==='medico'} onClick={()=>setRole('medico')}>Soy médico</button>
          </div>

          {/* Campo de email */}
          <label className="auth-label" htmlFor="inEmail">Email</label>
          <input id="inEmail" className="auth-input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Ingresa email" required />

          {/* Campo de contraseña */}
          <label className="auth-label" htmlFor="inPass">Contraseña</label>
          <input id="inPass" className="auth-input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Ingresa tu contraseña" required />

          {/* Aceptación de Términos y Política de Privacidad */}
          <div className="auth-checkbox">
            <input id="inAccept" type="checkbox" checked={accept} onChange={(e)=>setAccept(e.target.checked)} />
            <label htmlFor="inAccept" style={{ fontWeight: 'normal' }}>
              Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>
            </label>
          </div>

          {/* Acción principal: enviar formulario */}
          <div className="auth-actions mb-2">
            <button type="submit" className="btn btn-primary btn-sm" style={{ minWidth: 140 }}>Iniciar Sesión</button>
          </div>

          {/* Enlace para ir a la página de registro */}
          <div className="auth-link">
            ¿No tienes cuenta? <Link to="/auth/register">Regístrate aquí</Link>
          </div>

          {/* Separador de opciones */}
          <div className="auth-divider"><span>o</span></div>

          {/* Alternativa de ingreso con ClaveÚnica (placeholder) */}
          <div className="text-center">
            <button type="button" className="btn btn-outline-secondary btn-sm">Ingresar con ClaveÚnica</button>
          </div>
        </form>
      </div>
    </div>
  );
}
