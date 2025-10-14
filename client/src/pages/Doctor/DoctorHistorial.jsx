import React, { useMemo, useState } from 'react';
import TimeLineDoctor from './components/TimeLineDoctor';
import ConsultationDetailHistorial from './components/ConsultationDetailHistorial';
import ActiveMedicationsCard from '../../components/paciente/shared/ActiveMedicationsCard.jsx';
import QuickActionsCard from '../../components/paciente/shared/QuickActionsCard.jsx';
import NextAppointmentCard from '../../components/paciente/shared/NextAppointmentCard.jsx';

// === Helper: parsear "15 Ago 2024" a Date ===
const MESES_ES = {
  ene: 0, enero: 0,
  feb: 1, febrero: 1,
  mar: 2, marzo: 2,
  abr: 3, abril: 3,
  may: 4, mayo: 4,
  jun: 5, junio: 5,
  jul: 6, julio: 6,
  ago: 7, agosto: 7,
  sep: 8, sept: 8, septiembre: 8,
  oct: 9, octubre: 9,
  nov: 10, noviembre: 10,
  dic: 11, diciembre: 11,
};

function parseFechaES(fechaStr) {
  if (!fechaStr) return null;
  const parts = fechaStr.trim().split(/\s+/); // ["15","Ago","2024"]
  if (parts.length < 3) return null;
  const dia = parseInt(parts[0], 10);
  const mesKey = parts[1].toLowerCase();
  const anio = parseInt(parts[2], 10);
  const mes = MESES_ES[mesKey] ?? null;
  if (Number.isNaN(dia) || Number.isNaN(anio) || mes == null) return null;
  // Mediodía UTC para evitar problemas de zona horaria
  const d = new Date(Date.UTC(anio, mes, dia, 12, 0, 0));
  return d;
}

