import './MedicalHeader.css';
import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

function MedicalHeader({ onToggleSidebar }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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
                } catch (error) {
                    console.warn(`Endpoint ${ep} falló:`, error);
                    // Continúa con el siguiente endpoint
                }
            }
            
            setUserData(payload);
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            setUserData(null);
            
            // Limpiar token si es inválido
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // Escuchar eventos de autenticación
    useEffect(() => {
        const handleAuthLogin = () => {
            setLoading(true);
            fetchUserData();
        };

        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                setLoading(true);
                if (e.newValue) {
                    fetchUserData();
                } else {
                    setUserData(null);
                }
            }
        };

        window.addEventListener('auth:login', handleAuthLogin);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('auth:login', handleAuthLogin);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [fetchUserData]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Lógica de búsqueda para médicos
        console.log('Buscando paciente:', searchQuery);
        // Aquí puedes implementar la búsqueda real de pacientes
    };

    // Funciones helper para derivar datos del usuario
    const getDisplayName = () => {
        if (!userData) return 'Médico';
        return userData.nombre || userData.name || 
               [userData.firstName, userData.lastName].filter(Boolean).join(' ') || 'Médico';
    };

    const getRoleDisplay = () => {
        const role = (userData?.rol || userData?.role || '').toString().toLowerCase();
        if (loading) return 'Cargando...';
        
        switch(role) {
            case 'medico':
            case 'doctor':
                return 'Médico';
            case 'enfermero':
            case 'nurse':
                return 'Enfermero/a';
            case 'administrativo':
                return 'Personal Administrativo';
            default:
                return 'Profesional de Salud';
        }
    };

    const getSpecialty = () => {
        // Prioridad: especialidad específica -> rol -> default
        return userData?.especialidad || 
               userData?.specialty || 
               userData?.especialidadMedica ||
               getRoleDisplay();
    };

    const getInitials = () => {
        const name = getDisplayName();
        return name.split(' ')
                  .map(part => part[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();
    };

    const displayName = getDisplayName();
    const roleDisplay = getRoleDisplay();
    const specialty = getSpecialty();
    const initials = getInitials();

    return (
        <header className="bg-white border-bottom border-gray-200 px-3 px-md-4 py-3">
            <div className="d-flex align-items-center justify-content-between">
                {/* Logo y título */}
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-ghost d-lg-none me-2"
                        type="button"
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
                                {loading ? 'Portal Médico' : `Portal ${roleDisplay}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Barra de búsqueda centrada - Solo visible para médicos/doctores */}
                {(userData?.rol === 'medico' || userData?.role === 'doctor' || userData?.rol === 'enfermero') && (
                    <div className="d-none d-md-flex flex-grow-1 justify-content-center">
                        <div className="w-100" style={{ maxWidth: '400px' }}>
                            <form onSubmit={handleSearch} className="d-flex align-items-center">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar paciente por nombre o RUT"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        aria-label="Buscar pacientes"
                                    />
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                        aria-label="Ejecutar búsqueda"
                                        disabled={!searchQuery.trim()}
                                    >
                                        <i className="fas fa-search" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Saludo personalizado cuando no hay búsqueda */}
                {!(userData?.rol === 'medico' || userData?.role === 'doctor' || userData?.rol === 'enfermero') && (
                    <div className="d-none d-md-flex flex-grow-1 justify-content-center text-center">
                        <div>
                            <h2 className="h6 fw-semibold mb-0">
                                {loading ? 'Cargando...' : `Hola, ${displayName}`}
                            </h2>
                            <p className="text-muted-foreground small mb-0">
                                Bienvenid@ al portal de salud
                            </p>
                        </div>
                    </div>
                )}

                {/* Controles de usuario */}
                <div className="d-flex align-items-center gap-3">
                    {/* Indicador de conexión segura */}
                    <div className="d-none d-md-flex align-items-center gap-2">
                        <i className="fas fa-shield-alt text-success" />
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
                                {loading ? 'Especialidad' : specialty}
                            </p>
                        </div>
                        <div 
                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
                            style={{ width: 40, height: 40 }}
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