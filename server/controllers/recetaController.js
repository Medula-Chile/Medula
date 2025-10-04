const Receta = require('../models/receta');

exports.crearReceta = async (req, res) => {
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

exports.obtenerRecetas = async (req, res) => {
  try {
    const recetas = await Receta.find()
      .populate('paciente_id', 'nombre usuario_id')
      .populate('medico_id', 'nombre especialidad')
      .sort({ fecha_emision: -1 });

    res.json(recetas);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener recetas',
      error: error.message
    });
  }
};