const HistorialMedico = require('../models/historialMedico');

exports.crearHistorial = async (req, res) => {
    try {
        const nuevoHistorial = new HistorialMedico(req.body);
        const historialGuardado = await nuevoHistorial.save();

        await historialGuardado.populate('paciente_id', 'nombre usuario_id');
        await historialGuardado.populate('profesional_id', 'nombre');

        res.status(201).json({
            message: 'Registro de historial médico creado exitosamente',
            historial: historialGuardado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear registro de historial médico',
            error: error.message
        });
    }
};

exports.obtenerHistorial = async (req, res) => {
    try {
        const historial = await HistorialMedico.find()
            .populate('paciente_id', 'nombre usuario_id')
            .populate('profesional_id', 'nombre')
            .sort({ fecha: -1 });

        res.json(historial);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener historial médico',
            error: error.message
        });
    }
};

// Obtener historial médico del paciente actual
exports.obtenerHistorialPacienteActual = async (req, res) => {
    try {
        // Primero encontrar el paciente actual
        const Paciente = require('../models/paciente');
        const paciente = await Paciente.findOne({ usuario_id: req.user.id });

        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const historial = await HistorialMedico.find({ paciente_id: paciente._id })
            .populate('paciente_id', 'usuario_id')
            .populate('profesional_id', 'nombre')
            .sort({ fecha: -1 });

        res.json(historial);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener historial médico del paciente',
            error: error.message
        });
    }
};

exports.obtenerHistorialPorId = async (req, res) => {
    try {
        const historial = await HistorialMedico.findById(req.params.id)
            .populate('paciente_id')
            .populate('profesional_id', 'nombre');

        if (!historial) {
            return res.status(404).json({ message: 'Registro de historial no encontrado' });
        }

        res.json(historial);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener registro de historial',
            error: error.message
        });
    }
};