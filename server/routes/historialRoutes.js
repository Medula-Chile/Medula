const express = require('express');
const router = express.Router();
const {
    crearHistorial,
    obtenerHistorial,
    obtenerHistorialPorId
} = require('../controllers/historialController');

router.post('/', crearHistorial);
router.get('/', obtenerHistorial);
router.get('/:id', obtenerHistorialPorId);

module.exports = router;