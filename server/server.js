const path = require('path');
// Cargar variables de entorno - DEBE SER LO PRIMERO
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');

// Verificación inicial de variables críticas
if (!process.env.MONGO_URI) {
  console.error('❌ Error crítico: MONGO_URI no está definida en .env');
  process.exit(1);
}

// Inicializar express
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Log de variables de entorno
console.log('\n=== Variables de Entorno Cargadas ===');
console.log('PORT:', process.env.PORT || '5000 (default)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development (default)');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Cargada' : '❌ No cargada');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Cargada' : '❌ No cargada');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:5173 (default)');
console.log('=====================================\n');

// Conectar a MongoDB
connectDB();

// Rutas base
app.get('/', (req, res) => {
  res.json({
    message: 'API de Medula funcionando correctamente',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date()
  });
});

// Puerto (usar el de .env o 5000 como fallback)
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
    🚀 Servidor corriendo en ${process.env.NODE_ENV || 'development'}
    📡 Puerto: ${PORT}
    🌐 URL: http://localhost:${PORT}
    `);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Cerrando servidor...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
// Ruta de prueba para verificar la conexión a la base de datos
app.get('/api/test', async (req, res) => {
  try {
    // Verificar el estado de la conexión
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "Desconectado",
      1: "Conectado",
      2: "Conectando",
      3: "Desconectando"
    };

    res.json({
      status: 'success',
      message: 'API funcionando correctamente',
      database: {
        state: states[dbState],
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      },
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al verificar la conexión',
      error: error.message
    });
  }
});

// Manejo de SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Cerrando servidor...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('💾 Conexión MongoDB cerrada.');
      process.exit(0);
    });
  });
});