const express = require('express');
const router = express.Router();
const { crearConsulta, obtenerConsulta, listarConsultas, actualizarConsulta, eliminarConsulta } = require('../controllers/consultaController');

router.post('/', crearConsulta);
router.get('/', listarConsultas);
router.get('/:id', obtenerConsulta);
router.put('/:id', actualizarConsulta);
router.delete('/:id', eliminarConsulta);

module.exports = router;
