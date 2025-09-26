const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                message: 'No autorizado',
                error: 'Token de usuario no válido'
            });
        }

        const user = await User.findById(req.user.id).select('-contraseña_hash').lean();
        console.log('Datos del usuario encontrado:', user);

        if (!user) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado',
                error: 'El usuario no existe o ha sido desactivado'
            });
        }

        if (!user.estado) {
            return res.status(403).json({
                message: 'Cuenta desactivada',
                error: 'La cuenta de usuario está desactivada'
            });
        }

        res.json(user);
    } catch (error) {
        console.error('Error en getProfile:', error);
        res.status(500).json({ 
            message: 'Error al obtener perfil',
            error: error.message 
        });
    }
};