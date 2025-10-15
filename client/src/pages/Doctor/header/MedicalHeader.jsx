import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

function MedicalHeader({ onToggleSidebar }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { 
        setUserData(null);
        setLoading(false);
        return;
      }

      const endpoints = ['/users/profile', '/auth/me', '/me'];
      let payload = null;
      for (const ep of endpoints) {
        try {
          const resp = await api.get(ep);
          payload = resp?.data?.user || resp?.data || null;
          if (payload) break;
        } catch {
          // continúa con el siguiente endpoint
        }
      }
      setUserData(payload);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      setUserData(null);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  // Escucha eventos de login / storage
  useEffect(() => {
    const onAuthLogin = () => { setLoading(true); fetchUserData(); };
    const onStorage = (e) => {
      if (e.key === 'token') {
        setLoading(true);
        if (e.newValue) fetchUserData(); else setUserData(null);
      }
    };
    window.addEventListener('auth:login', onAuthLogin);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('auth:login', onAuthLogin);
      window.removeEventListener('storage', onStorage);
    };
  }, [fetchUserData]);

  const displayName =
    userData?.nombre ||
    userData?.name ||
    [userData?.firstName, userData?.lastName].filter(Boolean).join(' ') ||
    'Médico';

  const role =
    (userData?.rol || userData?.role || 'Profesional de Salud').toString();

  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="bg-white border-bottom border-gray-200 px-3 px-md-4 py-3">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          {/* Botón hamburguesa (móvil) */}
          <button
            className="btn btn-ghost d-lg-none me-2"
            type="button"
            aria-label="Abrir menú lateral"
            onClick={onToggleSidebar}
          >
            <i className="fas fa-bars" />
          </button>

          {/* Logo principal */}
          <div className="d-flex align-items-center gap-3">
            <img
              src="/MEDULAAWHITHE.png"
              alt="Medula"
              width={200}
              height="auto"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Saludo central tipo paciente, versión médico */}
        <div className="d-none d-md-flex flex-grow-1 justify-content-center text-center">
          <div>
            <h2 className="h6 fw-semibold mb-0">
              {loading ? 'Cargando...' : `Hola Dr(a). ${displayName}`}
            </h2>
            <p className="text-muted-foreground small mb-0">
              Bienvenid@ a tu portal profesional
            </p>
          </div>
        </div>

        {/* Controles de usuario */}
        <div className="d-flex align-items-center gap-3">
          {/* Indicador de conexión segura */}
          <div className="d-none d-md-flex align-items-center gap-2">
            <i className="fas fa-shield-alt" style={{ color: '#d6e3ffff' }} />

            <span className="custom-badge border-success text-success">
              Conexión Segura
            </span>
          </div>

          {/* Notificaciones */}
          <button
            className="btn btn-ghost position-relative"
            aria-label="Notificaciones"
          >
            <i className="fas fa-bell" />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-destructive">
              2
            </span>
          </button>

          {/* Información del usuario */}
          <div className="d-flex align-items-center gap-3 ps-3 border-start border-gray-200">
            <div className="d-none d-md-block text-end">
              <p className="small fw-medium mb-0">
                {loading ? 'Cargando...' : displayName}
              </p>
              <p className="text-muted-foreground small mb-0">
                {loading ? 'Especialidad' : role}
              </p>
            </div>
            <div
  className="rounded-circle d-flex align-items-center justify-content-center"
  style={{
    width: 40,
    height: 40,
    backgroundColor: '#0c49e2ff' // Azul claro (puedes ajustar tono)
  }}
  aria-label={`Avatar de ${displayName}`}
>

              <span className="text-white fw-medium">
                {loading ? '...' : initials}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default MedicalHeader;
