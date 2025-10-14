const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();
const {
    crearExamen,
    obtenerExamenes,
    obtenerExamenesPorPaciente,
    subirAdjunto
} = require('../controllers/examenController');

// Configuración de subida de archivos para exámenes
const UPLOAD_ROOT = path.resolve(__dirname, '..', 'uploads');
const EXAM_SUBDIR = 'examenes';
const DEST = path.join(UPLOAD_ROOT, EXAM_SUBDIR);
fs.mkdirSync(DEST, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DEST);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});
const upload = multer({ storage });

router.post('/', crearExamen);
router.get('/', obtenerExamenes);
router.get('/paciente/:pacienteId', obtenerExamenesPorPaciente);
// Subida de adjuntos: campo 'file'
router.post('/upload', upload.single('file'), (req, res) => subirAdjunto(req, res, { subdir: EXAM_SUBDIR }));

module.exports = router;