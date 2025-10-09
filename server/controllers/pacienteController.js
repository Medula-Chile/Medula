import Paciente from '../models/paciente.js';
import Usuario from '../models/User.js';

// Crear paciente con validaciones
export const crearPaciente = async (req, res) => {
    try {
        const { usuario_id, fecha_nacimiento, sexo, direccion, telefono, prevision, alergias, enfermedades_cronicas } = req.body;

        // Validaciones
        if (!usuario_id || !fecha_nacimiento || !sexo || !direccion || !telefono || !prevision) {
            return res.status(400).json({
                message: 'Todos los campos requeridos deben ser completados'
            });
        }

        // Verificar si el usuario ya es paciente
        const pacienteExistente = await Paciente.findOne({ usuario_id });
        if (pacienteExistente) {
            return res.status(400).json({
                message: 'Este usuario ya está registrado como paciente'
            });
        }

        // Verificar que el usuario existe
        const usuarioExiste = await Usuario.findById(usuario_id);
        if (!usuarioExiste) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        // Verificar que el usuario tenga rol paciente
        if (usuarioExiste.rol !== 'paciente') {
            return res.status(400).json({
                message: 'El usuario debe tener rol de paciente'
            });
        }

        const nuevoPaciente = new Paciente({
            usuario_id,
            fecha_nacimiento,
            sexo,
            direccion,
            telefono,
            prevision,
            alergias: alergias || [],
            enfermedades_cronicas: enfermedades_cronicas || []
        });

        const pacienteGuardado = await nuevoPaciente.save();
        
        // CORRECCIÓN: Cambiar 'Rut' por 'rut'
        await pacienteGuardado.populate('usuario_id', 'nombre email rut');

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
        const { pagina = 1, limite = 10, activo } = req.query;
        const skip = (pagina - 1) * limite;

        let filtro = {};
        if (activo !== undefined) filtro.activo = activo === 'true';

        const pacientes = await Paciente.find(filtro)
            // CORRECCIÓN: Cambiar 'Rut' por 'rut'
            .populate('usuario_id', 'nombre email rut')
            .skip(skip)
            .limit(parseInt(limite))
            .sort({ createdAt: -1 });

        const total = await Paciente.countDocuments(filtro);

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
            // CORRECCIÓN: Cambiar 'Rut' por 'rut'
            .populate('usuario_id', 'nombre email rut');

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
        const { usuario_id, ...datosActualizacion } = req.body;

        // No permitir cambiar el usuario_id
        if (usuario_id) {
            return res.status(400).json({
                message: 'No se puede cambiar el usuario asociado al paciente'
            });
        }

        const pacienteActualizado = await Paciente.findByIdAndUpdate(
            req.params.id,
            datosActualizacion,
            { new: true, runValidators: true }
        )
        // CORRECCIÓN: Cambiar 'Rut' por 'rut'
        .populate('usuario_id', 'nombre email rut');

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

// Activar/desactivar paciente
export const togglePaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id);
        
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        paciente.activo = !paciente.activo;
        const pacienteActualizado = await paciente.save();
        
        // CORRECCIÓN: Cambiar 'Rut' por 'rut'
        await pacienteActualizado.populate('usuario_id', 'nombre email rut');

        res.json({
            message: `Paciente ${pacienteActualizado.activo ? 'activado' : 'desactivado'} exitosamente`,
            paciente: pacienteActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar estado del paciente',
            error: error.message
        });
    }
};

// Buscar pacientes
export const buscarPacientes = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ message: 'Término de búsqueda requerido' });
        }

        const pacientes = await Paciente.find({
            $or: [
                { 'usuario_id.nombre': new RegExp(q, 'i') },
                { 'usuario_id.rut': new RegExp(q, 'i') }
            ]
        })
        // CORRECCIÓN: Cambiar 'Rut' por 'rut'
        .populate('usuario_id', 'nombre email rut')
        .limit(20)
        .sort({ createdAt: -1 });

        res.json({
            pacientes,
            total: pacientes.length
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al buscar pacientes',
            error: error.message
        });
    }
};

// Obtener pacientes por médico
export const obtenerPacientesPorMedico = async (req, res) => {
    try {
        const { medicoId } = req.params;
        
        // Esta función asume que tienes una relación entre médicos y pacientes
        // Por ejemplo, a través de citas o asignaciones directas
        const pacientes = await Paciente.find({})
            // CORRECCIÓN: Cambiar 'Rut' por 'rut'
            .populate('usuario_id', 'nombre email rut')
            .limit(50)
            .sort({ createdAt: -1 });

        res.json(pacientes);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener pacientes del médico',
            error: error.message
        });
    }
};

// Obtener estadísticas de pacientes
export const obtenerEstadisticasPacientes = async (req, res) => {
    try {
        const totalPacientes = await Paciente.countDocuments();
        const pacientesActivos = await Paciente.countDocuments({ activo: true });
        const pacientesPorSexo = await Paciente.aggregate([
            {
                $group: {
                    _id: '$sexo',
                    count: { $sum: 1 }
                }
            }
        ]);
        const pacientesPorPrevision = await Paciente.aggregate([
            {
                $group: {
                    _id: '$prevision',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            totalPacientes,
            pacientesActivos,
            pacientesInactivos: totalPacientes - pacientesActivos,
            pacientesPorSexo,
            pacientesPorPrevision
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};