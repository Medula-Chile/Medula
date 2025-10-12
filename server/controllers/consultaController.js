const Consulta = require('../models/consulta');

// POST /api/consultas
exports.crearConsulta = async (req, res) => {
  try {
    const { consulta, receta } = req.body || {};

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
      motivo: String(consulta.motivo).trim(),
      sintomas: (consulta.sintomas || '').trim(),
      diagnostico: String(consulta.diagnostico).trim(),
      observaciones: (consulta.observaciones || '').trim(),
      tratamiento: (consulta.tratamiento || '').trim(),
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
    const { paciente, medico, desde, hasta, q } = req.query;
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

    const cs = await Consulta.find(filter).sort({ createdAt: -1 });
    res.json(cs);
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar consultas', error: error.message });
  }
};
