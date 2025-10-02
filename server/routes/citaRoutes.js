import express from 'express';
import {
    crearCita,
    obtenerCitas,
    obtenerCitaPorId,
    actualizarCita,
    eliminarCita
} from '../controllers/citaController.js';

const router = express.Router();

router.post('/', crearCita);
router.get('/', obtenerCitas);
router.get('/:id', obtenerCitaPorId);
router.put('/:id', actualizarCita);
router.delete('/:id', eliminarCita);

export default router;