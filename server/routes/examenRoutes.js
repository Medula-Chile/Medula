const express = require('express');
const router = express.Router();
const {
    crearExamen,
    obtenerExamenes,
    obtenerExamenPorId,
    obtenerExamenesPorPaciente,
    actualizarExamen,
    eliminarExamen
} = require('../controllers/examenController.js');


router.post('/', crearExamen);
router.get('/', obtenerExamenes);
router.get('/paciente/:paciente_id', obtenerExamenesPorPaciente);
router.get('/:id', obtenerExamenPorId);
router.put('/:id', actualizarExamen);
router.delete('/:id', eliminarExamen);

module.exports = router;