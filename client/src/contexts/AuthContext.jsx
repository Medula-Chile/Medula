import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();
export { AuthContext };
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                return;
            }
            const response = await api.get('/auth/me');
            setUser(response.data?.user || null);
        } catch (error) {
            console.error('Error cargando usuario:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Carga inicial
        loadUser();

        // Escuchar eventos de login/logout dentro de la SPA
        const onLogin = () => loadUser();
        const onLogout = () => { localStorage.removeItem('token'); setUser(null); };
        window.addEventListener('auth:login', onLogin);
        window.addEventListener('auth:logout', onLogout);

        // Sincronizar entre pestañas: si cambia el token en localStorage
        const onStorage = (e) => {
            if (e.key === 'token') {
                if (e.newValue) loadUser(); else setUser(null);
            }
        };
        window.addEventListener('storage', onStorage);

        return () => {
            window.removeEventListener('auth:login', onLogin);
            window.removeEventListener('auth:logout', onLogout);
            window.removeEventListener('storage', onStorage);
        };
    }, [loadUser]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, refresh: loadUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);