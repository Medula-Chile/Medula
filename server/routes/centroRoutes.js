import express from 'express';
import {
    crearCentro,
    obtenerCentros,
    obtenerCentroPorId,
    actualizarCentro,
    eliminarCentro
} from '../controllers/centroController.js';

const router = express.Router();

router.post('/', crearCentro);
router.get('/', obtenerCentros);
router.get('/:id', obtenerCentroPorId);
router.put('/:id', actualizarCentro);
router.delete('/:id', eliminarCentro);

export default router;