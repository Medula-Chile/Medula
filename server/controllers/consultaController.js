const Consulta = require('../models/consulta');
const Receta = require('../models/receta');
const Paciente = require('../models/paciente');
const Medico = require('../models/medico');

// POST /api/consultas
exports.crearConsulta = async (req, res) => {
  try {
    const { consulta, receta, cita_id } = req.body || {};

    // Validaciones mínimas
    if (!consulta || !consulta.motivo || !consulta.diagnostico) {
      return res.status(400).json({ message: 'Motivo y diagnóstico son obligatorios' });
    }

    // Si hay receta, validar estructura
    if (receta) {
      if (!receta.paciente_id || !receta.medico_id) {
        return res.status(400).json({ message: 'Receta inválida: paciente_id y medico_id son obligatorios' });
      }
      if (!Array.isArray(receta.medicamentos) || receta.medicamentos.length === 0) {
        return res.status(400).json({ message: 'Receta inválida: debe incluir al menos un medicamento' });
      }
      // Validar campos de medicamento
      for (const m of receta.medicamentos) {
        if (!m.nombre || !m.dosis || !m.frecuencia || !m.duracion) {
          return res.status(400).json({ message: 'Cada medicamento debe incluir nombre, dosis, frecuencia y duración' });
        }
      }
    }

    const payload = {
      cita_id: cita_id || null,
      motivo: String(consulta.motivo).trim(),
      sintomas: (consulta.sintomas || '').trim(),
      diagnostico: String(consulta.diagnostico).trim(),
      observaciones: (consulta.observaciones || '').trim(),
      tratamiento: (consulta.tratamiento || '').trim(),
      examenes: Array.isArray(consulta.examenes) ? consulta.examenes.map(x => String(x).trim()).filter(Boolean) : [],
      licencia: consulta.licencia ? {
        otorga: !!consulta.licencia.otorga,
        dias: consulta.licencia.otorga ? (Number(consulta.licencia.dias) || null) : null,
        nota: consulta.licencia.otorga ? String(consulta.licencia.nota || '').trim() : ''
      } : { otorga: false, dias: null, nota: '' },
      receta: receta ? {
        paciente_id: receta.paciente_id,
        medico_id: receta.medico_id,
        fecha_emision: receta.fecha_emision ? new Date(receta.fecha_emision) : new Date(),
        medicamentos: receta.medicamentos.map(m => ({
          medicamento_id: m.medicamento_id || undefined,
          nombre: String(m.nombre).trim(),
          dosis: String(m.dosis).trim(),
          frecuencia: String(m.frecuencia).trim(),
          duracion: String(m.duracion).trim(),
          instrucciones: (m.instrucciones || '').trim(),
        })),
        indicaciones: (receta.indicaciones || '').trim(),
        activa: typeof receta.activa === 'boolean' ? receta.activa : true,
      } : null,
    };

    const doc = await Consulta.create(payload);

    // Si viene receta, persistir copia en colección Recetas para vistas de administración
    if (payload.receta) {
      try {
        // Resolver IDs correctos de Paciente y Medico por si recibimos IDs de Usuario
        let pacienteId = payload.receta.paciente_id;
        let medicoId = payload.receta.medico_id;
        try {
          // Si no existe Paciente con ese _id, intentar buscar por usuario_id
          const pById = await Paciente.findById(pacienteId).select('_id');
          if (!pById && pacienteId) {
            const pByUsuario = await Paciente.findOne({ usuario_id: pacienteId }).select('_id');
            if (pByUsuario) pacienteId = pByUsuario._id;
          }
        } catch { /* noop */ }
        try {
          const mById = await Medico.findById(medicoId).select('_id');
          if (!mById && medicoId) {
            const mByUsuario = await Medico.findOne({ usuario_id: medicoId }).select('_id');
            if (mByUsuario) medicoId = mByUsuario._id;
          }
        } catch { /* noop */ }

        const recetaDoc = new Receta({
          paciente_id: pacienteId,
          medico_id: medicoId,
          fecha_emision: payload.receta.fecha_emision || new Date(),
          medicamentos: payload.receta.medicamentos.map(m => ({
            nombre: m.nombre,
            dosis: m.dosis,
            frecuencia: m.frecuencia,
            duracion: m.duracion,
            instrucciones: m.instrucciones || ''
          })),
          indicaciones: payload.receta.indicaciones || '',
          activa: typeof payload.receta.activa === 'boolean' ? payload.receta.activa : true,
        });
        await recetaDoc.save();
        try {
          doc.recetaId = recetaDoc._id;
          await doc.save();
        } catch {}
      } catch (err) {
        console.error('Error creando Receta paralela desde Consulta:', err);
        // No interrumpir la creación de la Consulta si falla la receta paralela
      }
    }

    return res.status(201).json({ message: 'Consulta creada', consulta: doc });
  } catch (error) {
    console.error('Error creando consulta:', error);
    return res.status(500).json({ message: 'Error al crear consulta', error: error.message });
  }
};

// GET /api/consultas/:id
exports.obtenerConsulta = async (req, res) => {
  try {
    const c = await Consulta.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Consulta no encontrada' });
    res.json(c);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener consulta', error: error.message });
  }
};

// GET /api/consultas
exports.listarConsultas = async (req, res) => {
  try {
    const { paciente, medico, desde, hasta, q, cita_id, citaId } = req.query;
    const filter = {};
    if (q) {
      const rx = new RegExp(q, 'i');
      filter.$or = [{ motivo: rx }, { diagnostico: rx }, { observaciones: rx }, { tratamiento: rx }];
    }
    if (desde || hasta) {
      filter.createdAt = {};
      if (desde) filter.createdAt.$gte = new Date(desde);
      if (hasta) filter.createdAt.$lte = new Date(hasta);
    }
    if (paciente) filter['receta.paciente_id'] = paciente;
    if (medico) filter['receta.medico_id'] = medico;
    // Permitir filtrar por vínculo con cita
    if (cita_id || citaId) filter.cita_id = cita_id || citaId;

    const cs = await Consulta.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'receta.paciente_id',
        populate: { path: 'usuario_id', select: 'nombre rut' }
      })
      .populate({ path: 'receta.medico_id', select: 'nombre email' });
    res.json(cs);
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar consultas', error: error.message });
  }
};
