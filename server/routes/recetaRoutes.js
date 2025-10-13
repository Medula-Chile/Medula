const express = require('express');
const router = express.Router();
const {
    crearReceta,
    obtenerRecetas,
    migrarIds
} = require('../controllers/recetaController');

router.post('/', crearReceta);
router.get('/', obtenerRecetas);
router.post('/migrate-ids', migrarIds);

module.exports = router;