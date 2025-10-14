const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    crearPaciente,
    obtenerPacientes,
    obtenerPacientePorId,
    obtenerPacienteActual,
    actualizarPacienteActual,
    actualizarPaciente,
    eliminarPaciente,
    togglePaciente,
    buscarPacientes,
    obtenerPacientesPorMedico,
    obtenerEstadisticasPacientes
} = require('../controllers/pacienteController');

// CRUD Completo para Pacientes
router.post('/', crearPaciente);                                // CREATE - Crear paciente
router.get('/', obtenerPacientes);                              // READ - Obtener todos los pacientes (con paginación)
router.get('/buscar', buscarPacientes);                         // READ - Buscar pacientes por nombre o RUT
router.get('/estadisticas', obtenerEstadisticasPacientes);      // READ - Obtener estadísticas de pacientes
router.get('/medico/:medicoId', obtenerPacientesPorMedico);     // READ - Obtener pacientes por médico
router.get('/me', auth, obtenerPacienteActual);                 // READ - Obtener paciente actual (autenticado)
router.get('/:id', obtenerPacientePorId);                       // READ - Obtener paciente por ID
router.put('/me', auth, actualizarPacienteActual);              // UPDATE - Actualizar paciente actual
router.put('/:id', actualizarPaciente);                         // UPDATE - Actualizar paciente
router.patch('/:id/toggle', togglePaciente);                    // UPDATE - Activar/desactivar paciente
router.delete('/:id', eliminarPaciente);                        // DELETE - Eliminar paciente

module.exports = router;