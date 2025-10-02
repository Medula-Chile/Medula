import express from 'express';
import {
    crearReceta,
    obtenerRecetas,
    obtenerRecetaPorId,
    obtenerRecetasPorPaciente,
    actualizarReceta,
    eliminarReceta
} from '../controllers/recetaController.js';

const router = express.Router();

router.post('/', crearReceta);
router.get('/', obtenerRecetas);
router.get('/paciente/:paciente_id', obtenerRecetasPorPaciente);
router.get('/:id', obtenerRecetaPorId);
router.put('/:id', actualizarReceta);
router.delete('/:id', eliminarReceta);

export default router;