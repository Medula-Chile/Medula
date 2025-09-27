const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password, rol } = req.body;

        // Validar campos requeridos
        if (!email || !password) {
            return res.status(400).json({
                message: 'Todos los campos son requeridos'
            });
        }

        console.log('Intento de login con:', { email, rol });
        
        // Buscar usuario por email
        console.log('Buscando usuario con email:', email.toLowerCase());
        
        // Primero verificamos que podemos acceder a la colección
        const count = await User.countDocuments();
        console.log('Total de usuarios en la base de datos:', count);
        
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log('Usuario encontrado:', user);

        if (!user) {
            console.log('No se encontró el usuario con email:', email);
            // Vamos a listar todos los usuarios para debug
            const allUsers = await User.find({}, 'email rol');
            console.log('Usuarios disponibles:', allUsers);
            return res.status(401).json({
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si el rol coincide
        if (user.rol !== rol) {
            console.log('Rol no coincide. Esperado:', rol, 'Actual:', user.rol);
            return res.status(401).json({
                message: 'Tipo de usuario incorrecto'
            });
        }

        // Verificar contraseña
        // En este ejemplo, estamos comparando directamente ya que mencionaste que tienes "hash123"
        // En producción, deberías usar bcrypt.compare
        if (user.contraseña_hash !== password) {
            return res.status(401).json({
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si la cuenta está activa
        if (!user.estado) {
            return res.status(401).json({
                message: 'Cuenta desactivada'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                rol: user.rol
            },
            process.env.JWT_SECRET || 'tu_secreto_temporal',
            { expiresIn: '24h' }
        );

        // Enviar respuesta
        res.json({
            token,
            user: {
                id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

module.exports = router;
