const mongoose = require('mongoose');

const citaMedicaSchema = new mongoose.Schema({
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
  centro_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CentroSalud',
    required: [true, 'El ID del centro de salud es obligatorio']
  },
  fecha_hora: {
    type: Date,
    required: [true, 'La fecha y hora son obligatorias']
  },
  motivo: {
    type: String,
    required: [true, 'El motivo de la cita es obligatorio'],
    trim: true,
    maxlength: [500, 'El motivo no puede exceder los 500 caracteres']
  },
  estado: {
    type: String,
    enum: ['programada', 'confirmada', 'completada', 'cancelada', 'no_asistio'],
    default: 'programada'
  },
  notas: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las notas no pueden exceder los 1000 caracteres']
  }
}, {
  timestamps: true,
  collection: 'citas'
});

citaMedicaSchema.index({ paciente_id: 1 });
citaMedicaSchema.index({ profesional_id: 1 });
citaMedicaSchema.index({ centro_id: 1 });
citaMedicaSchema.index({ fecha_hora: 1 });
citaMedicaSchema.index({ estado: 1 });

module.exports = mongoose.model('CitaMedica', citaMedicaSchema);