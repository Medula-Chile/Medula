import mongoose from 'mongoose';

const examenSchema = new mongoose.Schema({
    paciente_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente',
        required: [true, 'El ID del paciente es obligatorio']
    },
    medico_solicitante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
        required: [true, 'El ID del médico solicitante es obligatorio']
    },
    tipo_examen: {
        type: String,
        required: [true, 'El tipo de examen es obligatorio'],
        trim: true
    },
    fecha_solicitud: {
        type: Date,
        default: Date.now
    },
    fecha_realizacion: {
        type: Date
    },
    resultado: {
        type: String,
        trim: true
    },
    archivo_adjunto: {
        type: String, // URL o path del archivo
        trim: true
    },
    estado: {
        type: String,
        enum: ['solicitado', 'realizado', 'analizado', 'entregado'],
        default: 'solicitado'
    },
    observaciones: {
        type: String,
        trim: true,
        maxlength: [1000, 'Las observaciones no pueden exceder los 1000 caracteres']
    }
}, {
    timestamps: true,
    collection: 'Examen' // Especificamos el nombre exacto de la colección en MongoDB
});

examenSchema.index({ paciente_id: 1 });
examenSchema.index({ medico_solicitante: 1 });
examenSchema.index({ tipo_examen: 1 });
examenSchema.index({ estado: 1 });
examenSchema.index({ fecha_solicitud: -1 });

export default mongoose.model('Examen', examenSchema);