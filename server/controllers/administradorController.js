const Administrador = require('../models/administrador');
const Paciente = require('../models/paciente');
const Medico = require('../models/medico');
const CitaMedica = require('../models/citas');
const Receta = require('../models/receta');
const Examen = require('../models/examen');

exports.crearAdministrador = async (req, res) => {
  try {
    const nuevoAdministrador = new Administrador(req.body);
    const administradorGuardado = await nuevoAdministrador.save();

    await administradorGuardado.populate('usuario_id', 'nombre email Rut');

    res.status(201).json({
      message: 'Administrador creado exitosamente',
      administrador: administradorGuardado
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear administrador',
      error: error.message
    });
  }
};

exports.obtenerAdministradores = async (req, res) => {
  try {
    const administradores = await Administrador.find()
      .populate('usuario_id', 'nombre email Rut')
      .sort({ createdAt: -1 });

    res.json(administradores);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener administradores',
      error: error.message
    });
  }
};

// Obtener pacientes asignados a médicos (via citas activas)
exports.obtenerPacientesAsignados = async (req, res) => {
  try {
    const citas = await CitaMedica.find({ estado: { $in: ['programada', 'confirmada'] } })
      .populate('paciente_id', 'usuario_id')
      .populate('profesional_id', 'nombre')
      .populate({
        path: 'paciente_id',
        populate: { path: 'usuario_id', select: 'nombre email' }
      });

    const asignaciones = citas.map(cita => ({
      paciente: cita.paciente_id.usuario_id.nombre,
      paciente_id: cita.paciente_id._id,
      medico: cita.profesional_id.nombre,
      medico_id: cita.profesional_id._id,
      centro_id: cita.centro_id,
      fecha: cita.fecha_hora,
      estado: cita.estado
    }));

    res.json(asignaciones);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener pacientes asignados',
      error: error.message
    });
  }
};

// Asignar paciente a médico (crear cita)
exports.asignarPacienteAMedico = async (req, res) => {
  try {
    const { paciente_id, medico_id, centro_id, fecha_hora, motivo } = req.body;

    const nuevaCita = new CitaMedica({
      paciente_id,
      profesional_id: medico_id,
      centro_id,
      fecha_hora,
      motivo: motivo || 'Asignación administrativa'
    });

    await nuevaCita.save();

    res.status(201).json({
      message: 'Paciente asignado exitosamente',
      cita: nuevaCita
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al asignar paciente',
      error: error.message
    });
  }
};

// Desasignar paciente de médico (cancelar cita)
exports.desasignarPacienteDeMedico = async (req, res) => {
  try {
    const { paciente_id, medico_id } = req.body;

    const cita = await CitaMedica.findOneAndUpdate(
      { paciente_id, profesional_id: medico_id, estado: { $in: ['programada', 'confirmada'] } },
      { estado: 'cancelada' },
      { new: true }
    );

    if (!cita) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    res.json({
      message: 'Paciente desasignado exitosamente',
      cita
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al desasignar paciente',
      error: error.message
    });
  }
};

// Crear receta
exports.crearReceta = async (req, res) => {
  try {
    const nuevaReceta = new Receta(req.body);
    await nuevaReceta.save();

    res.status(201).json({
      message: 'Receta creada exitosamente',
      receta: nuevaReceta
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear receta',
      error: error.message
    });
  }
};

// Crear cita
exports.crearCita = async (req, res) => {
  try {
    const nuevaCita = new CitaMedica(req.body);
    await nuevaCita.save();

    res.status(201).json({
      message: 'Cita creada exitosamente',
      cita: nuevaCita
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear cita',
      error: error.message
    });
  }
};

// Obtener exámenes
exports.obtenerExamenes = async (req, res) => {
  try {
    const examenes = await Examen.find()
      .populate('paciente_id', 'usuario_id')
      .populate('medico_solicitante', 'usuario_id')
      .populate('medico_realizador', 'usuario_id')
      .populate({
        path: 'paciente_id',
        populate: { path: 'usuario_id', select: 'nombre' }
      })
      .populate({
        path: 'medico_solicitante',
        populate: { path: 'usuario_id', select: 'nombre' }
      })
      .populate({
        path: 'medico_realizador',
        populate: { path: 'usuario_id', select: 'nombre' }
      })
      .sort({ fecha_solicitud: -1 });

    res.json(examenes);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener exámenes',
      error: error.message
    });
  }
};

// Editar examen
exports.editarExamen = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const examen = await Examen.findByIdAndUpdate(id, updates, { new: true });

    if (!examen) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }

    res.json({
      message: 'Examen actualizado exitosamente',
      examen
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al editar examen',
      error: error.message
    });
  }
};

// Obtener pacientes asignados a un médico específico
exports.obtenerPacientesPorMedico = async (req, res) => {
  try {
    const { medicoId } = req.params;

    const citas = await CitaMedica.find({
      profesional_id: medicoId,
      estado: { $in: ['programada', 'confirmada'] }
    })
      .populate('paciente_id', 'usuario_id')
      .populate({
        path: 'paciente_id',
        populate: { path: 'usuario_id', select: 'nombre email Rut' }
      });

    const pacientes = citas.map(cita => cita.paciente_id);

    res.json(pacientes);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener pacientes del médico',
      error: error.message
    });
  }
};