export default function DoctorHistorial() {
  // Estado del item activo
  const [activeId, setActiveId] = useState(1);

  // === Buscador (exacto al de Pacientes) ===
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  // Mock de timeline (en producción, del backend)
  const timelineItems = useMemo(
    () => [
      { id: 1, especialidad: 'Medicina General', medico: 'Dr. Ana Silva', fecha: '15 Ago 2024', centro: 'CESFAM Norte', resumen: 'Control rutinario anual. Paciente en buen estado general.', observaciones: 'Control rutinario anual. Paciente en buen estado general.', estado: 'Completada', proximoControl: '15 Feb 2025', medicamentos: ['Paracetamol 500mg','Ibuprofeno 200mg','Omeprazol 20mg'], vitals: { presion: '120/80', temperatura: '36.5°C', pulso: '72 bpm' }, recetaId: 'R-001' },
      { id: 2, especialidad: 'Ginecología', medico: 'Dr. Carlos Mendoza', fecha: '02 Jul 2024', centro: 'Hospital Regional', resumen: 'Control ginecológico anual. Papanicolaou normal.', observaciones: 'Control ginecológico anual. Papanicolaou normal.', estado: 'Completada', proximoControl: '02 Ene 2025', medicamentos: ['Losartán 50mg','Metformina 500mg'], vitals: { presion: null, temperatura: '36.7°C', pulso: null }, recetaId: 'R-002' },
      { id: 3, especialidad: 'Oftalmología', medico: 'Dr. Roberto Sánchez', fecha: '18 May 2024', centro: 'Hospital El Salvador', resumen: 'Control vista. Prescripción de lentes correctivos.', observaciones: 'Prescripción de lentes correctivos.', estado: 'Completada', proximoControl: '18 Nov 2024', medicamentos: ['Vitamina D 1000UI','Calcio 600mg'], vitals: { presion: '110/70', temperatura: null, pulso: '68 bpm' }, recetaId: 'R-003' },
      { id: 4, especialidad: 'Medicina General', medico: 'Dr. Juan Rivas', fecha: '28 Mar 2024', centro: 'Hospital El Salvador', resumen: 'Cuadro infeccioso tratado con antibiótico.', observaciones: 'Infección bacteriana, completar tratamiento con amoxicilina.', estado: 'Completada', proximoControl: '28 Abr 2024', medicamentos: ['Amoxicilina 500mg'], vitals: { presion: '118/76', temperatura: '37.6°C', pulso: '80 bpm' }, recetaId: 'R-004' },
      { id: 5, especialidad: 'Endocrinología', medico: 'Dra. Marcela Pérez', fecha: '10 Feb 2024', centro: 'CESFAM Oriente', resumen: 'Control endocrino con ajuste terapéutico.', observaciones: 'Se mantiene Levotiroxina y se indica Atorvastatina.', estado: 'Completada', proximoControl: '10 May 2024', medicamentos: ['Levotiroxina 50mcg','Atorvastatina 20mg'], vitals: { presion: '122/82', temperatura: '36.6°C', pulso: '74 bpm' }, recetaId: 'R-005' },
      { id: 6, especialidad: 'Hematología', medico: 'Dr. Ricardo Soto', fecha: '22 Jul 2024', centro: 'Clínica Dávila', resumen: 'Anemia ferropénica, suplemento de hierro.', observaciones: 'Control en 3 meses. Considerar efectos GI del hierro.', estado: 'Completada', proximoControl: '22 Oct 2024', medicamentos: ['Hierro 325mg'], vitals: { presion: '116/78', temperatura: '36.4°C', pulso: '70 bpm' }, recetaId: 'R-006' },
      { id: 7, especialidad: 'Cardiología', medico: 'Dra. Paula Contreras', fecha: '05 Ene 2024', centro: 'Clínica Alemana', resumen: 'Control cardiológico, beta bloqueador indicado.', observaciones: 'Se indica Atenolol 25mg diario.', estado: 'Completada', proximoControl: '05 Abr 2024', medicamentos: ['Atenolol 25mg'], vitals: { presion: '130/85', temperatura: '36.5°C', pulso: '66 bpm' }, recetaId: 'R-008' },
    ],
    []
  );

  // === Normalización a la forma que usa el buscador de Pacientes ===
  const itemsNormalizados = useMemo(() => {
    return timelineItems.map((it) => {
      const d = parseFechaES(it.fecha);
      return {
        id: it.id,
        paciente: it.medico || '—',               // Pacientes busca en "paciente", "resumen" y "centro"
        centro: it.centro || '—',
        resumen: it.resumen || it.observaciones || '—',
        estado: it.estado || 'Completada',
        when: d ? d.toISOString() : null,
        __raw: it,                                // referencia al original
      };
    });
  }, [timelineItems]);

  // === Lógica de filtrado/orden idéntica a Pacientes ===
  const filtered = useMemo(() => {
    const norm = (s) => (s || '').toString().toLowerCase();
    const qn = norm(q);
    const fromD = from ? new Date(from) : null;
    const toD = to ? new Date(to) : null;

    const inRange = (iso) => {
      if (!iso) return true;
      const d = new Date(iso);
      if (fromD && d < fromD) return false;
      if (toD) { const end = new Date(toD); end.setHours(23,59,59,999); if (d > end) return false; }
      return true;
    };

    const isToday = (iso) => {
      if (!iso) return false;
      const d = new Date(iso);
      const now = new Date();
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    };

    const cmp = (a, b) => {
      const aD = new Date(a.when || 0);
      const bD = new Date(b.when || 0);
      const aT = isToday(a.when);
      const bT = isToday(b.when);
      if (aT && !bT) return -1; // Hoy primero
      if (!aT && bT) return 1;
      if (aT && bT) return aD - bD; // Dentro de hoy: asc
      return bD - aD; // Resto: desc (futuro→pasado)
    };

    return itemsNormalizados
      .filter(it =>
        !qn ||
        norm(it.paciente).includes(qn) ||
        norm(it.resumen).includes(qn) ||
        norm(it.centro).includes(qn)
      )
      .filter(it => !estado || it.estado === estado)
      .filter(it => inRange(it.when))
      .slice()
      .sort(cmp);
  }, [itemsNormalizados, q, estado, from, to]);

  // Volver a los originales para pintar
  const itemsFiltrados = useMemo(() => filtered.map(f => f.__raw), [filtered]);

  // Consulta activa actual
  const consulta = itemsFiltrados.find(x => x.id === activeId) || itemsFiltrados[0] || null;

  // Si cambia el filtro y el activeId quedó fuera, re-enfocar
  React.useEffect(() => {
    if (consulta?.id !== activeId) {
      if (consulta) setActiveId(consulta.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, estado, from, to, itemsFiltrados.length]);

  return (
    <>
      {/* === FILTROS A TODO EL ANCHO (mismo diseño que Pacientes, pero fuera de la grilla) === */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-6 col-lg-6">
              <label className="form-label small">Buscar</label>
              <input
                className="form-control form-control-lg"
                placeholder="Paciente, centro o resumen"
                value={q}
                onChange={(e)=>setQ(e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-2">
              <label className="form-label small">Estado</label>
              <select
                className="form-select form-select-lg"
                value={estado}
                onChange={(e)=>setEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option>En espera</option>
                <option>En progreso</option>
                <option>Completado</option>
                <option>Cancelado</option>
                <option>No presentado</option>
              </select>
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <label className="form-label small">Desde</label>
              <input
                type="date"
                className="form-control form-control-lg"
                value={from}
                onChange={(e)=>setFrom(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <label className="form-label small">Hasta</label>
              <input
                type="date"
                className="form-control form-control-lg"
                value={to}
                onChange={(e)=>setTo(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* === GRILLA PRINCIPAL === */}
      <div className="row g-3">
        {/* Columna izquierda: timeline */}
        <div className="col-12 col-lg-5 col-xl-4 d-flex flex-column">
          <TimeLineDoctor
            items={itemsFiltrados}
            activeId={consulta?.id ?? activeId}
            onSelect={setActiveId}
          />
        </div>

        {/* Columna central: detalle */}
        <div className="col-12 col-lg-7 col-xl-5 d-flex">
          <ConsultationDetailHistorial consulta={consulta} />
        </div>

        {/* Columna derecha: alertas + tarjetas informativas */}
        <div className="col-12 col-xl-3 d-flex flex-column gap-3">
          <div className="alert border-destructive bg-destructive-5 d-flex align-items-center text-break">
            <i className="fas fa-exclamation-triangle text-destructive me-3"></i>
            <div className="text-destructive small">
              <span className="fw-normal">ALERGIAS:</span>
              <br />
              Penicilina
            </div>
          </div>

          <ActiveMedicationsCard />
          <QuickActionsCard />
          <NextAppointmentCard fechaHora="25 Ago 2024 • 10:30" medico="Dr. Juan Pérez" />
        </div>
      </div>
    </>
  );
}
