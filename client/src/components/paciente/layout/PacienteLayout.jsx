import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../header/Header';
import Aside from '../../header/Aside';
import Timeline from '../historial/Timeline';
import ConsultationDetail from '../historial/ConsultationDetail';
import ActiveMedicationsCard from '../shared/ActiveMedicationsCard';
import QuickActionsCard from '../shared/QuickActionsCard';
import NextAppointmentCard from '../shared/NextAppointmentCard';

export default function PacienteLayout() {
  // Layout específico de la vista de "Historial" del paciente.
  // A diferencia de "PacienteShell" (que sólo encierra un Outlet), aquí componemos
  // directamente tres columnas: Timeline (izquierda), Detalle de consulta (centro),
  // y tarjetas informativas (derecha). Este componente puede ser usado como una
  // página concreta, mientras que "PacienteShell" sirve como contenedor común.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState(1);
  const navigate = useNavigate();

  // Datos de ejemplo para el timeline del paciente.
  // Se utilizan useMemo para evitar recalcular el arreglo en cada render.
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
        medicamentos: ['Vitaminas B12', 'Calcio 600mg'],
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
        medicamentos: [],
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
        medicamentos: [],
      },
    ],
    []
  );

  // Consulta activa seleccionada en el Timeline (según activeId).
  const consulta = timelineItems.find((x) => x.id === activeId);

  // Handlers de UI globales
  const handleToggleSidebar = () => setSidebarOpen((s) => !s);
  const handleCloseSidebar = () => setSidebarOpen(false);
  const handleLogout = () => {
    // Opcional: limpiar storage/session aquí
    // localStorage.removeItem('token');
    setSidebarOpen(false);
    navigate('/auth/login', { replace: true });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header superior reutilizable con acciones: toggle sidebar y logout */}
      <Header onToggleSidebar={handleToggleSidebar} onLogout={handleLogout} />

      <div className="d-flex flex-grow-1">
        {/* Aside (menú lateral) con navegación de la sección Paciente */}
        <Aside isOpen={sidebarOpen} onClose={handleCloseSidebar} onLogout={handleLogout} />

        {/* Contenido principal: tres columnas */}
        <main className="flex-grow-1 p-3 p-md-4">
          <div className="row g-3">
            {/* Columna izquierda: lista de consultas (Timeline) */}
            <div className="col-12 col-lg-5 col-xl-4">
              <Timeline items={timelineItems} activeId={activeId} onSelect={setActiveId} />
            </div>

            {/* Columna central: detalle de la consulta seleccionada */}
            <div className="col-12 col-lg-7 col-xl-5">
              <ConsultationDetail consulta={consulta} />
            </div>

            {/* Columna derecha: alertas y tarjetas informativas/acciones rápidas */}
            <div className="col-12 col-xl-3">
              <div className="alert border-destructive bg-destructive-5 d-flex align-items-center">
                <i className="fas fa-exclamation-triangle text-destructive me-3"></i>
                <div className="text-destructive small">
                  <strong>ALERGIAS:</strong>
                  <br />
                  Penicilina
                </div>
              </div>

              <ActiveMedicationsCard items={["Vitaminas prenatales", "Ácido fólico 5mg", "Calcio 600mg"]} />

              <QuickActionsCard />

              <NextAppointmentCard fechaHora="25 Ago 2024 • 10:30" medico="Dr. Juan Pérez" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

