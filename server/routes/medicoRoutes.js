const express = require('express');
const router = express.Router();
const{
  crearMedico,
  obtenerMedicos,
  obtenerMedicoPorId,
  actualizarMedico,
  eliminarMedico
} =require('../controllers/medicoController.js');

router.post('/', crearMedico);
router.get('/', obtenerMedicos);
router.get('/:id', obtenerMedicoPorId);
router.put('/:id', actualizarMedico);
router.delete('/:id', eliminarMedico);

module.exports = router;