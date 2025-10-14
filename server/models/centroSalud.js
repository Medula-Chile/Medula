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
    region: {
        type: String,
        required: [true, 'La región es obligatoria'],
        trim: true,
        enum: [
            'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
            'Valparaíso', 'Metropolitana', 'O\'Higgins', 'Maule', 'Ñuble',
            'Biobío', 'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'
        ]
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        trim: true
    },
    tipo: {
        type: String,
        required: [true, 'El tipo de centro es obligatorio'],
        enum: ['Hospital', 'CESFAM', 'SAPU', 'Consultorio', 'CECOSF', 'Posta Rural'],
        trim: true
    },
    nivel: {
        type: String,
        required: [true, 'El nivel de atención es obligatorio'],
        enum: ['Primario', 'Secundario', 'Terciario'],
        trim: true
    },
    horario: {
        type: String,
        required: [true, 'El horario es obligatorio'],
        trim: true
    },
    especialidades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Especialidad'
    }],
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'CentrosSalud'
});

centroSaludSchema.index({ nombre: 1 });
centroSaludSchema.index({ comuna: 1 });
centroSaludSchema.index({ region: 1 });
centroSaludSchema.index({ tipo: 1 });
centroSaludSchema.index({ activo: 1 });
centroSaludSchema.index({ especialidades: 1 });

module.exports = mongoose.model('CentroSalud', centroSaludSchema);