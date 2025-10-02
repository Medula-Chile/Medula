import Receta from '../models/receta.js';

// Crear receta
export const crearReceta = async (req, res) => {
  try {
    const nuevaReceta = new Receta(req.body);
    const recetaGuardada = await nuevaReceta.save();
    
    await recetaGuardada.populate('paciente_id', 'nombre usuario_id');
    await recetaGuardada.populate('medico_id', 'nombre especialidad');
    
    res.status(201).json({
      message: 'Receta creada exitosamente',
      receta: recetaGuardada
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear receta',
      error: error.message
    });
  }
};

// Obtener todas las recetas
export const obtenerRecetas = async (req, res) => {
  try {
    const { pagina = 1, limite = 10, paciente_id, medico_id, activa } = req.query;
    const skip = (pagina - 1) * limite;
    
    let filtro = {};
    if (paciente_id) filtro.paciente_id = paciente_id;
    if (medico_id) filtro.medico_id = medico_id;
    if (activa !== undefined) filtro.activa = activa === 'true';

    const recetas = await Receta.find(filtro)
      .populate('paciente_id', 'nombre usuario_id')
      .populate('medico_id', 'nombre especialidad')
      .skip(skip)
      .limit(parseInt(limite))
      .sort({ fecha_emision: -1 });

    const total = await Receta.countDocuments(filtro);

    res.json({
      recetas,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(total / limite),
      totalRecetas: total
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener recetas',
      error: error.message
    });
  }
};

// Obtener receta por ID
export const obtenerRecetaPorId = async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id)
      .populate('paciente_id')
      .populate('medico_id', 'nombre especialidad titulo_profesional');
    
    if (!receta) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    res.json(receta);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener receta',
      error: error.message
    });
  }
};

// Obtener recetas por paciente
export const obtenerRecetasPorPaciente = async (req, res) => {
  try {
    const { paciente_id } = req.params;
    const { pagina = 1, limite = 10, activa } = req.query;
    const skip = (pagina - 1) * limite;

    let filtro = { paciente_id };
    if (activa !== undefined) filtro.activa = activa === 'true';

    const recetas = await Receta.find(filtro)
      .populate('medico_id', 'nombre especialidad')
      .skip(skip)
      .limit(parseInt(limite))
      .sort({ fecha_emision: -1 });

    const total = await Receta.countDocuments(filtro);

    res.json({
      recetas,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(total / limite),
      totalRecetas: total
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener recetas del paciente',
      error: error.message
    });
  }
};

// Actualizar receta
export const actualizarReceta = async (req, res) => {
  try {
    const recetaActualizada = await Receta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('paciente_id', 'nombre usuario_id')
    .populate('medico_id', 'nombre especialidad');

    if (!recetaActualizada) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    res.json({
      message: 'Receta actualizada exitosamente',
      receta: recetaActualizada
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar receta',
      error: error.message
    });
  }
};

// Eliminar receta
export const eliminarReceta = async (req, res) => {
  try {
    const recetaEliminada = await Receta.findByIdAndDelete(req.params.id);
    
    if (!recetaEliminada) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    res.json({ message: 'Receta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar receta',
      error: error.message
    });
  }
};