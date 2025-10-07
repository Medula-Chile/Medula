import './Header.css'
import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
// Encabezado del Portal del Paciente.
// Props:
// - onToggleSidebar: función para abrir/cerrar el menú lateral en dispositivos pequeños.
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
                } catch {
                    // sigue con el próximo endpoint
                }
            }
            setUserData(payload);
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // Escuchar login y cambios en localStorage (token) para refrescar datos
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

    const displayName = userData?.nombre || userData?.name || [userData?.firstName, userData?.lastName].filter(Boolean).join(' ') || 'Usuario';
    const role = (userData?.rol || userData?.role || '').toString().toLowerCase();
    const plan = userData?.plan || userData?.healthPlan || 'FONASA';
    const initials = displayName.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase();
    return (
        <>
            <header className="bg-white border-bottom border-gray-200 px-3 px-md-4 py-3">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        {/* Botón hamburguesa visible en pantallas pequeñas para abrir el sidebar */}
                        <button
                            className="btn btn-ghost d-lg-none me-2"
                            type="button"
                            id="sidebarToggle"
                            aria-label="Abrir menú lateral"
                            onClick={onToggleSidebar}
                        >
                            <i className="fas fa-bars" />
                        </button>
                        <div className="d-flex align-items-center gap-3">
                            <img
                                src="/medula_icono.png"
                                alt="Medula"
                                width={40}
                                height={40}
                                style={{ objectFit: 'contain' }}
                            />
                            <div>
                                <h1 className="h5 mb-0 fw-bold text-primary">MEDULA</h1>
                                <p className="text-muted-foreground small mb-0">
                                    Portal del {loading ? '...' : role === 'paciente' ? 'Paciente' : role === 'medico' || role === 'doctor' ? 'Doctor' : 'Usuario'}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Saludo personalizado centrado (visible en md+) */}
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
                        {/* Indicador de conexión segura (visible en md+) */}
                        <div className="d-none d-md-flex align-items-center gap-2">
                            <i className="fas fa-shield-alt text-success" />
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
                        {/* Resumen de usuario (avatar, siglas y plan) */}
                        <div className="d-flex align-items-center gap-3 ps-3 border-start border-gray-200">
                            <div className="d-none d-md-block text-end">
                                <p className="small fw-medium mb-0">{displayName}</p>
                                <p className="text-muted-foreground small mb-0">{plan}</p>
                            </div>
                            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                <span className="text-white fw-medium">{initials}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header