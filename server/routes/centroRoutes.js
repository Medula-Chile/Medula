const express = require('express');
const router = express.Router();
const {
    crearCentro,
    obtenerCentros,
    obtenerCentroPorId,
    actualizarCentro,
    eliminarCentro
} = require ('../controllers/centroController.js');


router.post('/', crearCentro);
router.get('/', obtenerCentros);
router.get('/:id', obtenerCentroPorId);
router.put('/:id', actualizarCentro);
router.delete('/:id', eliminarCentro);

module.exports = router;