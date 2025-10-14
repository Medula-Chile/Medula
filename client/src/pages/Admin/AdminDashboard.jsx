import React, { useEffect, useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import api from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Table, Badge, ListGroup, ListGroupItem, Alert } from 'react-bootstrap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pacientes: 0,
    medicos: 0,
    consultas: 0,
    citas: 0,
    examenes: 0,
    recetas: 0,
    citasHoy: 0,
    citasPendientes: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentExamenes, setRecentExamenes] = useState([]);
  const [estadisticasCitas, setEstadisticasCitas] = useState({
    programada: 0,
    confirmada: 0,
    completada: 0,
    cancelada: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [pacientesRes, medicosRes, consultasRes, citasRes, examenesRes, recetasRes] = await Promise.allSettled([
          api.get('/pacientes'),
          api.get('/medicos'),
          api.get('/consultas'),
          api.get('/citas'),
          api.get('/examenes'),
          api.get('/recetas'),
        ]);

        const pacientesArr = pacientesRes.status === 'fulfilled' 
          ? (Array.isArray(pacientesRes.value.data) ? pacientesRes.value.data : (pacientesRes.value.data?.pacientes || []))
          : [];
        
        const medicosArr = medicosRes.status === 'fulfilled'
          ? (Array.isArray(medicosRes.value.data) ? medicosRes.value.data : (medicosRes.value.data?.medicos || []))
          : [];
        
        const consultasArr = consultasRes.status === 'fulfilled'
          ? (Array.isArray(consultasRes.value.data) ? consultasRes.value.data : (consultasRes.value.data?.consultas || []))
          : [];
        
        const citasArr = citasRes.status === 'fulfilled'
          ? (Array.isArray(citasRes.value.data) ? citasRes.value.data : (citasRes.value.data?.citas || []))
          : [];
        
        const examenesArr = examenesRes.status === 'fulfilled'
          ? (Array.isArray(examenesRes.value.data) ? examenesRes.value.data : (examenesRes.value.data?.examenes || []))
          : [];
        
        const recetasArr = recetasRes.status === 'fulfilled'
          ? (Array.isArray(recetasRes.value.data) ? recetasRes.value.data : (recetasRes.value.data?.recetas || []))
          : [];

        // Calcular estadísticas de citas
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);

        const citasHoy = citasArr.filter(c => {
          const fecha = new Date(c.fecha_hora || c.fecha);
          return fecha >= hoy && fecha < manana;
        }).length;

        const citasPendientes = citasArr.filter(c => 
          c.estado === 'programada' || c.estado === 'confirmada'
        ).length;

        // Estadísticas por estado
        const estadisticas = citasArr.reduce((acc, cita) => {
          const estado = cita.estado || 'programada';
          acc[estado] = (acc[estado] || 0) + 1;
          return acc;
        }, {});

        setStats({
          pacientes: pacientesArr.length,
          medicos: medicosArr.length,
          consultas: consultasArr.length,
          citas: citasArr.length,
          examenes: examenesArr.length,
          recetas: recetasArr.length,
          citasHoy,
          citasPendientes,
        });

        setEstadisticasCitas({
          programada: estadisticas.programada || 0,
          confirmada: estadisticas.confirmada || 0,
          completada: estadisticas.completada || 0,
          cancelada: estadisticas.cancelada || 0,
        });

        // Pacientes recientes: tomar últimos 10 por createdAt si existe
        const recent = pacientesArr
          .slice()
          .sort((a,b)=> new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
          .slice(0, 10)
          .map(p => ({
            _id: p._id,
            nombre: p?.usuario_id?.nombre || p?.usuario?.nombre || p?.nombre || 'N/A',
            doctorName: p?.medico?.nombre || p?.medico_asignado?.nombre || 'N/A',
            fecha_admision: p?.createdAt || new Date().toISOString(),
            enfermedad: p?.diagnostico || 'N/A',
            numero_habitacion: p?.habitacion || '—',
          }));
        setRecentPatients(recent);

        // Próximas citas: próximos 7 días
        const upcoming = citasArr
          .filter(c => {
            const fecha = new Date(c.fecha_hora || c.fecha);
            return fecha >= new Date() && (c.estado === 'programada' || c.estado === 'confirmada');
          })
          .sort((a,b)=> new Date(a?.fecha_hora || a?.fecha || 0) - new Date(b?.fecha_hora || b?.fecha || 0))
          .slice(0, 5)
          .map(c => ({
            _id: c._id,
            pacienteNombre: c?.paciente_id?.usuario_id?.nombre || c?.paciente_id?.usuario?.nombre || c?.paciente_nombre || 'Paciente',
            medicoNombre: c?.profesional_id?.nombre || 'Médico',
            motivo: c?.motivo || 'Consulta',
            fecha: c?.fecha_hora || c?.fecha || new Date().toISOString(),
          }));
        setUpcomingAppointments(upcoming);

        // Exámenes recientes
        const recentExams = examenesArr
          .slice()
          .sort((a,b)=> new Date(b?.fecha_solicitud || 0) - new Date(a?.fecha_solicitud || 0))
          .slice(0, 5)
          .map(e => ({
            _id: e._id,
            tipo: e.tipo_examen,
            paciente: e?.paciente_id?.usuario_id?.nombre || 'Paciente',
            estado: e.estado,
            fecha: e.fecha_solicitud,
          }));
        setRecentExamenes(recentExams);

      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Datos para gráfico de citas por estado
  const citasEstadoData = {
    labels: ['Programadas', 'Confirmadas', 'Completadas', 'Canceladas'],
    datasets: [
      {
        label: 'Citas por Estado',
        data: [
          estadisticasCitas.programada,
          estadisticasCitas.confirmada,
          estadisticasCitas.completada,
          estadisticasCitas.cancelada,
        ],
        backgroundColor: [
          'rgba(255, 193, 7, 0.6)',
          'rgba(13, 202, 240, 0.6)',
          'rgba(25, 135, 84, 0.6)',
          'rgba(220, 53, 69, 0.6)',
        ],
        borderColor: [
          'rgba(255, 193, 7, 1)',
          'rgba(13, 202, 240, 1)',
          'rgba(25, 135, 84, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-0">Dashboard Administrador</h2>
          <p className="text-muted">Resumen general del sistema</p>
        </div>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="fas fa-users fa-2x text-primary mb-2"></i>
              <h3 className="mb-0">{stats.pacientes}</h3>
              <small className="text-muted">Pacientes</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="fas fa-user-md fa-2x text-success mb-2"></i>
              <h3 className="mb-0">{stats.medicos}</h3>
              <small className="text-muted">Médicos</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="fas fa-calendar-check fa-2x text-info mb-2"></i>
              <h3 className="mb-0">{stats.citas}</h3>
              <small className="text-muted">Citas Totales</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="fas fa-calendar-day fa-2x text-warning mb-2"></i>
              <h3 className="mb-0">{stats.citasHoy}</h3>
              <small className="text-muted">Citas Hoy</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="fas fa-flask fa-2x text-danger mb-2"></i>
              <h3 className="mb-0">{stats.examenes}</h3>
              <small className="text-muted">Exámenes</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="fas fa-prescription fa-2x text-secondary mb-2"></i>
              <h3 className="mb-0">{stats.recetas}</h3>
              <small className="text-muted">Recetas</small>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de citas y próximas citas */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0"><i className="fas fa-chart-pie"></i> Citas por Estado</h5>
            </div>
            <div className="card-body">
              <Doughnut data={citasEstadoData} options={{ maintainAspectRatio: true, responsive: true }} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0"><i className="fas fa-calendar-alt"></i> Próximas Citas</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {upcomingAppointments.length === 0 ? (
                <p className="text-muted text-center py-4">No hay citas próximas</p>
              ) : (
                <div className="list-group list-group-flush">
                  {upcomingAppointments.map((appt) => (
                    <div key={appt._id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{appt.pacienteNombre}</h6>
                          <p className="mb-1 small text-muted">
                            <i className="fas fa-user-md"></i> {appt.medicoNombre}
                          </p>
                          <p className="mb-0 small">{appt.motivo}</p>
                        </div>
                        <span className="badge bg-primary">{new Date(appt.fecha).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pacientes recientes y exámenes recientes */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0"><i className="fas fa-user-plus"></i> Pacientes Recientes</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-sm mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Fecha Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="text-center text-muted py-3">No hay pacientes recientes</td>
                      </tr>
                    ) : (
                      recentPatients.map((patient) => (
                        <tr key={patient._id}>
                          <td>{patient.nombre}</td>
                          <td className="small text-muted">{new Date(patient.fecha_admision).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0"><i className="fas fa-flask"></i> Exámenes Recientes</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-sm mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Tipo</th>
                      <th>Paciente</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentExamenes.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-3">No hay exámenes recientes</td>
                      </tr>
                    ) : (
                      recentExamenes.map((exam) => (
                        <tr key={exam._id}>
                          <td><span className="badge bg-info text-dark">{exam.tipo}</span></td>
                          <td className="small">{exam.paciente}</td>
                          <td>
                            <span className={`badge ${
                              exam.estado === 'solicitado' ? 'bg-warning text-dark' : 
                              exam.estado === 'realizado' ? 'bg-success' : 
                              exam.estado === 'entregado' ? 'bg-primary' : 'bg-secondary'
                            }`}>
                              {exam.estado}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
