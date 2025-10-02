import Usuario from '../models/User.js';
import bcrypt from 'bcryptjs';

// Crear usuario
export const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, contraseña, rol, Rut } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({
            $or: [{ email }, { Rut }]
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
            nombre,
            email,
            contraseña_hash,
            rol,
            Rut
        });

        const usuarioGuardado = await nuevoUsuario.save();

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            usuario: {
                _id: usuarioGuardado._id,
                nombre: usuarioGuardado.nombre,
                email: usuarioGuardado.email,
                rol: usuarioGuardado.rol,
                Rut: usuarioGuardado.Rut,
                fecha_registro: usuarioGuardado.fecha_registro
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
export const obtenerUsuarios = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, rol } = req.query;
        const skip = (pagina - 1) * limite;

        let filtro = {};
        if (rol) filtro.rol = rol;

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
export const obtenerUsuarioPorId = async (req, res) => {
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
export const actualizarUsuario = async (req, res) => {
    try {
        const { nombre, email, rol, Rut } = req.body;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            { nombre, email, rol, Rut },
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
export const eliminarUsuario = async (req, res) => {
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