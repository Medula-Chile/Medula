const mongoose = require('mongoose');

const especialidadSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la especialidad es obligatorio'],
        unique: true,
        trim: true,
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    area_clinica: {
        type: String,
        trim: true
    },
    codigo_estandar: {
        type: String,
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'especialidades'
});

especialidadSchema.index({ nombre: 1 });
especialidadSchema.index({ area_clinica: 1 });
especialidadSchema.index({ activo: 1 });

module.exports = mongoose.model('Especialidad', especialidadSchema);