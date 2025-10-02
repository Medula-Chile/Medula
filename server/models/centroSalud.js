const mongoose = require('mongoose');

const centroSaludSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del centro es obligatorio'],
        trim: true,
        maxlength: [150, 'El nombre no puede exceder los 150 caracteres']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
        trim: true,
        maxlength: [200, 'La dirección no puede exceder los 200 caracteres']
    },
    comuna: {
        type: String,
        required: [true, 'La comuna es obligatoria'],
        trim: true
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        trim: true
    },
    especialidades: [{
        type: String,
        trim: true
    }],
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'centrosSalud'
});

centroSaludSchema.index({ nombre: 1 });
centroSaludSchema.index({ comuna: 1 });
centroSaludSchema.index({ activo: 1 });

module.exports = mongoose.model('CentroSalud', centroSaludSchema);