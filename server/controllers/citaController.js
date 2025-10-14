const CitaMedica = require('../models/citas');

exports.crearCita = async (req, res) => {
    try {
        // Validación: evitar doble reserva para el mismo profesional en la misma fecha/hora
        const { profesional_id, fecha_hora } = req.body;
        if (!profesional_id || !fecha_hora) {
            return res.status(400).json({ message: 'profesional_id y fecha_hora son requeridos' });
        }

        const conflicto = await CitaMedica.findOne({ profesional_id, fecha_hora: new Date(fecha_hora) });
        if (conflicto) {
            return res.status(409).json({ message: 'El profesional ya tiene una cita en esa fecha y hora' });
        }

        const nuevaCita = new CitaMedica(req.body);
        const citaGuardada = await nuevaCita.save();

        await citaGuardada.populate({
            path: 'paciente_id',
            populate: { path: 'usuario_id', select: 'nombre rut' }
        });
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
        const { profesional, estado, desde, hasta, paciente } = req.query;
        const q = {};
        if (profesional) q.profesional_id = profesional;
        if (estado) q.estado = estado;
        if (desde || hasta) {
            q.fecha_hora = {};
            if (desde) q.fecha_hora.$gte = new Date(desde);
            if (hasta) q.fecha_hora.$lte = new Date(hasta);
        }
        // Nota: para filtrar por paciente por nombre se requeriría agregación/texto; aquí se soporta por id exacto si se pasa
        if (paciente) q.paciente_id = paciente;

        const citas = await CitaMedica.find(q)
            .populate({
                path: 'paciente_id',
                populate: { path: 'usuario_id', select: 'nombre rut' }
            })
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
            .populate({
                path: 'paciente_id',
                populate: { path: 'usuario_id', select: 'nombre rut' }
            })
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
        // Validación de solape al actualizar (excluye la misma cita)
        const { profesional_id, fecha_hora } = req.body;
        if (profesional_id && fecha_hora) {
            const conflicto = await CitaMedica.findOne({
                _id: { $ne: req.params.id },
                profesional_id,
                fecha_hora: new Date(fecha_hora)
            });
            if (conflicto) {
                return res.status(409).json({ message: 'El profesional ya tiene una cita en esa fecha y hora' });
            }
        }

        const citaActualizada = await CitaMedica.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate({
                path: 'paciente_id',
                populate: { path: 'usuario_id', select: 'nombre rut' }
            })
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

exports.getCitasByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const citas = await CitaMedica.find({ profesional_id: doctorId })
            .populate({
                path: 'paciente_id',
                populate: { path: 'usuario_id', select: 'nombre rut' }
            })
            .populate('profesional_id', 'nombre')
            .populate('centro_id', 'nombre direccion')
            .sort({ fecha_hora: 1 });

        res.json(citas);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener citas del doctor',
            error: error.message
        });
    }
};
