const express = require('express');
const router = express.Router();
const {
    crearEspecialidad,
    obtenerEspecialidades,
    obtenerEspecialidadPorId,
    actualizarEspecialidad,
    eliminarEspecialidad
} = require ('../controllers/especialidadController.js');


router.post('/', crearEspecialidad);
router.get('/', obtenerEspecialidades);
router.get('/:id', obtenerEspecialidadPorId);
router.put('/:id', actualizarEspecialidad);
router.delete('/:id', eliminarEspecialidad);

module.exports = router;