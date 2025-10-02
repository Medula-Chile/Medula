import HistorialMedico from '../models/historialMedico.js';

// Crear registro de historial médico
export const crearHistorial = async (req, res) => {
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

// Obtener todo el historial médico
export const obtenerHistorial = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, paciente_id, profesional_id } = req.query;
        const skip = (pagina - 1) * limite;

        let filtro = {};
        if (paciente_id) filtro.paciente_id = paciente_id;
        if (profesional_id) filtro.profesional_id = profesional_id;

        const historial = await HistorialMedico.find(filtro)
            .populate('paciente_id', 'nombre usuario_id')
            .populate('profesional_id', 'nombre')
            .skip(skip)
            .limit(parseInt(limite))
            .sort({ fecha: -1 });

        const total = await HistorialMedico.countDocuments(filtro);

        res.json({
            historial,
            pagina: parseInt(pagina),
            totalPaginas: Math.ceil(total / limite),
            totalRegistros: total
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener historial médico',
            error: error.message
        });
    }
};

// Obtener historial por ID
export const obtenerHistorialPorId = async (req, res) => {
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

// Obtener historial por paciente
export const obtenerHistorialPorPaciente = async (req, res) => {
    try {
        const { paciente_id } = req.params;
        const { pagina = 1, limite = 10 } = req.query;
        const skip = (pagina - 1) * limite;

        const historial = await HistorialMedico.find({ paciente_id })
            .populate('profesional_id', 'nombre especialidad')
            .skip(skip)
            .limit(parseInt(limite))
            .sort({ fecha: -1 });

        const total = await HistorialMedico.countDocuments({ paciente_id });

        res.json({
            historial,
            pagina: parseInt(pagina),
            totalPaginas: Math.ceil(total / limite),
            totalRegistros: total
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener historial del paciente',
            error: error.message
        });
    }
};

// Actualizar historial
export const actualizarHistorial = async (req, res) => {
    try {
        const historialActualizado = await HistorialMedico.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('paciente_id', 'nombre usuario_id')
            .populate('profesional_id', 'nombre');

        if (!historialActualizado) {
            return res.status(404).json({ message: 'Registro de historial no encontrado' });
        }

        res.json({
            message: 'Historial médico actualizado exitosamente',
            historial: historialActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar historial médico',
            error: error.message
        });
    }
};

// Eliminar historial
export const eliminarHistorial = async (req, res) => {
    try {
        const historialEliminado = await HistorialMedico.findByIdAndDelete(req.params.id);

        if (!historialEliminado) {
            return res.status(404).json({ message: 'Registro de historial no encontrado' });
        }

        res.json({ message: 'Registro de historial eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar registro de historial',
            error: error.message
        });
    }
};