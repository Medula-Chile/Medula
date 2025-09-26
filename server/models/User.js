const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        lowercase: true
    },
    contraseña_hash: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    rol: {
        type: String,
        enum: ['paciente', 'medico', 'admin'],
        default: 'paciente'
    },
    rut: {
        type: String,
        required: [true, 'El RUT es requerido'],
        unique: true,
        trim: true
    },
    fecha_registro: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'Usuarios' // Especificamos el nombre exacto de la colección en MongoDB
});

const User = mongoose.model('User', userSchema);

module.exports = User;
