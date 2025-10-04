import axios from 'axios';

// Prefer environment variable from Vite, fallback to localhost:5000
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL
});

// Interceptor para incluir el token en las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;