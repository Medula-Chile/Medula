const Usuario = require('../models/User');
const bcrypt = require('bcryptjs');

// Crear usuario
exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, email, contraseña, rol, rut } = req.body;

        // Validaciones
        if (!nombre || !email || !contraseña || !rol || !rut) {
            return res.status(400).json({
                message: 'Todos los campos son requeridos'
            });
        }

        if (contraseña.length < 6) {
            return res.status(400).json({
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({
            $or: [{ email: email.toLowerCase() }, { rut }]
        });

        if (usuarioExistente) {
            return res.status(400).json({
                message: 'El usuario ya existe con ese email o RUT'
            });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const contraseña_hash = await bcrypt.hash(contraseña, salt);

        const nuevoUsuario = new Usuario({
            nombre: nombre.trim(),
            email: email.toLowerCase().trim(),
            contraseña_hash,
            rol,
            rut: rut.replace(/[.-]/g, '') // Limpiar formato RUT
        });

        const usuarioGuardado = await nuevoUsuario.save();

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            usuario: {
                _id: usuarioGuardado._id,
                nombre: usuarioGuardado.nombre,
                email: usuarioGuardado.email,
                rol: usuarioGuardado.rol,
                rut: usuarioGuardado.rut,
                fecha_registro: usuarioGuardado.fecha_registro,
                activo: usuarioGuardado.activo
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, rol, activo } = req.query;
        const skip = (pagina - 1) * limite;

        let filtro = {};
        if (rol) filtro.rol = rol;
        if (activo !== undefined) filtro.activo = activo === 'true';

        const usuarios = await Usuario.find(filtro)
            .select('-contraseña_hash')
            .skip(skip)
            .limit(parseInt(limite))
            .sort({ fecha_registro: -1 });

        const total = await Usuario.countDocuments(filtro);

        res.json({
            usuarios,
            pagina: parseInt(pagina),
            totalPaginas: Math.ceil(total / limite),
            totalUsuarios: total
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id)
            .select('-contraseña_hash');

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const { nombre, email, rol, rut, contraseña } = req.body;
        const updates = { nombre, email, rol, rut };

        // Si se proporciona una nueva contraseña, hashearla
        if (contraseña) {
            if (contraseña.length < 6) {
                return res.status(400).json({
                    message: 'La contraseña debe tener al menos 6 caracteres'
                });
            }
            const salt = await bcrypt.genSalt(10);
            updates.contraseña_hash = await bcrypt.hash(contraseña, salt);
        }

        // Limpiar email y RUT
        if (email) updates.email = email.toLowerCase().trim();
        if (rut) updates.rut = rut.replace(/[.-]/g, '');

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-contraseña_hash');

        if (!usuarioActualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({
            message: 'Usuario actualizado exitosamente',
            usuario: usuarioActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

        if (!usuarioEliminado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
};

// Activar/desactivar usuario
exports.toggleUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Si el modelo no tiene campo activo, usar estado como fallback
        if (usuario.activo !== undefined) {
            usuario.activo = !usuario.activo;
        } else if (usuario.estado !== undefined) {
            usuario.estado = !usuario.estado;
        } else {
            // Si no existe ningún campo de estado, crear uno
            usuario.activo = !usuario.activo;
        }

        const usuarioActualizado = await usuario.save();
        
        res.json({
            message: `Usuario ${usuarioActualizado.activo || usuarioActualizado.estado ? 'activado' : 'desactivado'} exitosamente`,
            usuario: {
                _id: usuarioActualizado._id,
                nombre: usuarioActualizado.nombre,
                email: usuarioActualizado.email,
                rol: usuarioActualizado.rol,
                rut: usuarioActualizado.rut,
                activo: usuarioActualizado.activo,
                estado: usuarioActualizado.estado
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar estado del usuario',
            error: error.message
        });
    }
};

// Buscar usuarios
exports.buscarUsuarios = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ message: 'Término de búsqueda requerido' });
        }

        const usuarios = await Usuario.find({
            $or: [
                { nombre: new RegExp(q, 'i') },
                { email: new RegExp(q, 'i') },
                { rut: new RegExp(q, 'i') }
            ]
        })
        .select('-contraseña_hash')
        .limit(20)
        .sort({ fecha_registro: -1 });

        res.json({
            usuarios,
            total: usuarios.length
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al buscar usuarios',
            error: error.message
        });
    }
};

// Obtener estadísticas de usuarios
exports.obtenerEstadisticas = async (req, res) => {
    try {
        const totalUsuarios = await Usuario.countDocuments();
        const pacientes = await Usuario.countDocuments({ rol: 'paciente' });
        const medicos = await Usuario.countDocuments({ rol: 'medico' });
        const administradores = await Usuario.countDocuments({ rol: 'administrador' });
        const usuariosActivos = await Usuario.countDocuments({ 
            $or: [
                { activo: true },
                { estado: true }
            ] 
        });

        res.json({
            totalUsuarios,
            pacientes,
            medicos,
            administradores,
            usuariosActivos,
            usuariosInactivos: totalUsuarios - usuariosActivos
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};