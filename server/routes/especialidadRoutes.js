import express from 'express';
import {
    crearEspecialidad,
    obtenerEspecialidades,
    obtenerEspecialidadPorId,
    actualizarEspecialidad,
    eliminarEspecialidad
} from '../controllers/especialidadController.js';

const router = express.Router();

router.post('/', crearEspecialidad);
router.get('/', obtenerEspecialidades);
router.get('/:id', obtenerEspecialidadPorId);
router.put('/:id', actualizarEspecialidad);
router.delete('/:id', eliminarEspecialidad);

export default router;