import React, { useMemo, useState } from 'react';
import Timeline from './Timeline';
import ConsultationDetail from './ConsultationDetail';
import ActiveMedicationsCard from '../shared/ActiveMedicationsCard';
import QuickActionsCard from '../shared/QuickActionsCard';
import NextAppointmentCard from '../shared/NextAppointmentCard';

export default function HistorialPage() {
  // Página principal del historial médico del paciente.
  // Se compone de 3 columnas:
  // - Izquierda: Timeline (lista de consultas con resumen).
  // - Centro: Detalle de la consulta seleccionada.
  // - Derecha: Tarjetas informativas (medicamentos/acciones/próxima cita).
  const [activeId, setActiveId] = useState(1);

  // Datos de ejemplo (mock) para el timeline. En producción, esto vendría del backend.
  // Se usa useMemo para no recrear el arreglo en cada render.
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

  // Consulta activa seleccionada en base al id.
  const consulta = timelineItems.find((x) => x.id === activeId);

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-5 col-xl-4">
        {/* Timeline de consultas (lista clickeable) */}
        <Timeline items={timelineItems} activeId={activeId} onSelect={setActiveId} />
      </div>

      <div className="col-12 col-lg-7 col-xl-5">
        {/* Panel central que muestra el detalle de la consulta seleccionada */}
        <ConsultationDetail consulta={consulta} />
      </div>

      <div className="col-12 col-xl-3">
        {/* Columna derecha con alertas y tarjetas informativas */}
        <div className="alert border-destructive bg-destructive-5 d-flex align-items-center">
          <i className="fas fa-exclamation-triangle text-destructive me-3"></i>
          <div className="text-destructive small">
            <strong>ALERGIAS:</strong>
            <br />
            Penicilina
          </div>
        </div>

        {/* Tarjeta con lista de medicamentos activos (carga desde mock) */}
        <ActiveMedicationsCard />

        {/* Acciones rápidas (botones demo) */}
        <QuickActionsCard />

        {/* Próxima cita destacada */}
        <NextAppointmentCard fechaHora="25 Ago 2024 • 10:30" medico="Dr. Juan Pérez" />
      </div>
    </div>
  );
}

