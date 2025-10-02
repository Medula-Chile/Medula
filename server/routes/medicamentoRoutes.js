import express from 'express';
import {
    crearMedicamento,
    obtenerMedicamentos,
    obtenerMedicamentoPorId,
    buscarMedicamentos,
    actualizarMedicamento,
    eliminarMedicamento,
    desactivarMedicamento
} from '../controllers/medicamentoController.js';

const router = express.Router();

router.post('/', crearMedicamento);
router.get('/', obtenerMedicamentos);
router.get('/buscar', buscarMedicamentos);
router.get('/:id', obtenerMedicamentoPorId);
router.put('/:id', actualizarMedicamento);
router.delete('/:id', eliminarMedicamento);
router.patch('/:id/desactivar', desactivarMedicamento);

export default router;