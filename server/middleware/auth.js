const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Obtener el token del header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
        }

        // Verificar el token (usar fallback si no hay JWT_SECRET definido)
        const secret = process.env.JWT_SECRET || 'tu_secreto_temporal';
        const decoded = jwt.verify(token, secret);
        
        // Buscar el usuario (el modelo usa 'activo', no 'estado')
        const user = await User.findOne({ 
            _id: decoded.id,
            activo: true // Solo usuarios activos
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Agregar el usuario al request
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Por favor autentícate' });
    }
};

module.exports = auth;
