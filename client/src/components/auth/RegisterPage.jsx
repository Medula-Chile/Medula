import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

// Página de registro de usuarios
// Realiza validaciones básicas y redirige al login tras un registro exitoso (modo demo)
export default function RegisterPage() {
  // Estados locales y utilidad de navegación
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [accept, setAccept] = React.useState(false);

  // Manejador del formulario: valida campos y simula registro
  const onSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Ingresa tu nombre completo.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert('Por favor, ingresa un correo válido.');
    if (!password) return alert('Por favor, crea una contraseña.');
    if (password !== confirm) return alert('Las contraseñas no coinciden.');
    if (!accept) return alert('Debes aceptar Términos y Privacidad.');
    // Demo: redirigir a login tras registro
    alert('¡Registro exitoso!');
    navigate('/auth/login');
  };

  // Render del formulario de registro
  return (
    <div className="auth-root">
      <div className="auth-card" role="main" aria-labelledby="titulo-register">
        <div className="auth-logo" aria-hidden="true">
          <img src="/medula_icono.png" alt="Logo Médula" style={{ width: 120, height: 'auto' }} />
        </div>
        <h1 id="titulo-register" className="auth-app-name">MEDULA</h1>
        <p className="auth-tagline">Cuida, organiza y protege</p>

        <div>
          <h2 className="text-center h5 mb-3">Crear Cuenta</h2>
          <form onSubmit={onSubmit} noValidate>
            {/* Campo: nombre completo */}
            <label className="auth-label" htmlFor="inName">Nombre completo</label>
            <input id="inName" className="auth-input" type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Ingresa tu nombre completo" required />

            {/* Campo: email */}
            <label className="auth-label" htmlFor="inEmail">Email</label>
            <input id="inEmail" className="auth-input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Ingresa email" required />

            {/* Campo: contraseña */}
            <label className="auth-label" htmlFor="inPass">Contraseña</label>
            <input id="inPass" className="auth-input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Crea una contraseña segura" required />

            {/* Campo: confirmar contraseña */}
            <label className="auth-label" htmlFor="inConfirm">Confirmar contraseña</label>
            <input id="inConfirm" className="auth-input" type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Repite tu contraseña" required />

            {/* Aceptación de Términos y Política de Privacidad */}
            <div className="auth-checkbox">
              <input id="inAccept" type="checkbox" checked={accept} onChange={(e)=>setAccept(e.target.checked)} />
              <label htmlFor="inAccept" style={{ fontWeight: 'normal' }}>
                Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>
              </label>
            </div>

            {/* Acción principal: enviar formulario de registro */}
            <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>Registrarse</button>

            {/* Separador de opciones */}
            <div className="auth-divider"><span>o</span></div>

            {/* Alternativa de registro con ClaveÚnica (placeholder) */}
            <button type="button" className="btn btn-outline-secondary btn-sm" style={{ width: '100%' }}>Registrarse con ClaveÚnica</button>

            {/* Enlace para ir a la pantalla de inicio de sesión */}
            <div className="auth-link">¿Ya tienes una cuenta? <Link to="/auth/login">Inicia sesión</Link></div>
          </form>
        </div>
      </div>
    </div>
  );
}
