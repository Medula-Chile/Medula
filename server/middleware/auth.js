const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Obtener el token del header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscar el usuario
        const user = await User.findOne({ 
            _id: decoded.id,
            estado: true // Solo usuarios activos
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
