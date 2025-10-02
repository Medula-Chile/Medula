import mongoose from 'mongoose';

const pacienteSchema = new mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID de usuario es obligatorio'],
        unique: true
    },
    fecha_nacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    sexo: {
        type: String,
        required: [true, 'El sexo es obligatorio'],
        enum: ['masculino', 'femenino', 'otro']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
        trim: true,
        maxlength: [200, 'La dirección no puede exceder los 200 caracteres']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        trim: true,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Por favor ingrese un teléfono válido']
    },
    prevision: {
        type: String,
        required: [true, 'La previsión es obligatoria'],
        trim: true
    },
    alergias: [{
        type: String,
        trim: true
    }],
    enfermedades_cronicas: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true,
    collection: 'Pacientes' // Especificamos el nombre exacto de la colección en MongoDB
});

pacienteSchema.index({ usuario_id: 1 });
pacienteSchema.index({ prevision: 1 });

export default mongoose.model('Paciente', pacienteSchema);