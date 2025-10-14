const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    crearHistorial,
    obtenerHistorial,
    obtenerHistorialPacienteActual,
    obtenerHistorialPorId
} = require('../controllers/historialController');

router.post('/', crearHistorial);
router.get('/', obtenerHistorial);
router.get('/me', auth, obtenerHistorialPacienteActual);
router.get('/:id', obtenerHistorialPorId);

module.exports = router;