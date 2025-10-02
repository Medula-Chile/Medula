import Medico from '../models/medico.js';

// Crear médico
export const crearMedico = async (req, res) => {
    try {
        const nuevoMedico = new Medico(req.body);
        const medicoGuardado = await nuevoMedico.save();

        await medicoGuardado.populate('usuario_id', 'nombre email Rut');
        await medicoGuardado.populate('centro_id', 'nombre direccion comuna');

        res.status(201).json({
            message: 'Médico creado exitosamente',
            medico: medicoGuardado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear médico',
            error: error.message
        });
    }
};

// Obtener todos los médicos
export const obtenerMedicos = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, especialidad, activo } = req.query;
        const skip = (pagina - 1) * limite;

        let filtro = {};
        if (especialidad) filtro.especialidad = especialidad;
        if (activo !== undefined) filtro.activo = activo === 'true';

        const medicos = await Medico.find(filtro)
            .populate('usuario_id', 'nombre email Rut')
            .populate('centro_id', 'nombre direccion comuna')
            .skip(skip)
            .limit(parseInt(limite))
            .sort({ createdAt: -1 });

        const total = await Medico.countDocuments(filtro);

        res.json({
            medicos,
            pagina: parseInt(pagina),
            totalPaginas: Math.ceil(total / limite),
            totalMedicos: total
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener médicos',
            error: error.message
        });
    }
};

// Obtener médico por ID
export const obtenerMedicoPorId = async (req, res) => {
    try {
        const medico = await Medico.findById(req.params.id)
            .populate('usuario_id', 'nombre email Rut')
            .populate('centro_id', 'nombre direccion comuna telefono');

        if (!medico) {
            return res.status(404).json({ message: 'Médico no encontrado' });
        }

        res.json(medico);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener médico',
            error: error.message
        });
    }
};

// Actualizar médico
export const actualizarMedico = async (req, res) => {
    try {
        const medicoActualizado = await Medico.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('usuario_id', 'nombre email Rut')
            .populate('centro_id', 'nombre direccion comuna');

        if (!medicoActualizado) {
            return res.status(404).json({ message: 'Médico no encontrado' });
        }

        res.json({
            message: 'Médico actualizado exitosamente',
            medico: medicoActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar médico',
            error: error.message
        });
    }
};

// Eliminar médico
export const eliminarMedico = async (req, res) => {
    try {
        const medicoEliminado = await Medico.findByIdAndDelete(req.params.id);

        if (!medicoEliminado) {
            return res.status(404).json({ message: 'Médico no encontrado' });
        }

        res.json({ message: 'Médico eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar médico',
            error: error.message
        });
    }
};