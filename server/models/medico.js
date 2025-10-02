const mongoose = require('mongoose');

const medicoSchema = new mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID de usuario es obligatorio'],
        unique: true
    },
    especialidad: {
        type: String,
        required: [true, 'La especialidad es obligatoria'],
        trim: true
    },
    centro_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CentroSalud',
        required: [true, 'El centro de salud es obligatorio']
    },
    titulo_profesional: {
        type: String,
        required: [true, 'El título profesional es obligatorio'],
        trim: true
    },
    institucion_formacion: {
        type: String,
        required: [true, 'La institución de formación es obligatoria'],
        trim: true
    },
    años_experiencia: {
        type: Number,
        required: [true, 'Los años de experiencia son obligatorios'],
        min: [0, 'Los años de experiencia no pueden ser negativos'],
        max: [60, 'Los años de experiencia no pueden exceder 60']
    },
    disponibilidad_horaria: {
        type: String,
        required: [true, 'La disponibilidad horaria es obligatoria'],
        trim: true
    },
    contacto_directo: {
        type: String,
        required: [true, 'El contacto directo es obligatorio'],
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'Medicos'
});

medicoSchema.index({ usuario_id: 1 });
medicoSchema.index({ centro_id: 1 });
medicoSchema.index({ especialidad: 1 });
medicoSchema.index({ activo: 1 });

module.exports = mongoose.model('Medico', medicoSchema);