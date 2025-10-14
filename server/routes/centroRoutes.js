const express = require('express');
const router = express.Router();
const {
    crearCentro,
    obtenerCentros,
    obtenerCentroPorId,
    actualizarCentro,
    eliminarCentro,
    toggleCentro,
    buscarCentros,
    obtenerCentrosPorEspecialidad,
    crearCentrosBulk 
} = require('../controllers/centroController');

router.post('/', crearCentro);
router.post('/bulk', crearCentrosBulk);
router.get('/', obtenerCentros);
router.get('/buscar', buscarCentros);
router.get('/especialidad/:especialidadId', obtenerCentrosPorEspecialidad);
router.get('/:id', obtenerCentroPorId);
router.put('/:id', actualizarCentro);
router.delete('/:id', eliminarCentro);
router.patch('/:id/toggle', toggleCentro);

module.exports = router;