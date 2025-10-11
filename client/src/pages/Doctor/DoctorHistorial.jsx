import React, { useMemo, useState } from 'react';
import TimeLineDoctor from './components/TimeLineDoctor';
import ConsultationDetailHistorial from './components/ConsultationDetailHistorial';
import ActiveMedicationsCard from '../../components/paciente/shared/ActiveMedicationsCard.jsx';
import QuickActionsCard from '../../components/paciente/shared/QuickActionsCard.jsx';
import NextAppointmentCard from '../../components/paciente/shared/NextAppointmentCard.jsx';

export default function DoctorHistorial() {
  // Página principal del historial médico del paciente (vista para el médico).
  // Layout en 3 columnas:
  // - Izquierda: Timeline (lista de consultas con resumen).
  // - Centro: Detalle de la consulta seleccionada.
  // - Derecha: Tarjetas informativas (medicamentos/acciones/próxima cita).

  const [activeId, setActiveId] = useState(1);
  const [q, setQ] = useState('');
  const [especialidadFilter, setEspecialidadFilter] = useState('Todas');

  // Mock de items del timeline (en producción, del backend).
  const timelineItems = useMemo(
    () => [
      {
        id: 1,
        especialidad: 'Medicina General',
        medico: 'Dr. Ana Silva',
        fecha: '15 Ago 2024',
        centro: 'CESFAM Norte',
        resumen: 'Control rutinario anual. Paciente en buen estado general.',
        observaciones: 'Control rutinario anual. Paciente en buen estado general.',
        estado: 'Completada',
        proximoControl: '15 Feb 2025',
        medicamentos: ['Paracetamol 500mg', 'Ibuprofeno 200mg', 'Omeprazol 20mg'],
        vitals: { presion: '120/80', temperatura: '36.5°C', pulso: '72 bpm' },
        recetaId: 'R-001',
      },
      {
        id: 2,
        especialidad: 'Ginecología',
        medico: 'Dr. Carlos Mendoza',
        fecha: '02 Jul 2024',
        centro: 'Hospital Regional',
        resumen: 'Control ginecológico anual. Papanicolaou normal.',
        observaciones: 'Control ginecológico anual. Papanicolaou normal.',
        estado: 'Completada',
        proximoControl: '02 Ene 2025',
        medicamentos: ['Losartán 50mg', 'Metformina 500mg'],
        vitals: { presion: null, temperatura: '36.7°C', pulso: null },
        recetaId: 'R-002',
      },
      {
        id: 3,
        especialidad: 'Oftalmología',
        medico: 'Dr. Roberto Sánchez',
        fecha: '18 May 2024',
        centro: 'Hospital El Salvador',
        resumen: 'Control vista. Prescripción de lentes correctivos.',
        observaciones: 'Prescripción de lentes correctivos.',
        estado: 'Completada',
        proximoControl: '18 Nov 2024',
        medicamentos: ['Vitamina D 1000UI', 'Calcio 600mg'],
        vitals: { presion: '110/70', temperatura: null, pulso: '68 bpm' },
        recetaId: 'R-003',
      },
      {
        id: 4,
        especialidad: 'Medicina General',
        medico: 'Dr. Juan Rivas',
        fecha: '28 Mar 2024',
        centro: 'Hospital El Salvador',
        resumen: 'Cuadro infeccioso tratado con antibiótico.',
        observaciones: 'Infección bacteriana, completar tratamiento con amoxicilina.',
        estado: 'Completada',
        proximoControl: '28 Abr 2024',
        medicamentos: ['Amoxicilina 500mg'],
        vitals: { presion: '118/76', temperatura: '37.6°C', pulso: '80 bpm' },
        recetaId: 'R-004',
      },
      {
        id: 5,
        especialidad: 'Endocrinología',
        medico: 'Dra. Marcela Pérez',
        fecha: '10 Feb 2024',
        centro: 'CESFAM Oriente',
        resumen: 'Control endocrino con ajuste terapéutico.',
        observaciones: 'Se mantiene Levotiroxina y se indica Atorvastatina.',
        estado: 'Completada',
        proximoControl: '10 May 2024',
        medicamentos: ['Levotiroxina 50mcg', 'Atorvastatina 20mg'],
        vitals: { presion: '122/82', temperatura: '36.6°C', pulso: '74 bpm' },
        recetaId: 'R-005',
      },
      {
        id: 6,
        especialidad: 'Hematología',
        medico: 'Dr. Ricardo Soto',
        fecha: '22 Jul 2024',
        centro: 'Clínica Dávila',
        resumen: 'Anemia ferropénica, suplemento de hierro.',
        observaciones: 'Control en 3 meses. Considerar efectos GI del hierro.',
        estado: 'Completada',
        proximoControl: '22 Oct 2024',
        medicamentos: ['Hierro 325mg'],
        vitals: { presion: '116/78', temperatura: '36.4°C', pulso: '70 bpm' },
        recetaId: 'R-006',
      },
      {
        id: 7,
        especialidad: 'Cardiología',
        medico: 'Dra. Paula Contreras',
        fecha: '05 Ene 2024',
        centro: 'Clínica Alemana',
        resumen: 'Control cardiológico, beta bloqueador indicado.',
        observaciones: 'Se indica Atenolol 25mg diario.',
        estado: 'Completada',
        proximoControl: '05 Abr 2024',
        medicamentos: ['Atenolol 25mg'],
        vitals: { presion: '130/85', temperatura: '36.5°C', pulso: '66 bpm' },
        recetaId: 'R-008',
      },
    ],
    []
  );

  // Especialidades únicas para filtro
  const especialidades = useMemo(() => {
    const set = new Set(timelineItems.map(i => i.especialidad).filter(Boolean));
    return ['Todas', ...Array.from(set)];
  }, [timelineItems]);

  // Filtro por texto (resumen/observaciones/centro/médico) y especialidad
  const itemsFiltrados = useMemo(() => {
    const text = q.trim().toLowerCase();
    return timelineItems.filter(i => {
      const pasaEsp = (especialidadFilter === 'Todas') || i.especialidad === especialidadFilter;
      if (!pasaEsp) return false;
      if (!text) return true;
      const hay = [
        i.resumen, i.observaciones, i.centro, i.medico, i.fecha, i.estado
      ].filter(Boolean).some(v => String(v).toLowerCase().includes(text));
      return hay;
    });
  }, [timelineItems, q, especialidadFilter]);

  // Contadores por especialidad (para contexto rápido del médico)
  const contadores = useMemo(() => {
    const map = new Map();
    for (const it of timelineItems) {
      const key = it.especialidad || '—';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()); // [ [especialidad, count], ... ]
  }, [timelineItems]);

  // Consulta activa actual
  const consulta = itemsFiltrados.find(x => x.id === activeId) || itemsFiltrados[0] || null;

  // Si cambia el filtro y el activeId quedó fuera, lo re-enfocamos al primero disponible
  React.useEffect(() => {
    if (consulta?.id !== activeId) {
      if (consulta) setActiveId(consulta.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [especialidadFilter, q, itemsFiltrados.length]);

  return (
    <div className="row g-3">
      {/* Columna izquierda: filtros + timeline */}
      <div className="col-12 col-lg-5 col-xl-4 d-flex flex-column">
        {/* Filtros rápidos */}
        <div className="card mb-3">
          <div className="card-body">
            <div className="d-flex flex-column gap-2">
              <div className="form-floating w-100">
                <input
                  type="text"
                  id="hist-q"
                  className="form-control"
                  placeholder="Buscar en historial…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  title={q || 'Buscar en historial…'}
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                />
                <label htmlFor="hist-q" className="text-break">Buscar</label>
              </div>
              <div className="form-floating w-100">
                <select
                  id="hist-esp"
                  className="form-select"
                  value={especialidadFilter}
                  onChange={(e) => setEspecialidadFilter(e.target.value)}
                >
                  {especialidades.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <label htmlFor="hist-esp" className="text-break">Especialidad</label>
              </div>

              {/* Contadores por especialidad */}
              <div className="small text-muted text-break">
                {contadores.map(([esp, n]) => (
                  <span key={esp} className="me-3">
                    <span className="badge bg-light text-dark border me-1 text-truncate" title={esp}>{esp}</span>
                    <span>{n}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline de consultas (lista clickeable) */}
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
        {/* Puedes calcular la próxima cita desde los datos si lo deseas;
           por ahora dejamos un ejemplo fijo */}
        <NextAppointmentCard fechaHora="25 Ago 2024 • 10:30" medico="Dr. Juan Pérez" />
      </div>

      {/* Reglas locales para evitar overflow en labels del form-floating */}
      <style>{`
        /* Permitir que los labels de form-floating hagan wrap en móviles */
        .form-floating > label { white-space: normal; overflow-wrap: anywhere; }
      `}</style>
    </div>
  );
}
