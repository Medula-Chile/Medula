import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

// Encabezado del Portal (con nuevo logo y sin texto inferior)
function Header({ onToggleSidebar }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { setUserData(null); return; }
      const endpoints = ['/users/profile', '/auth/me', '/me'];
      let payload = null;
      for (const ep of endpoints) {
        try {
          const resp = await api.get(ep);
          payload = resp?.data?.user || resp?.data || null;
          if (payload) break;
        } catch {}
      }
      setUserData(payload);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  // Escucha cambios de login/localStorage
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
    'Usuario';
  const plan = userData?.plan || userData?.healthPlan || 'FONASA';
  const initials = displayName.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase();

  return (
    <>
      <header className="bg-white border-bottom border-gray-200 px-3 px-md-4 py-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            {/* Botón hamburguesa (móvil) */}
            <button
              className="btn btn-ghost d-lg-none me-2"
              type="button"
              id="sidebarToggle"
              aria-label="Abrir menú lateral"
              onClick={onToggleSidebar}
            >
              <i className="fas fa-bars" />
            </button>

            {/* Logo actualizado */}
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

          {/* Saludo centrado (md+) */}
          <div className="d-none d-md-flex flex-grow-1 justify-content-center text-center">
            <div>
              <h2 className="h6 fw-semibold mb-0">
                {loading ? 'Cargando...' : `Hola, ${displayName}`}
              </h2>
              <p className="text-muted-foreground small mb-0">
                Bienvenid@ a tu portal médico
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Conexión segura */}
            <div className="d-none d-md-flex align-items-center gap-2">
              <i className="fas fa-shield-alt" style={{ color: '#d6e3ffff' }} />
              <span className="custom-badge border-success text-success">
                Conexión Segura
              </span>
            </div>

            {/* Notificaciones */}
            <button className="btn btn-ghost position-relative">
              <i className="fas fa-bell" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-destructive">
                2
              </span>
            </button>

            {/* Perfil usuario */}
            <div className="d-flex align-items-center gap-3 ps-3 border-start border-gray-200">
              <div className="d-none d-md-block text-end">
                <p className="small fw-medium mb-0">{displayName}</p>
                <p className="text-muted-foreground small mb-0">{plan}</p>
              </div>
              <div
  className="rounded-circle d-flex align-items-center justify-content-center"
  style={{
    width: 40,
    height: 40,
    backgroundColor: '#0c49e2ff' // Azul claro (puedes ajustar tono)
    
  }}
>
  <span className="fw-medium">{initials}</span>
</div>

            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
