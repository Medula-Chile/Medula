const express = require('express');
const router = express.Router();
const {
    crearReceta,
    obtenerRecetas,
    obtenerRecetaPorId,
    obtenerRecetasPorPaciente,
    actualizarReceta,
    eliminarReceta
}=require('../controllers/recetaController.js');


router.post('/', crearReceta);
router.get('/', obtenerRecetas);
router.get('/paciente/:paciente_id', obtenerRecetasPorPaciente);
router.get('/:id', obtenerRecetaPorId);
router.put('/:id', actualizarReceta);
router.delete('/:id', eliminarReceta);

module.exports = router;