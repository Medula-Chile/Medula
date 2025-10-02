const express = require('express');
const router = express.Router();
const {
    crearReceta,
    obtenerRecetas
} = require('../controllers/recetaController');

router.post('/', crearReceta);
router.get('/', obtenerRecetas);

module.exports = router;