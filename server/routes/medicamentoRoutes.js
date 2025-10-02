const express = require('express');
const router = express.Router();
const {
    crearMedicamento,
    obtenerMedicamentos
} = require('../controllers/medicamentoController');

router.post('/', crearMedicamento);
router.get('/', obtenerMedicamentos);

module.exports = router;