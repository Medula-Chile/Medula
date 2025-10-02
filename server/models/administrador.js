import mongoose from 'mongoose';

const administradorSchema = new mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID de usuario es obligatorio'],
        unique: true
    },
    nivel_acceso: {
        type: String,
        required: [true, 'El nivel de acceso es obligatorio'],
        enum: ['basico', 'medio', 'alto', 'super'],
        default: 'basico'
    },
    departamento: {
        type: String,
        required: [true, 'El departamento es obligatorio'],
        trim: true
    },
    fecha_contratacion: {
        type: Date,
        required: [true, 'La fecha de contratación es obligatoria']
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'Administradores' // Especificamos el nombre exacto de la colección en MongoDB
});

administradorSchema.index({ usuario_id: 1 });
administradorSchema.index({ nivel_acceso: 1 });
administradorSchema.index({ activo: 1 });

export default mongoose.model('Administrador', administradorSchema);