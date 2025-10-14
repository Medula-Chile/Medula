const Examen = require('../models/examen');
const path = require('path');

exports.crearExamen = async (req, res) => {
  try {
    const nuevoExamen = new Examen(req.body);
    const examenGuardado = await nuevoExamen.save();
    
    await examenGuardado.populate('paciente_id', 'nombre usuario_id');
    await examenGuardado.populate('medico_solicitante', 'nombre especialidad');
    
    res.status(201).json({
      message: 'Examen creado exitosamente',
      examen: examenGuardado
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear examen',
      error: error.message
    });
  }
};

// Subida de adjuntos (se usa desde ruta con multer). Devuelve URL pública.
exports.subirAdjunto = async (req, res, opts = {}) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Archivo no proporcionado' });
    const subdir = opts?.subdir || '';
    const fileName = req.file.filename;
    const publicUrl = `/uploads/${subdir ? subdir + '/' : ''}${fileName}`;
    return res.status(201).json({ message: 'Archivo subido', file: { name: fileName, url: publicUrl } });
  } catch (error) {
    return res.status(500).json({ message: 'Error al subir archivo', error: error.message });
  }
};

exports.obtenerExamenes = async (req, res) => {
  try {
    const { paciente, medico, estado, desde, hasta, consulta } = req.query;
    const filter = {};
    if (paciente) filter.paciente_id = paciente;
    if (medico) filter.medico_solicitante = medico;
    if (estado) filter.estado = estado;
    if (consulta) filter.consulta_id = consulta;
    if (desde || hasta) {
      filter.fecha_solicitud = {};
      if (desde) filter.fecha_solicitud.$gte = new Date(desde);
      if (hasta) filter.fecha_solicitud.$lte = new Date(hasta);
    }

    const examenes = await Examen.find(filter)
      .populate('paciente_id', 'nombre usuario_id')
      .populate('medico_solicitante', 'nombre especialidad')
      .sort({ fecha_solicitud: -1 });

    res.json(examenes);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener exámenes',
      error: error.message
    });
  }
};

// Obtener exámenes de un paciente específico
exports.obtenerExamenesPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    const examenes = await Examen.find({ paciente_id: pacienteId })
      .populate('paciente_id', 'nombre usuario_id')
      .populate('medico_solicitante', 'nombre especialidad')
      .sort({ fecha_solicitud: -1 });

    res.json(examenes);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener exámenes del paciente',
      error: error.message
    });
  }
};
