const express = require('express');
const router = express.Router();
const {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    toggleUsuario,
    buscarUsuarios,
    obtenerEstadisticas
} = require('../controllers/userController');

// CRUD Completo para Usuarios
router.post('/', crearUsuario);                    // CREATE - Crear usuario
router.get('/', obtenerUsuarios);                  // READ - Obtener todos los usuarios (con paginación y filtros)
router.get('/buscar', buscarUsuarios);             // READ - Buscar usuarios por nombre, email o RUT
router.get('/estadisticas', obtenerEstadisticas);  // READ - Obtener estadísticas de usuarios
router.get('/:id', obtenerUsuarioPorId);           // READ - Obtener usuario por ID
router.put('/:id', actualizarUsuario);             // UPDATE - Actualizar usuario (incluye cambio de contraseña)
router.patch('/:id/toggle', toggleUsuario);        // UPDATE - Activar/desactivar usuario
router.delete('/:id', eliminarUsuario);            // DELETE - Eliminar usuario físicamente

module.exports = router;