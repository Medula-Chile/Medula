import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

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
  const [rut, setRut] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Manejador del formulario: valida campos y simula registro
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Ingresa tu nombre completo.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert('Por favor, ingresa un correo válido.');
    if (!password) return alert('Por favor, crea una contraseña.');
    if (password !== confirm) return alert('Las contraseñas no coinciden.');
    if (!accept) return alert('Debes aceptar Términos y Privacidad.');
    // Enviar datos al backend para crear el usuario
    try {
      setLoading(true);
      setError('');
      await api.post('/auth/register', {
        nombre: name,
        email,
        password,
        rut: rut
      });
      alert('¡Registro exitoso!');
      navigate('/auth/login');
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      setError(serverMsg || err.message);
      console.error('Error de registro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Render del formulario de registro
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card border shadow-sm p-4" role="main" aria-labelledby="titulo-register" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-3" aria-hidden="true">
          <img src="/medula_icono.png" alt="Logo Médula" className="img-fluid" style={{ width: 120 }} />
        </div>
        <h1 id="titulo-register" className="text-center mb-1 fw-bold text-primary">MEDULA</h1>
        <p className="text-center text-muted mb-4">Cuida, organiza y protege</p>

        <div>
          <h2 className="text-center h5 mb-3">Crear Cuenta</h2>
          <form onSubmit={onSubmit} noValidate>
            {/* Campo: nombre completo */}
            <label className="form-label" htmlFor="inName">Nombre completo</label>
            <input id="inName" className="form-control mb-2" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ingresa tu nombre completo" required />

            {/* Campo: rut */}
            <label className="form-label" htmlFor="inRut">Rut</label>
            <input id="inRut" className="form-control mb-2" type="text" value={rut} onChange={(e) => setRut(e.target.value)} placeholder="Ingresa tu rut" required />

            {/* Campo: email */}
            <label className="form-label" htmlFor="inEmail">Email</label>
            <input id="inEmail" className="form-control mb-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingresa email" required />

            {/* Campo: contraseña */}
            <label className="form-label" htmlFor="inPass">Contraseña</label>
            <input id="inPass" className="form-control mb-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Crea una contraseña segura" required />

            {/* Campo: confirmar contraseña */}
            <label className="form-label" htmlFor="inConfirm">Confirmar contraseña</label>
            <input id="inConfirm" className="form-control mb-2" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repite tu contraseña" required />

            {/* Aceptación de Términos y Política de Privacidad */}
            <div className="form-check mb-3">
              <input id="inAccept" className="form-check-input" type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
              <label className="form-check-label" htmlFor="inAccept">
                Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>
              </label>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            {/* Acción principal: enviar formulario de registro */}
            <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>
              {loading ? 'Registrando…' : 'Registrarse'}
            </button>

            {/* Separador de opciones */}
            <div className="text-center my-3">
              <span className="bg-light px-2">o</span>
            </div>

            {/* Alternativa de registro con ClaveÚnica (placeholder) */}
            <button type="button" className="btn btn-outline-secondary w-100 mb-2">Registrarse con ClaveÚnica</button>

            {/* Enlace para ir a la pantalla de inicio de sesión */}
            <div className="text-center">
              ¿Ya tienes una cuenta? <Link to="/auth/login" className="text-decoration-none">Inicia sesión</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
