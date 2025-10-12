const express = require('express');
const router = express.Router();
const {
    crearMedicamento,
    obtenerMedicamentos,
    obtenerMedicamentoPorId,
    actualizarMedicamento,
    eliminarMedicamento,
    insertarMasivo,
    sembrarDefault
} = require('../controllers/medicamentoController');

router.post('/', crearMedicamento);
router.get('/', obtenerMedicamentos);
router.get('/:id', obtenerMedicamentoPorId);
router.put('/:id', actualizarMedicamento);
router.delete('/:id', eliminarMedicamento);
router.post('/bulk', insertarMasivo);
router.post('/seed', sembrarDefault);

module.exports = router;