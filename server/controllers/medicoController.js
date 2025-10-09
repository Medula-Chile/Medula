import Medico from '../models/medico.js';
import Usuario from '../models/User.js';

// Crear médico con validación de usuario único
export const crearMedico = async (req, res) => {
    try {
        const { usuario_id, especialidad, centro_id, titulo_profesional, institucion_formacion, años_experiencia, disponibilidad_horaria, contacto_directo } = req.body;

        // Verificar si el usuario ya es médico
        const medicoExistente = await Medico.findOne({ usuario_id });
        if (medicoExistente) {
            return res.status(400).json({
                message: 'Este usuario ya está registrado como médico'
            });
        }

        // Verificar que el usuario existe
        const usuarioExiste = await Usuario.findById(usuario_id);
        if (!usuarioExiste) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        // Verificar que el usuario tenga rol médico
        if (usuarioExiste.rol !== 'medico') {
            return res.status(400).json({
                message: 'El usuario debe tener rol de médico'
            });
        }

        const nuevoMedico = new Medico({
            usuario_id,
            especialidad,
            centro_id,
            titulo_profesional,
            institucion_formacion,
            años_experiencia,
            disponibilidad_horaria,
            contacto_directo
        });

        const medicoGuardado = await nuevoMedico.save();
        
        // CORRECCIÓN: Cambiar 'Rut' por 'rut'
        await medicoGuardado.populate('usuario_id', 'nombre email rut rol');
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

// Obtener todos los médicos - CORREGIDO
export const obtenerMedicos = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, especialidad, activo } = req.query;
        const skip = (pagina - 1) * limite;

        let filtro = {};
        if (especialidad) filtro.especialidad = new RegExp(especialidad, 'i');
        if (activo !== undefined) filtro.activo = activo === 'true';

        const medicos = await Medico.find(filtro)
            // CORRECCIÓN: Cambiar 'Rut' por 'rut'
            .populate('usuario_id', 'nombre email rut')
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

// Obtener médico por ID - CORREGIDO
export const obtenerMedicoPorId = async (req, res) => {
    try {
        const medico = await Medico.findById(req.params.id)
            // CORRECCIÓN: Cambiar 'Rut' por 'rut'
            .populate('usuario_id', 'nombre email rut')
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

// Actualizar médico - CORREGIDO
export const actualizarMedico = async (req, res) => {
    try {
        const { usuario_id, ...datosActualizacion } = req.body;

        if (usuario_id) {
            return res.status(400).json({
                message: 'No se puede cambiar el usuario asociado al médico'
            });
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(
            req.params.id,
            datosActualizacion,
            { new: true, runValidators: true }
        )
        // CORRECCIÓN: Cambiar 'Rut' por 'rut'
        .populate('usuario_id', 'nombre email rut')
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

// Eliminación lógica - CORREGIDO
export const toggleMedico = async (req, res) => {
    try {
        const medico = await Medico.findById(req.params.id);
        
        if (!medico) {
            return res.status(404).json({ message: 'Médico no encontrado' });
        }

        medico.activo = !medico.activo;
        const medicoActualizado = await medico.save();
        
        // CORRECCIÓN: Cambiar 'Rut' por 'rut'
        await medicoActualizado.populate('usuario_id', 'nombre email rut');
        await medicoActualizado.populate('centro_id', 'nombre direccion comuna');

        res.json({
            message: `Médico ${medicoActualizado.activo ? 'activado' : 'desactivado'} exitosamente`,
            medico: medicoActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar estado del médico',
            error: error.message
        });
    }
};

// Eliminar médico físicamente - CORREGIDO
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

// Buscar médicos - CORREGIDO
export const buscarMedicos = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ message: 'Término de búsqueda requerido' });
        }

        const medicos = await Medico.find({
            $or: [
                { especialidad: new RegExp(q, 'i') },
                { 'usuario_id.nombre': new RegExp(q, 'i') }
            ],
            activo: true
        })
        // CORRECCIÓN: Cambiar 'Rut' por 'rut'
        .populate('usuario_id', 'nombre email rut')
        .populate('centro_id', 'nombre direccion comuna')
        .limit(20)
        .sort({ createdAt: -1 });

        res.json({
            medicos,
            total: medicos.length
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al buscar médicos',
            error: error.message
        });
    }
};