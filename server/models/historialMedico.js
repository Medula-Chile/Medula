import mongoose from 'mongoose';

const historialMedicoSchema = new mongoose.Schema({
    paciente_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente',
        required: [true, 'El ID del paciente es obligatorio']
    },
    profesional_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID del profesional es obligatorio']
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    diagnostico: {
        type: String,
        required: [true, 'El diagnóstico es obligatorio'],
        trim: true
    },
    tratamiento: {
        type: String,
        trim: true
    },
    medicamentos: [{
        medicamento_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicamento'
        },
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
    notas: {
        type: String,
        trim: true,
        maxlength: [2000, 'Las notas no pueden exceder los 2000 caracteres']
    }
}, {
    timestamps: true,
    collection: 'Historial' // Nombre exacto de la colección en MongoDB
});

historialMedicoSchema.index({ paciente_id: 1 });
historialMedicoSchema.index({ profesional_id: 1 });
historialMedicoSchema.index({ fecha: -1 });

export default mongoose.model('HistorialMedico', historialMedicoSchema);