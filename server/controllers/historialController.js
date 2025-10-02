const HistorialMedico = require('../models/HistorialMedico');

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