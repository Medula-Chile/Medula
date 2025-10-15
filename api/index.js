// Punto de entrada para Vercel Serverless Functions
// Este archivo envuelve el servidor Express para que funcione en Vercel

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'server', '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('../server/config/database');

// Inicializar express
const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'https://*.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir herramientas como Postman (sin origin) y orígenes permitidos
    if (!origin || allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const regex = new RegExp(allowed.replace('*', '.*'));
        return regex.test(origin);
      }
      return allowed === origin;
    })) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`), false);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos subidos (en Vercel, considera usar S3 o similar)
app.use('/uploads', express.static(path.join(__dirname, '..', 'server', 'uploads')));

// Conectar a MongoDB (solo si no está conectado)
if (mongoose.connection.readyState === 0) {
  connectDB();
}

// Rutas
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/users', require('../server/routes/usuarioRoutes'));
app.use('/api/pacientes', require('../server/routes/pacienteRoutes'));
app.use('/api/medicos', require('../server/routes/medicoRoutes'));
app.use('/api/administradores', require('../server/routes/administradorRoutes'));
app.use('/api/citas', require('../server/routes/citaRoutes'));
app.use('/api/historial', require('../server/routes/historialRoutes'));
app.use('/api/centros', require('../server/routes/centroRoutes'));
app.use('/api/especialidades', require('../server/routes/especialidadRoutes'));
app.use('/api/recetas', require('../server/routes/recetaRoutes'));
app.use('/api/examenes', require('../server/routes/examenRoutes'));
app.use('/api/medicamentos', require('../server/routes/medicamentoRoutes'));
app.use('/api/consultas', require('../server/routes/consultaRoutes'));

// Ruta base
app.get('/', (req, res) => {
  res.json({
    message: 'API de Medula funcionando en Vercel',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date()
  });
});

// Ruta de prueba
app.get('/api/test', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      message: 'API funcionando',
      database: states[dbState] || 'unknown',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Exportar para Vercel
module.exports = app;
