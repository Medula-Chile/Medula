import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

// Página de registro de usuarios (con fondo responsivo tipo login)
export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [accept, setAccept] = React.useState(false);
  const [rut, setRut] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Ingresa tu nombre completo.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert('Por favor, ingresa un correo válido.');
    if (!password) return alert('Por favor, crea una contraseña.');
    if (password !== confirm) return alert('Las contraseñas no coinciden.');
    if (!accept) return alert('Debes aceptar Términos y Privacidad.');

    try {
      setLoading(true);
      setError('');
      await api.post('/auth/register', { nombre: name, email, password, rut });
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

  return (
    <div className="auth-bg-register d-flex justify-content-center align-items-center vh-100">
      <div
        className="auth-card card p-4 border shadow-sm"
        role="main"
        aria-labelledby="titulo-register"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <div className="text-center mb-3" aria-hidden="true">
          <img src="/MEDULABLACK2.png" alt="Logo Médula" className="img-fluid" style={{ width: 140 }} />
        </div>

        <p className="text-center text-muted mb-4">Cuida, organiza y protege</p>

        <div>
          <h2 className="text-center h5 mb-3">Crear Cuenta</h2>
          <form onSubmit={onSubmit} noValidate>
            <label className="form-label" htmlFor="inName">Nombre completo</label>
            <input id="inName" className="form-control mb-2" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ingresa tu nombre completo" required />

            <label className="form-label" htmlFor="inRut">Rut</label>
            <input id="inRut" className="form-control mb-2" type="text" value={rut} onChange={(e) => setRut(e.target.value)} placeholder="Ingresa tu rut" required />

            <label className="form-label" htmlFor="inEmail">Email</label>
            <input id="inEmail" className="form-control mb-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingresa email" required />

            <label className="form-label" htmlFor="inPass">Contraseña</label>
            <input id="inPass" className="form-control mb-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Crea una contraseña segura" required />

            <label className="form-label" htmlFor="inConfirm">Confirmar contraseña</label>
            <input id="inConfirm" className="form-control mb-2" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repite tu contraseña" required />

            <div className="form-check mb-3">
              <input id="inAccept" className="form-check-input" type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
              <label className="form-check-label" htmlFor="inAccept">
                Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>
              </label>
            </div>

            {error && <div className="alert alert-danger mb-3" role="alert">{error}</div>}

            <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>
              {loading ? 'Registrando…' : 'Registrarse'}
            </button>

            <div className="text-center my-3">
              <span className="bg-light px-2">o</span>
            </div>

            <button type="button" className="btn btn-outline-secondary w-100 mb-2">
              Registrarse con ClaveÚnica
            </button>

            <div className="text-center">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/auth/login" className="text-decoration-none">
                Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
