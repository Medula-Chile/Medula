import express from 'express';
import {
    crearExamen,
    obtenerExamenes,
    obtenerExamenPorId,
    obtenerExamenesPorPaciente,
    actualizarExamen,
    eliminarExamen
} from '../controllers/examenController.js';

const router = express.Router();

router.post('/', crearExamen);
router.get('/', obtenerExamenes);
router.get('/paciente/:paciente_id', obtenerExamenesPorPaciente);
router.get('/:id', obtenerExamenPorId);
router.put('/:id', actualizarExamen);
router.delete('/:id', eliminarExamen);

export default router;