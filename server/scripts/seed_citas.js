/*
 Seed 5 citas por cada doctor entre 2025-10-13 y 2025-10-17 (una por día),
 usando pacientes distintos por doctor y datos aleatorios razonables.

 Uso:
   MONGO_URI="mongodb+srv://..." NODE_ENV=development node server/scripts/seed_citas.js
 o con npm script (ver package.json):
   npm run seed:citas
*/

const path = require('path');
// 1) Intento cargar .env desde la raíz del proyecto
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
// 2) Si no viene MONGO_URI, intentar cargar desde server/.env
if (!process.env.MONGO_URI) {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
}
const mongoose = require('mongoose');

const Cita = require('../models/citas');
const Medico = require('../models/medico');
const Paciente = require('../models/paciente');
const Especialidad = require('../models/especialidad');
const CentroSalud = require('../models/centroSalud');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Falta MONGO_URI en variables de entorno.');
  process.exit(1);
}

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

function rng(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 0x100000000;
}

function pick(arr, rnd) { return arr[Math.floor(rnd()*arr.length)]; }

// Horarios en saltos de 30 min entre 08:00 y 16:30
function randomSlot(dateBase, rnd) {
  const d = new Date(dateBase);
  const startMinutes = 8*60;     // 08:00
  const endMinutes = 16*60 + 30;  // 16:30
  const slots = [];
  for (let m = startMinutes; m <= endMinutes; m += 30) slots.push(m);
  const sel = pick(slots, rnd);
  d.setHours(Math.floor(sel/60), sel%60, 0, 0);
  return d;
}

async function main() {
  const start = new Date('2025-10-13T00:00:00.000Z');
  const days = 5; // hasta 17/10 inclusive
  const estados = ['programada', 'confirmada'];

  const rnd = rng(0xC1A0BEEF);

  await mongoose.connect(MONGO_URI, { dbName: process.env.MONGO_DB || undefined });
  console.log('✅ Conectado a MongoDB');

  const [medicos, pacientes, especialidades, centros] = await Promise.all([
    Medico.find({ activo: true }).lean(),
    Paciente.find({ activo: true }).lean(),
    Especialidad.find({ activo: true }).lean(),
    CentroSalud.find({ activo: true }).lean(),
  ]);

  if (medicos.length === 0) throw new Error('No hay médicos activos.');
  if (pacientes.length === 0) throw new Error('No hay pacientes activos.');
  if (centros.length === 0) throw new Error('No hay centros de salud activos.');

  const motivosBase = [
    'Control de crecimiento y desarrollo',
    'Consulta por migrañas',
    'Resultados de exámenes',
    'Dolor abdominal',
    'Dolor torácico',
    'Control método anticonceptivo',
    'Evaluación post operatoria',
    'Control de presión arterial',
    'Consulta general'
  ];

  let totalCreadas = 0;

  for (const med of medicos) {
    const centroId = med.centro_id || pick(centros, rnd)._id;

    for (let i = 0; i < days; i++) {
      // Una cita por día para este médico
      const dateBase = new Date(start);
      dateBase.setUTCDate(start.getUTCDate() + i);
      const fecha_hora = randomSlot(dateBase, rnd);

      // Seleccionar paciente distinto (rotando por índice con offset por médico y día)
      const idx = Math.abs((med._id?.toString().charCodeAt(0) || 0) + i) % pacientes.length;
      const paciente = pacientes[idx];

      // Motivo según especialidad si es posible
      const especName = med.especialidad || pick(especialidades.map(e => e.nombre), rnd);
      const motivo = `${pick(motivosBase, rnd)} - ${especName}`;
      const estado = pick(estados, rnd);
      const notas = `Generado automáticamente (${especName})`;

      // Evitar duplicados por profesional + fecha_hora
      const exists = await Cita.findOne({ profesional_id: med.usuario_id, fecha_hora }).select('_id').lean();
      if (exists) {
        // mover 30 minutos adelante si ocupado
        const fh2 = new Date(fecha_hora.getTime() + 30*60000);
        const exists2 = await Cita.findOne({ profesional_id: med.usuario_id, fecha_hora: fh2 }).select('_id').lean();
        if (exists2) continue; // saltar si también ocupado
        await Cita.create({
          paciente_id: paciente._id,
          profesional_id: med.usuario_id,
          centro_id: centroId,
          fecha_hora: fh2,
          motivo,
          estado,
          notas
        });
        totalCreadas++;
        continue;
      }

      await Cita.create({
        paciente_id: paciente._id,
        profesional_id: med.usuario_id,
        centro_id: centroId,
        fecha_hora,
        motivo,
        estado,
        notas
      });
      totalCreadas++;
      // pequeña pausa para no saturar
      await sleep(5);
    }
  }

  // Segunda fase: asegurar que cada paciente tenga al menos 5 citas en el rango
  const rangeStart = new Date('2025-10-13T00:00:00.000Z');
  const rangeEnd = new Date('2025-10-17T23:59:59.999Z');
  for (let pIndex = 0; pIndex < pacientes.length; pIndex++) {
    const paciente = pacientes[pIndex];
    const count = await Cita.countDocuments({ paciente_id: paciente._id, fecha_hora: { $gte: rangeStart, $lte: rangeEnd } });
    const toCreate = Math.max(0, 5 - count);
    if (toCreate === 0) continue;
    for (let k = 0; k < toCreate; k++) {
      const med = medicos[(pIndex + k) % medicos.length];
      const centroId = med.centro_id || pick(centros, rnd)._id;
      // distribuir por fechas del rango
      const dateBase = new Date(start);
      dateBase.setUTCDate(start.getUTCDate() + ((pIndex + k) % days));
      let fecha_hora = randomSlot(dateBase, rnd);
      // evitar colisión para este profesional
      for (let tries = 0; tries < 4; tries++) {
        const clash = await Cita.findOne({ profesional_id: med.usuario_id, fecha_hora }).select('_id').lean();
        if (!clash) break;
        fecha_hora = new Date(fecha_hora.getTime() + 30*60000);
      }
      const especName = med.especialidad || pick(especialidades.map(e => e.nombre), rnd);
      const motivo = `${pick(motivosBase, rnd)} - ${especName}`;
      const estado = pick(estados, rnd);
      const notas = `Generado automáticamente (${especName})`;
      await Cita.create({
        paciente_id: paciente._id,
        profesional_id: med.usuario_id,
        centro_id: centroId,
        fecha_hora,
        motivo,
        estado,
        notas
      });
      totalCreadas++;
      await sleep(5);
    }
  }

  console.log(`✅ Citas creadas: ${totalCreadas}`);
  await mongoose.disconnect();
  console.log('🔌 Desconectado');
}

main().catch(async (err) => {
  console.error('❌ Error en seed_citas:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
