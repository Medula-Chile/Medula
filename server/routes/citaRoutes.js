const express = require('express');
const router = express.Router();
const {
    crearCita,
    obtenerCitas,
    obtenerCitaPorId,
    actualizarCita,
    eliminarCita,
    getCitasByDoctor
} = require('../controllers/citaController');

router.post('/', crearCita);
router.get('/', obtenerCitas);
router.get('/doctor/:doctorId', getCitasByDoctor);
router.get('/:id', obtenerCitaPorId);
router.put('/:id', actualizarCita);
router.delete('/:id', eliminarCita);

module.exports = router;
