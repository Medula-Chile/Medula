import React, { useState, useEffect } from 'react';
import Timeline from './Timeline';
import ConsultationDetail from './ConsultationDetail';
import ActiveMedicationsCard from '../shared/ActiveMedicationsCard';
import QuickActionsCard from '../shared/QuickActionsCard';
import NextAppointmentCard from '../shared/NextAppointmentCard';
import axios from 'axios';

export default function HistorialPage() {
  const [activeId, setActiveId] = useState(null);
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alergias, setAlergias] = useState([]);
  const [enfermedadesCronicas, setEnfermedadesCronicas] = useState([]);

  // Cargar consultas del paciente desde la API
  useEffect(() => {
    const fetchConsultasPaciente = async () => {
      try {
        setLoading(true);
        
        console.log('🔍 Iniciando carga de consultas...');
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No se encontró token de autenticación. Por favor, inicia sesión nuevamente.');
          setLoading(false);
          return;
        }

        // 1. Primero obtener el paciente actual
        console.log('📝 Obteniendo datos del paciente...');
        const pacienteResponse = await axios.get('http://localhost:5000/api/pacientes/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const pacienteId = pacienteResponse.data._id;
        console.log('✅ ID del paciente:', pacienteId);

        // Poblar alergias y enfermedades crónicas desde el perfil del paciente
        try {
          const alerg = pacienteResponse?.data?.alergias;
          if (Array.isArray(alerg)) {
            setAlergias(alerg.filter(Boolean));
          } else {
            setAlergias([]);
          }
          
          const enf = pacienteResponse?.data?.enfermedades_cronicas;
          if (Array.isArray(enf)) {
            setEnfermedadesCronicas(enf.filter(Boolean));
          } else {
            setEnfermedadesCronicas([]);
          }
        } catch (_) {
          setAlergias([]);
          setEnfermedadesCronicas([]);
        }

        // 2. Obtener consultas filtrando por el ID del paciente
        console.log('🔍 Buscando consultas para paciente:', pacienteId);
        const consultasResponse = await axios.get('http://localhost:5000/api/consultas', {
          params: {
            paciente: pacienteId
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Respuesta de consultas:', consultasResponse.data);

        if (consultasResponse.data && Array.isArray(consultasResponse.data)) {
          console.log(`📊 Encontradas ${consultasResponse.data.length} consultas para el paciente`);
          
          if (consultasResponse.data.length === 0) {
            setError('No se encontraron consultas para este paciente en la base de datos.');
            setTimelineItems([]);
            setLoading(false);
            return;
          }

          // Filtrar solo consultas que tienen cita_id (consultas reales)
          const consultasConCita = consultasResponse.data.filter(consulta => 
            consulta.cita_id && consulta.cita_id !== null
          );

          console.log(`📋 Consultas con cita: ${consultasConCita.length} de ${consultasResponse.data.length}`);

          if (consultasConCita.length === 0) {
            setError('No se encontraron consultas completadas para este paciente.');
            setTimelineItems([]);
            setLoading(false);
            return;
          }

          // Transformar los datos
          const consultasTransformadas = consultasConCita.map((consulta, index) => {
            return {
              id: consulta._id,
              especialidad: consulta.receta?.medico_especialidad || 'Medicina General',
              medico: consulta.receta?.medico_id?.nombre || 'Médico no especificado',
              fecha: new Date(consulta.createdAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }),
              centro: 'Centro Médico',
              resumen: consulta.diagnostico || consulta.motivo || 'Consulta médica',
              observaciones: consulta.observaciones || consulta.diagnostico || 'Sin observaciones',
              estado: 'Completada',
              proximoControl: 'Por definir',
              medicamentos: consulta.receta?.medicamentos?.map(m => 
                `${m.nombre} ${m.dosis} • ${m.frecuencia}`
              ) || [],
              vitals: {
                presion: '—',
                temperatura: '—',
                pulso: '—'
              },
              recetaId: consulta.recetaId || consulta.receta?._id || null,
              diagnostico: consulta.diagnostico,
              sintomas: consulta.sintomas,
              tratamiento: consulta.tratamiento,
              examenes: consulta.examenes || [],
              licencia: consulta.licencia,
              // Para debugging (opcional)
              _rawData: consulta
            };
          });

          console.log('📋 Consultas transformadas:', consultasTransformadas);
          setTimelineItems(consultasTransformadas);
          
          if (consultasTransformadas.length > 0) {
            setActiveId(consultasTransformadas[0].id);
          }
        } else {
          setError('No se encontraron consultas en el formato esperado');
          setTimelineItems([]);
        }

      } catch (err) {
        console.error('❌ Error cargando consultas:', err);
        console.error('❌ Detalles del error:', err.response?.data);
        
        if (err.response?.status === 401) {
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        } else if (err.response?.status === 404) {
          setError('No se encontró el paciente o no tiene consultas.');
        } else {
          setError(`Error al cargar consultas: ${err.message}`);
        }
        
        // Datos mock SOLO para desarrollo
        if (process.env.NODE_ENV === 'development') {
          const mockItems = getMockTimelineItems();
          setTimelineItems(mockItems);
          if (mockItems.length > 0) {
            setActiveId(mockItems[0].id);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConsultasPaciente();
  }, []);

  // Datos mock SOLO para desarrollo
  const getMockTimelineItems = () => [
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
    }
  ];

  const handleReload = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  const consulta = timelineItems.find((x) => x.id === activeId);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando historial...</span>
        </div>
        <span className="ms-2">Cargando historial médico...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning" role="alert">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <button className="btn btn-sm btn-outline-primary" onClick={handleReload}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (timelineItems.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
        <h4>No hay consultas registradas</h4>
        <p className="text-muted">Aún no tienes consultas médicas completadas en tu historial.</p>
        <button className="btn btn-primary" onClick={handleReload}>
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-5 col-xl-4">
        <Timeline 
          items={timelineItems} 
          activeId={activeId} 
          onSelect={setActiveId} 
          loading={loading}
        />
      </div>

      <div className="col-12 col-lg-7 col-xl-5">
        <ConsultationDetail consulta={consulta} />
      </div>

      <div className="col-12 col-xl-3">
        {/* Alergias del paciente (dinámicas) */}
        {alergias.length > 0 && (
          <div className="alert border-destructive bg-destructive-5 d-flex align-items-start mb-3">
            <i className="fas fa-exclamation-triangle text-destructive me-3 mt-1"></i>
            <div className="text-destructive small">
              <strong>ALERGIAS:</strong>
              <br />
              {alergias.map((a, i) => (
                <span key={`alergia-${i}`}>
                  {a}
                  {i < alergias.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Enfermedades crónicas del paciente (dinámicas) */}
        {enfermedadesCronicas.length > 0 && (
          <div className="alert border-warning bg-warning-subtle d-flex align-items-start mb-3">
            <i className="fas fa-heartbeat text-warning me-3 mt-1"></i>
            <div className="text-dark small">
              <strong>ENFERMEDADES CRÓNICAS:</strong>
              <br />
              {enfermedadesCronicas.map((e, i) => (
                <span key={`enfermedad-${i}`}>
                  {e}
                  {i < enfermedadesCronicas.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        )}

        <ActiveMedicationsCard />
      
      </div>
    </div>
  );
}