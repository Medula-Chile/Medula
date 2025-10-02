import express from 'express';
import {
    crearPaciente,
    obtenerPacientes,
    obtenerPacientePorId,
    actualizarPaciente,
    eliminarPaciente
} from '../controllers/pacienteController.js';

const router = express.Router();

router.post('/', crearPaciente);
router.get('/', obtenerPacientes);
router.get('/:id', obtenerPacientePorId);
router.put('/:id', actualizarPaciente);
router.delete('/:id', eliminarPaciente);

export default router;