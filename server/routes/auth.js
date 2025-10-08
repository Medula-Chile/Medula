const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET /api/auth/me - retorna el usuario autenticado (id, nombre, email, rol)
router.get('/me', async (req, res) => {
    try {
        const auth = req.headers.authorization || '';
        const parts = auth.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'No autenticado' });
        }
        const token = parts[1];
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_temporal');
        } catch (e) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const user = await User.findById(payload.id).select('nombre email rol');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        return res.json({
            user: {
                id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error en /auth/me:', error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { nombre, name, email, password, rut, Rut } = req.body;

        // Normalizar/aceptar alias desde el cliente
        const finalNombre = (nombre || name || '').toString().trim();
        const finalEmail = (email || '').toString().toLowerCase().trim();
        const finalRut = (Rut || rut || '').toString().trim();

        // Validaciones básicas
        if (!finalNombre || !finalEmail || !password || !finalRut) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Comprobar duplicados
        const [existsEmail, existsRut] = await Promise.all([
            User.findOne({ email: finalEmail }, '_id').lean(),
            User.findOne({ rut: finalRut }, '_id').lean()
        ]);

        if (existsEmail) return res.status(409).json({ message: 'El email ya está registrado' });
        if (existsRut) return res.status(409).json({ message: 'El RUT ya está registrado' });

        // Hash de contraseña
        const salt = await bcrypt.genSalt(10);
        const contraseña_hash = await bcrypt.hash(password, salt);

        // Crear usuario con rol por defecto 'paciente'
        const user = await User.create({
            nombre: finalNombre,
            email: finalEmail,
            contraseña_hash,
            rol: 'paciente',
            rut: finalRut
        });

        return res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: {
                id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

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

        // Verificar si el rol coincide (normalizando valores y aceptando alias)
        const incomingRol = (rol || '').toString().toLowerCase();
        const normalizedRol = incomingRol === 'doctor' ? 'medico' : incomingRol;
        const userRol = (user.rol || '').toString().toLowerCase();
        if (userRol !== normalizedRol) {
            console.log('Rol no coincide. Esperado:', normalizedRol, 'Actual:', userRol);
            return res.status(401).json({ message: 'Tipo de usuario incorrecto' });
        }

        // Verificar contraseña: bcrypt si hay hash; fallback (dev) a texto plano si existe user.password
        let isPasswordValid = false;
        if (user.contraseña_hash) {
            isPasswordValid = await bcrypt.compare(password, user.contraseña_hash);
        } else if (user.password) {
            isPasswordValid = password === user.password;
        }
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si la cuenta está activa (solo bloquear si es explícitamente false)
        if (user.estado === false) {
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
