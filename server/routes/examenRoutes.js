const express = require('express');
const router = express.Router();
const {
    crearExamen,
    obtenerExamenes
} = require('../controllers/examenController');

router.post('/', crearExamen);
router.get('/', obtenerExamenes);

module.exports = router;