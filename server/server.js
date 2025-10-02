const path = require('path');
// Cargar variables de entorno - DEBE SER LO PRIMERO
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';

// Importar rutas
import usuarioRoutes from './routes/usuarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import medicoRoutes from './routes/medicoRoutes.js';
import citaRoutes from './routes/citaRoutes.js';
import historialRoutes from './routes/historialRoutes.js';
import centroRoutes from './routes/centroRoutes.js';
import especialidadRoutes from './routes/especialidadRoutes.js';
import recetaRoutes from './routes/recetaRoutes.js';
import administradorRoutes from './routes/administradorRoutes.js';
import examenRoutes from './routes/examenRoutes.js';
import medicamentoRoutes from './routes/medicamentoRoutes.js'; // Nueva ruta

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/centros', centroRoutes);
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/recetas', recetaRoutes);
app.use('/api/administradores', administradorRoutes);
app.use('/api/examenes', examenRoutes);
app.use('/api/medicamentos', medicamentoRoutes); // Nueva ruta

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'API del Sistema de Salud funcionando' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});