const express = require('express');
const router = express.Router();
const {
    crearCentro,
    obtenerCentros,
    obtenerCentroPorId
} = require('../controllers/centroController');

router.post('/', crearCentro);
router.get('/', obtenerCentros);
router.get('/:id', obtenerCentroPorId);

module.exports = router;