import Examen from '../models/examen.js';

// Crear examen
export const crearExamen = async (req, res) => {
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

// Obtener todos los exámenes
export const obtenerExamenes = async (req, res) => {
  try {
    const { pagina = 1, limite = 10, paciente_id, medico_solicitante, estado, tipo_examen } = req.query;
    const skip = (pagina - 1) * limite;
    
    let filtro = {};
    if (paciente_id) filtro.paciente_id = paciente_id;
    if (medico_solicitante) filtro.medico_solicitante = medico_solicitante;
    if (estado) filtro.estado = estado;
    if (tipo_examen) filtro.tipo_examen = new RegExp(tipo_examen, 'i');

    const examenes = await Examen.find(filtro)
      .populate('paciente_id', 'nombre usuario_id')
      .populate('medico_solicitante', 'nombre especialidad')
      .skip(skip)
      .limit(parseInt(limite))
      .sort({ fecha_solicitud: -1 });

    const total = await Examen.countDocuments(filtro);

    res.json({
      examenes,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(total / limite),
      totalExamenes: total
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener exámenes',
      error: error.message
    });
  }
};

// Obtener examen por ID
export const obtenerExamenPorId = async (req, res) => {
  try {
    const examen = await Examen.findById(req.params.id)
      .populate('paciente_id')
      .populate('medico_solicitante', 'nombre especialidad titulo_profesional');
    
    if (!examen) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }

    res.json(examen);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener examen',
      error: error.message
    });
  }
};

// Obtener exámenes por paciente
export const obtenerExamenesPorPaciente = async (req, res) => {
  try {
    const { paciente_id } = req.params;
    const { pagina = 1, limite = 10, estado } = req.query;
    const skip = (pagina - 1) * limite;

    let filtro = { paciente_id };
    if (estado) filtro.estado = estado;

    const examenes = await Examen.find(filtro)
      .populate('medico_solicitante', 'nombre especialidad')
      .skip(skip)
      .limit(parseInt(limite))
      .sort({ fecha_solicitud: -1 });

    const total = await Examen.countDocuments(filtro);

    res.json({
      examenes,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(total / limite),
      totalExamenes: total
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener exámenes del paciente',
      error: error.message
    });
  }
};

// Actualizar examen
export const actualizarExamen = async (req, res) => {
  try {
    const examenActualizado = await Examen.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('paciente_id', 'nombre usuario_id')
    .populate('medico_solicitante', 'nombre especialidad');

    if (!examenActualizado) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }

    res.json({
      message: 'Examen actualizado exitosamente',
      examen: examenActualizado
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar examen',
      error: error.message
    });
  }
};

// Eliminar examen
export const eliminarExamen = async (req, res) => {
  try {
    const examenEliminado = await Examen.findByIdAndDelete(req.params.id);
    
    if (!examenEliminado) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }

    res.json({ message: 'Examen eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar examen',
      error: error.message
    });
  }
};