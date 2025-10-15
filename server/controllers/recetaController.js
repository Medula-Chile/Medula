const Receta = require('../models/receta');
const Paciente = require('../models/paciente');
const Medico = require('../models/medico');

exports.crearReceta = async (req, res) => {
  try {
    const nuevaReceta = new Receta(req.body);
    const recetaGuardada = await nuevaReceta.save();
    // Popular anidado para retornar nombres utilizables en el frontend
    await recetaGuardada.populate({
      path: 'paciente_id',
      select: 'usuario_id nombre',
      populate: { path: 'usuario_id', select: 'nombre rut email' }
    });
    await recetaGuardada.populate({
      path: 'medico_id',
      select: 'usuario_id nombre especialidad email',
      populate: { path: 'usuario_id', select: 'nombre email' }
    });
    
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

// POST /api/recetas/migrate-ids
// Repara recetas antiguas cuyos paciente_id/medico_id guardaron el _id de Usuario en vez del _id de Paciente/Medico
exports.migrarIds = async (req, res) => {
  try {
    const recetas = await Receta.find({}, '_id paciente_id medico_id');
    let updated = 0;
    let unchanged = 0;
    let errors = 0;
    for (const r of recetas) {
      let changed = false;
      let nuevoPacienteId = r.paciente_id;
      let nuevoMedicoId = r.medico_id;

      // Resolver Paciente: si no existe por _id, buscar por usuario_id
      if (nuevoPacienteId) {
        try {
          const pById = await Paciente.findById(nuevoPacienteId).select('_id');
          if (!pById) {
            const pByUsuario = await Paciente.findOne({ usuario_id: nuevoPacienteId }).select('_id');
            if (pByUsuario) { nuevoPacienteId = pByUsuario._id; changed = true; }
          }
        } catch {}
      }

      // Resolver Medico: si no existe por _id, buscar por usuario_id
      if (nuevoMedicoId) {
        try {
          const mById = await Medico.findById(nuevoMedicoId).select('_id');
          if (!mById) {
            const mByUsuario = await Medico.findOne({ usuario_id: nuevoMedicoId }).select('_id');
            if (mByUsuario) { nuevoMedicoId = mByUsuario._id; changed = true; }
          }
        } catch {}
      }

      if (changed) {
        try {
          await Receta.updateOne({ _id: r._id }, { $set: { paciente_id: nuevoPacienteId, medico_id: nuevoMedicoId } });
          updated++;
        } catch (e) {
          errors++;
        }
      } else {
        unchanged++;
      }
    }

    return res.json({ message: 'Migración completada', total: recetas.length, updated, unchanged, errors });
  } catch (error) {
    return res.status(500).json({ message: 'Error en migración', error: error.message });
  }
};

exports.obtenerRecetas = async (req, res) => {
  try {
    const recetas = await Receta.find()
      .populate({
        path: 'paciente_id',
        select: 'usuario_id nombre',
        populate: { path: 'usuario_id', select: 'nombre rut email' }
      })
      .populate({
        path: 'medico_id',
        select: 'usuario_id nombre especialidad email',
        populate: { path: 'usuario_id', select: 'nombre email' }
      })
      .sort({ fecha_emision: -1 });

    res.json(recetas);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener recetas',
      error: error.message
    });
  }
};
// AGREGAR ESTE MÉTODO AL CONTROLLER
exports.obtenerRecetasPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    console.log('🔍 Buscando recetas para paciente:', pacienteId);

    // Validar que pacienteId sea un ObjectId válido
    if (!pacienteId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: 'ID de paciente no válido'
      });
    }

    // Buscar recetas por paciente_id
    let recetas = await Receta.find({ paciente_id: pacienteId })
      .populate({
        path: 'paciente_id',
        select: 'usuario_id nombre',
        populate: { path: 'usuario_id', select: 'nombre rut email' }
      })
      .populate({
        path: 'medico_id',
        select: 'usuario_id nombre especialidad email',
        populate: { path: 'usuario_id', select: 'nombre email' }
      })
      .sort({ fecha_emision: -1 });

    // Si no se encontraron recetas, intentar buscar por usuario_id (casos legacy)
    if (recetas.length === 0) {
      console.log('⚠️ No se encontraron recetas por paciente_id, buscando por usuario_id (legacy)');
      
      // Buscar si el ID corresponde a un usuario que tiene recetas
      const paciente = await Paciente.findOne({ usuario_id: pacienteId }).select('_id');
      if (paciente) {
        recetas = await Receta.find({ paciente_id: paciente._id })
          .populate({
            path: 'paciente_id',
            select: 'usuario_id nombre',
            populate: { path: 'usuario_id', select: 'nombre rut email' }
          })
          .populate({
            path: 'medico_id',
            select: 'usuario_id nombre especialidad email',
            populate: { path: 'usuario_id', select: 'nombre email' }
          })
          .sort({ fecha_emision: -1 });
      }
    }

    console.log('📋 Recetas encontradas:', recetas.length);

    if (recetas.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron recetas para este paciente',
        pacienteId: pacienteId
      });
    }

    res.json(recetas);
  } catch (error) {
    console.error('❌ Error en obtenerRecetasPorPaciente:', error);
    res.status(500).json({
      message: 'Error al obtener recetas del paciente',
      error: error.message
    });
  }
};