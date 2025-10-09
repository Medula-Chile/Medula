const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
    },
    contraseña_hash: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    rol: {
        type: String,
        required: true,
        enum: ['paciente', 'medico', 'administrador'],
        default: 'paciente'
    },
    rut: {
        type: String,
        required: [true, 'El RUT es obligatorio'],
        unique: true,
        trim: true
    },
    fecha_registro: {
        type: Date,
        default: Date.now
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'Usuarios'
});

usuarioSchema.index({ email: 1 });
usuarioSchema.index({ rut: 1 });
usuarioSchema.index({ rol: 1 });
usuarioSchema.index({ activo: 1 });

module.exports = mongoose.model('Usuario', usuarioSchema);