const express = require('express');
const router = express.Router();
const {
    crearHistorial,
    obtenerHistorial,
    obtenerHistorialPorId,
    obtenerHistorialPorPaciente,
    actualizarHistorial,
    eliminarHistorial
} = require('../controllers/historialController.js');


router.post('/', crearHistorial);
router.get('/', obtenerHistorial);
router.get('/paciente/:paciente_id', obtenerHistorialPorPaciente);
router.get('/:id', obtenerHistorialPorId);
router.put('/:id', actualizarHistorial);
router.delete('/:id', eliminarHistorial);

module.exports = router;