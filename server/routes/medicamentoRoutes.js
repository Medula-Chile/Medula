const express = require('express');
const router = express.Router();
const {
    crearMedicamento,
    obtenerMedicamentos,
    obtenerMedicamentoPorId,
    buscarMedicamentos,
    actualizarMedicamento,
    eliminarMedicamento,
    desactivarMedicamento
} =  require('../controllers/medicamentoController.js');


router.post('/', crearMedicamento);
router.get('/', obtenerMedicamentos);
router.get('/buscar', buscarMedicamentos);
router.get('/:id', obtenerMedicamentoPorId);
router.put('/:id', actualizarMedicamento);
router.delete('/:id', eliminarMedicamento);
router.patch('/:id/desactivar', desactivarMedicamento);

module.exports = router;