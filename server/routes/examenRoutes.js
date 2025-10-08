const express = require('express');
const router = express.Router();
const {
    crearExamen,
    obtenerExamenes,
    obtenerExamenesPorPaciente
} = require('../controllers/examenController');

router.post('/', crearExamen);
router.get('/', obtenerExamenes);
router.get('/paciente/:pacienteId', obtenerExamenesPorPaciente);

module.exports = router;