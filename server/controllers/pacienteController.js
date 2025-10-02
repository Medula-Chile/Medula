import Paciente from '../models/paciente.js';
import Usuario from '../models/User.js';

// Crear paciente
export const crearPaciente = async (req, res) => {
    try {
        const nuevoPaciente = new Paciente(req.body);
        const pacienteGuardado = await nuevoPaciente.save();

        // Populate para traer datos del usuario
        await pacienteGuardado.populate('usuario_id', 'nombre email Rut');

        res.status(201).json({
            message: 'Paciente creado exitosamente',
            paciente: pacienteGuardado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear paciente',
            error: error.message
        });
    }
};

// Obtener todos los pacientes
export const obtenerPacientes = async (req, res) => {
    try {
        const { pagina = 1, limite = 10 } = req.query;
        const skip = (pagina - 1) * limite;

        const pacientes = await Paciente.find()
            .populate('usuario_id', 'nombre email Rut')
            .skip(skip)
            .limit(parseInt(limite))
            .sort({ createdAt: -1 });

        const total = await Paciente.countDocuments();

        res.json({
            pacientes,
            pagina: parseInt(pagina),
            totalPaginas: Math.ceil(total / limite),
            totalPacientes: total
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener pacientes',
            error: error.message
        });
    }
};

// Obtener paciente por ID
export const obtenerPacientePorId = async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id)
            .populate('usuario_id', 'nombre email Rut');

        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.json(paciente);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener paciente',
            error: error.message
        });
    }
};

// Actualizar paciente
export const actualizarPaciente = async (req, res) => {
    try {
        const pacienteActualizado = await Paciente.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('usuario_id', 'nombre email Rut');

        if (!pacienteActualizado) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.json({
            message: 'Paciente actualizado exitosamente',
            paciente: pacienteActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar paciente',
            error: error.message
        });
    }
};

// Eliminar paciente
export const eliminarPaciente = async (req, res) => {
    try {
        const pacienteEliminado = await Paciente.findByIdAndDelete(req.params.id);

        if (!pacienteEliminado) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.json({ message: 'Paciente eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar paciente',
            error: error.message
        });
    }
};