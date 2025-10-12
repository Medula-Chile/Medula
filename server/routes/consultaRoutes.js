const express = require('express');
const router = express.Router();
const { crearConsulta, obtenerConsulta, listarConsultas } = require('../controllers/consultaController');

router.post('/', crearConsulta);
router.get('/', listarConsultas);
router.get('/:id', obtenerConsulta);

module.exports = router;
