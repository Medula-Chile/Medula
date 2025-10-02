const Especialidad = require('../models/Especialidad');

exports.crearEspecialidad = async (req, res) => {
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

exports.obtenerEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.find().sort({ nombre: 1 });
    res.json(especialidades);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener especialidades',
      error: error.message
    });
  }
};