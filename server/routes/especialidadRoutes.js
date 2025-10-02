const express = require('express');
const router = express.Router();
const {
    crearEspecialidad,
    obtenerEspecialidades
} = require('../controllers/especialidadController');

router.post('/', crearEspecialidad);
router.get('/', obtenerEspecialidades);

module.exports = router;