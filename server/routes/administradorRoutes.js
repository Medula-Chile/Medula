const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    crearAdministrador,
    obtenerAdministradores,
    obtenerPacientesAsignados,
    asignarPacienteAMedico,
    desasignarPacienteDeMedico,
    crearReceta,
    crearCita,
    obtenerExamenes,
    editarExamen,
    obtenerPacientesPorMedico
} = require('../controllers/administradorController');

const roleCheck = require('../middleware/roleCheck');

// Middleware para verificar rol administrador
const adminAuth = [auth, roleCheck(['administrador'])];

router.post('/', adminAuth, crearAdministrador);
router.get('/', adminAuth, obtenerAdministradores);

// Rutas para gestión de pacientes
router.get('/pacientes-asignados', adminAuth, obtenerPacientesAsignados);
router.get('/pacientes-por-medico/:medicoId', adminAuth, obtenerPacientesPorMedico);
router.post('/asignar-paciente', adminAuth, asignarPacienteAMedico);
router.post('/desasignar-paciente', adminAuth, desasignarPacienteDeMedico);

// Rutas para crear recetas y citas
router.post('/recetas', adminAuth, crearReceta);
router.post('/citas', adminAuth, crearCita);

// Rutas para exámenes
router.get('/examenes', adminAuth, obtenerExamenes);
router.put('/examenes/:id', adminAuth, editarExamen);

module.exports = router;
