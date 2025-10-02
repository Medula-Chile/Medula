import CitaMedica from '../models/citas.js      ';

// Crear cita médica
export const crearCita = async (req, res) => {
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

// Obtener todas las citas
export const obtenerCitas = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, estado, paciente_id, profesional_id } = req.query;
        const skip = (pagina - 1) * limite;

        let filtro = {};
        if (estado) filtro.estado = estado;
        if (paciente_id) filtro.paciente_id = paciente_id;
        if (profesional_id) filtro.profesional_id = profesional_id;

        const citas = await CitaMedica.find(filtro)
            .populate('paciente_id')
            .populate('profesional_id', 'nombre')
            .populate('centro_id', 'nombre direccion')
            .skip(skip)
            .limit(parseInt(limite))
            .sort({ fecha_hora: -1 });

        const total = await CitaMedica.countDocuments(filtro);

        res.json({
            citas,
            pagina: parseInt(pagina),
            totalPaginas: Math.ceil(total / limite),
            totalCitas: total
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener citas',
            error: error.message
        });
    }
};

// Obtener cita por ID
export const obtenerCitaPorId = async (req, res) => {
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

// Actualizar cita
export const actualizarCita = async (req, res) => {
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

// Eliminar cita
export const eliminarCita = async (req, res) => {
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