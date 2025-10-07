import axios from 'axios';

// Prefer environment variable from Vite. If missing, infer from window.location.
// Default backend port is 5000 (server/server.js uses PORT || 5000), with /api prefix.
// You can override via VITE_API_BASE_URL.
let inferredBaseURL;
try {
  const { protocol, hostname, port } = window.location;
  // Always default to 5000 in development unless explicitly overridden by env.
  const apiPort = '5000';
  inferredBaseURL = `${protocol}//${hostname}:${apiPort}/api`;
} catch {
  // Fallback for non-browser contexts
  inferredBaseURL = 'http://localhost:5000/api';
}

const baseURL = import.meta.env.VITE_API_BASE_URL || inferredBaseURL;

const api = axios.create({
    baseURL
});

    // Interceptor para incluir el token en las peticiones
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;