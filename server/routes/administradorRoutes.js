const express = require('express');
const router = express.Router();
const {
    crearAdministrador,
    obtenerAdministradores
} = require('../controllers/administradorController');

router.post('/', crearAdministrador);
router.get('/', obtenerAdministradores);

module.exports = router;