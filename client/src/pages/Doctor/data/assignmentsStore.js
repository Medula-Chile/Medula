// Simple in-memory + localStorage backed store for doctor assignments (consultations)
// Each assignment structure example:
// {
//   id: number|string,
//   paciente: string,
//   medico: string,
//   especialidad: string,
//   centro: string,
//   resumen: string,
//   estado: 'En espera'|'En progreso'|'Completado'|'Cancelado'|'No presentado',
//   when: string (ISO datetime),
//   fecha: string (display label),
//   observaciones: string,
//   proximoControl: string,
//   recetaId: string|null,
//   vitals: { presion, temperatura, pulso },
//   medicamentos: string[],
//   medicamentosDet: Array<{ nombre: string, dias?: number|null, frecuencia?: string }>,
//   examenes: string[],
//   licencia: { otorga: boolean, dias?: number|null, nota?: string }
// }

const LS_KEY = 'doctor_assignments_v1';

let assignments = [];
let listeners = new Set();

function hydrate() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) assignments = arr;
    }
  } catch {}
}

function persist() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(assignments)); } catch {}
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function emit() { listeners.forEach((fn) => { try { fn(assignments); } catch {} }); }

export function getAssignments() { return assignments.slice(); }
export function setAssignments(next) {
  assignments = Array.isArray(next) ? next.slice() : [];
  persist();
  emit();
}

export function upsertAssignment(item) {
  const idx = assignments.findIndex((x) => String(x.id) === String(item.id));
  if (idx >= 0) assignments[idx] = { ...assignments[idx], ...item };
  else assignments.unshift(item);
  persist();
  emit();
}

export function removeAssignment(id) {
  assignments = assignments.filter((x) => String(x.id) !== String(id));
  persist();
  emit();
}

export function seedIfEmpty({ doctorName, doctorSpecialty }) {
  if (assignments.length > 0) return;
  const now = new Date();
  const todayStr = now.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
  const pad = (n) => String(n).padStart(2, '0');
  const mk = (id, h, m, esp, centro, resumen) => {
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return {
      id,
      paciente: '—',
      medico: doctorName || 'Médico/a',
      especialidad: doctorSpecialty || esp || 'Medicina General',
      centro,
      resumen,
      estado: 'En espera',
      when: d.toISOString(),
      fecha: `${todayStr} • ${pad(h)}:${pad(m)}`,
      observaciones: '—',
      proximoControl: '—',
      recetaId: null,
      vitals: { presion: null, temperatura: null, pulso: null },
      medicamentos: [],
      medicamentosDet: [],
      examenes: [],
      licencia: { otorga: false, dias: null, nota: '' },
    };
  };
  const seed = [
    mk(101, 10, 0, 'Medicina General', 'Consulta 1', 'Juan Pérez, control general.'),
    mk(102, 10, 30, 'Resultados', 'Consulta 2', 'Pedro Díaz, revisión de resultados.'),
    mk(103, 11, 0, 'Ginecología', 'Consulta 3', 'Control post-tratamiento.'),
    mk(104, 11, 30, 'Cardiología', 'Consulta 4', 'Chequeo de hipertensión.'),
    mk(105, 12, 0, 'Endocrinología', 'Consulta 5', 'Ajuste terapéutico.'),
    mk(106, 12, 30, 'Hematología', 'Consulta 6', 'Control anemia ferropénica.'),
    mk(107, 13, 0, 'Oftalmología', 'Consulta 7', 'Evaluación de agudeza visual.'),
  ];
  assignments = seed;
  persist();
  emit();
}

// Initialize from localStorage immediately on module load
try { hydrate(); } catch {}
