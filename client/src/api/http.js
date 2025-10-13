import axios from 'axios';

// Centraliza la URL base de la API
// Configura VITE_API_URL en tu .env.local si no usas 5000
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const http = axios.create({ baseURL });

export default http;
