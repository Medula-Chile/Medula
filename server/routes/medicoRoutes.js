const express = require('express');
const router = express.Router();
const {
    crearMedico,
    obtenerMedicos,
    obtenerMedicoPorId,
    actualizarMedico,
    eliminarMedico,
    toggleMedico,        // ← NUEVO
    buscarMedicos        // ← NUEVO
} = require('../controllers/medicoController.js');

router.post('/', crearMedico);
router.get('/', obtenerMedicos);
router.get('/buscar', buscarMedicos);        // ← NUEVA RUTA
router.get('/:id', obtenerMedicoPorId);
router.put('/:id', actualizarMedico);
router.patch('/:id/toggle', toggleMedico);   // ← NUEVA RUTA  
router.delete('/:id', eliminarMedico);

module.exports = router;