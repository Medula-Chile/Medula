const express = require('express');
const router = express.Router();
const {
    crearCentro,
    obtenerCentros,
    obtenerCentroPorId,
    actualizarCentro,
    eliminarCentro,
    toggleCentro,
    buscarCentros
} = require('../controllers/centroController');

router.post('/', crearCentro);
router.get('/', obtenerCentros);
router.get('/buscar', buscarCentros);
router.get('/:id', obtenerCentroPorId);
router.put('/:id', actualizarCentro);
router.delete('/:id', eliminarCentro);
router.patch('/:id/toggle', toggleCentro);

module.exports = router;