const mongoose = require('mongoose');

const recetaSchema = new mongoose.Schema({
    paciente_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente',
        required: [true, 'El ID del paciente es obligatorio']
    },
    medico_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
        required: [true, 'El ID del médico es obligatorio']
    },
    fecha_emision: {
        type: Date,
        default: Date.now
    },
    medicamentos: [{
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        dosis: {
            type: String,
            required: true,
            trim: true
        },
        frecuencia: {
            type: String,
            required: true,
            trim: true
        },
        duracion: {
            type: String,
            required: true,
            trim: true
        },
        instrucciones: {
            type: String,
            trim: true
        }
    }],
    indicaciones: {
        type: String,
        trim: true,
        maxlength: [1000, 'Las indicaciones no pueden exceder los 1000 caracteres']
    },
    activa: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'Recetas'
});

recetaSchema.index({ paciente_id: 1 });
recetaSchema.index({ medico_id: 1 });
recetaSchema.index({ fecha_emision: -1 });
recetaSchema.index({ activa: 1 });

module.exports = mongoose.model('Receta', recetaSchema);