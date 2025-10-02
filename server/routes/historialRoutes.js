import express from 'express';
import {
    crearHistorial,
    obtenerHistorial,
    obtenerHistorialPorId,
    obtenerHistorialPorPaciente,
    actualizarHistorial,
    eliminarHistorial
} from '../controllers/historialController.js';

const router = express.Router();

router.post('/', crearHistorial);
router.get('/', obtenerHistorial);
router.get('/paciente/:paciente_id', obtenerHistorialPorPaciente);
router.get('/:id', obtenerHistorialPorId);
router.put('/:id', actualizarHistorial);
router.delete('/:id', eliminarHistorial);

export default router;