import express from 'express';
import {
  crearMedico,
  obtenerMedicos,
  obtenerMedicoPorId,
  actualizarMedico,
  eliminarMedico
} from '../controllers/medicoController.js';

const router = express.Router();

router.post('/', crearMedico);
router.get('/', obtenerMedicos);
router.get('/:id', obtenerMedicoPorId);
router.put('/:id', actualizarMedico);
router.delete('/:id', eliminarMedico);

export default router;