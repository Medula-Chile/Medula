import Especialidad from '../models/especialidad.js';

// Crear especialidad
export const crearEspecialidad = async (req, res) => {
  try {
    const nuevaEspecialidad = new Especialidad(req.body);
    const especialidadGuardada = await nuevaEspecialidad.save();
    
    res.status(201).json({
      message: 'Especialidad creada exitosamente',
      especialidad: especialidadGuardada
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear especialidad',
      error: error.message
    });
  }
};

// Obtener todas las especialidades
export const obtenerEspecialidades = async (req, res) => {
  try {
    const { pagina = 1, limite = 10, activo, area_clinica } = req.query;
    const skip = (pagina - 1) * limite;
    
    let filtro = {};
    if (activo !== undefined) filtro.activo = activo === 'true';
    if (area_clinica) filtro.area_clinica = new RegExp(area_clinica, 'i');

    const especialidades = await Especialidad.find(filtro)
      .skip(skip)
      .limit(parseInt(limite))
      .sort({ nombre: 1 });

    const total = await Especialidad.countDocuments(filtro);

    res.json({
      especialidades,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(total / limite),
      totalEspecialidades: total
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener especialidades',
      error: error.message
    });
  }
};

// Obtener especialidad por ID
export const obtenerEspecialidadPorId = async (req, res) => {
  try {
    const especialidad = await Especialidad.findById(req.params.id);
    
    if (!especialidad) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    res.json(especialidad);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener especialidad',
      error: error.message
    });
  }
};

// Actualizar especialidad
export const actualizarEspecialidad = async (req, res) => {
  try {
    const especialidadActualizada = await Especialidad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!especialidadActualizada) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    res.json({
      message: 'Especialidad actualizada exitosamente',
      especialidad: especialidadActualizada
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar especialidad',
      error: error.message
    });
  }
};

// Eliminar especialidad
export const eliminarEspecialidad = async (req, res) => {
  try {
    const especialidadEliminada = await Especialidad.findByIdAndDelete(req.params.id);
    
    if (!especialidadEliminada) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    res.json({ message: 'Especialidad eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar especialidad',
      error: error.message
    });
  }
};