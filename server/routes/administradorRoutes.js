const express = require('express');
const router = express.Router();
const {
    crearAdministrador,
    obtenerAdministradores,
    obtenerAdministradorPorId,
    actualizarAdministrador,
    eliminarAdministrador
} = require ('../controllers/administradorController.js');


router.post('/', crearAdministrador);
router.get('/', obtenerAdministradores);
router.get('/:id', obtenerAdministradorPorId);
router.put('/:id', actualizarAdministrador);
router.delete('/:id', eliminarAdministrador);

module.exports = router;