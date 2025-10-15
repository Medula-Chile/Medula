const express = require('express');
const router = express.Router();
const {
    crearReceta,
    obtenerRecetas,
    obtenerRecetasPorPaciente,
    migrarIds
} = require('../controllers/recetaController');

router.post('/', crearReceta);
router.get('/', obtenerRecetas);
router.get('/paciente/:pacienteId', obtenerRecetasPorPaciente); // NUEVA RUTA
router.post('/migrate-ids', migrarIds);

module.exports = router;