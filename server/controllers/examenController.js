const Examen = require('../models/Examen');

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

exports.obtenerExamenes = async (req, res) => {
  try {
    const examenes = await Examen.find()
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