import mongoose from 'mongoose';

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
    collection:'Recetas' // Especificamos el nombre exacto de la colección en MongoDB
});

recetaSchema.index({ paciente_id: 1 });
recetaSchema.index({ medico_id: 1 });
recetaSchema.index({ fecha_emision: -1 });
recetaSchema.index({ activa: 1 });

export default mongoose.model('Receta', recetaSchema);