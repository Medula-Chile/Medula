const mongoose = require('mongoose');

const ConsultaRecetaMedicamentoSchema = new mongoose.Schema({
  medicamento_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicamento' },
  nombre: { type: String, required: true, trim: true },
  dosis: { type: String, required: true, trim: true },
  frecuencia: { type: String, required: true, trim: true },
  duracion: { type: String, required: true, trim: true },
  instrucciones: { type: String, trim: true, maxlength: 500 },
}, { _id: false });

const RecetaSchema = new mongoose.Schema({
  paciente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  medico_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fecha_emision: { type: Date, default: Date.now },
  medicamentos: { type: [ConsultaRecetaMedicamentoSchema], default: [] },
  indicaciones: { type: String, trim: true, maxlength: 1000 },
  activa: { type: Boolean, default: true },
}, { _id: false });

const ConsultaSchema = new mongoose.Schema({
  // vínculo con la cita para poder recuperar la consulta por cita
  cita_id: { type: mongoose.Schema.Types.ObjectId, index: true, default: null },
  motivo: { type: String, required: true, trim: true },
  sintomas: { type: String, trim: true },
  diagnostico: { type: String, required: true, trim: true },
  observaciones: { type: String, trim: true },
  tratamiento: { type: String, trim: true },
  examenes: { type: [String], default: [] },
  licencia: {
    otorga: { type: Boolean, default: false },
    dias: { type: Number, default: null },
    nota: { type: String, trim: true, default: '' }
  },
  receta: { type: RecetaSchema, default: null },
}, {
  timestamps: true,
  collection: 'Consultas'
});

module.exports = mongoose.model('Consulta', ConsultaSchema);
