const express = require('express');
const router = express.Router();
const {
    crearPaciente,
    obtenerPacientes,
    obtenerPacientePorId,
    actualizarPaciente,
    eliminarPaciente
} = require('../controllers/pacienteController');

router.post('/', crearPaciente);
router.get('/', obtenerPacientes);
router.get('/:id', obtenerPacientePorId);
router.put('/:id', actualizarPaciente);
router.delete('/:id', eliminarPaciente);

module.exports = router;