const CitaMedica = require('../models/citas');

exports.crearCita = async (req, res) => {
    try {
        const nuevaCita = new CitaMedica(req.body);
        const citaGuardada = await nuevaCita.save();

        await citaGuardada.populate('paciente_id', 'nombre usuario_id');
        await citaGuardada.populate('profesional_id', 'nombre');
        await citaGuardada.populate('centro_id', 'nombre direccion');

        res.status(201).json({
            message: 'Cita médica creada exitosamente',
            cita: citaGuardada
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear cita médica',
            error: error.message
        });
    }
};

exports.obtenerCitas = async (req, res) => {
    try {
        const citas = await CitaMedica.find()
            .populate('paciente_id')
            .populate('profesional_id', 'nombre')
            .populate('centro_id', 'nombre direccion')
            .sort({ fecha_hora: -1 });

        res.json(citas);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener citas',
            error: error.message
        });
    }
};

exports.obtenerCitaPorId = async (req, res) => {
    try {
        const cita = await CitaMedica.findById(req.params.id)
            .populate('paciente_id')
            .populate('profesional_id', 'nombre')
            .populate('centro_id', 'nombre direccion comuna telefono');

        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        res.json(cita);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener cita',
            error: error.message
        });
    }
};

exports.actualizarCita = async (req, res) => {
    try {
        const citaActualizada = await CitaMedica.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('paciente_id')
            .populate('profesional_id', 'nombre')
            .populate('centro_id', 'nombre direccion');

        if (!citaActualizada) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        res.json({
            message: 'Cita actualizada exitosamente',
            cita: citaActualizada
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar cita',
            error: error.message
        });
    }
};

exports.eliminarCita = async (req, res) => {
    try {
        const citaEliminada = await CitaMedica.findByIdAndDelete(req.params.id);

        if (!citaEliminada) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        res.json({ message: 'Cita eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar cita',
            error: error.message
        });
    }
};