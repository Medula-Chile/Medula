const mongoose = require('mongoose');

const medicamentoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del medicamento es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
    },
    principio_activo: {
        type: String,
        required: [true, 'El principio activo es obligatorio'],
        trim: true
    },
    dosis: {
        type: String,
        required: [true, 'La dosis es obligatoria'],
        trim: true
    },
    presentacion: {
        type: String,
        required: [true, 'La presentación es obligatoria'],
        trim: true
    },
    laboratorio: {
        type: String,
        required: [true, 'El laboratorio es obligatorio'],
        trim: true
    },
    codigo_estandar: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
    },
    contraindicaciones: {
        type: String,
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'medicamentos'
});

medicamentoSchema.index({ nombre: 1 });
medicamentoSchema.index({ principio_activo: 1 });
medicamentoSchema.index({ laboratorio: 1 });
medicamentoSchema.index({ activo: 1 });

module.exports = mongoose.model('Medicamento', medicamentoSchema);