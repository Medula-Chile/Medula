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
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pacientes: 0,
    medicos: 0,
    atenciones: 0,
    rating: 4.2,
    websiteTraffic: 27542,
    activeDoctors: 275,
    activePatients: 1685,
    openHealthQuestions: 18,
    openInvoices: 1685,
  });

  const [hospitalSurveyData, setHospitalSurveyData] = useState({
    newPatients: [],
    oldPatients: [],
  });

  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const pacientesRes = await api.get('/admin/count-pacientes');
        const medicosRes = await api.get('/admin/count-medicos');
        const atencionesRes = await api.get('/admin/count-atenciones');
        // Fetch other stats as needed from backend or mock here

        setStats(prev => ({
          ...prev,
          pacientes: pacientesRes.data.count,
          medicos: medicosRes.data.count,
          atenciones: atencionesRes.data.count,
        }));

        // Fetch recent patients
        const recentPatientsRes = await api.get('/admin/recent-patients');
        setRecentPatients(recentPatientsRes.data);

        // Fetch upcoming appointments
        const upcomingAppointmentsRes = await api.get('/admin/upcoming-appointments');
        setUpcomingAppointments(upcomingAppointmentsRes.data);

        // Fetch notifications
        const notificationsRes = await api.get('/admin/notifications');
        setNotifications(notificationsRes.data);

        // Fetch hospital survey data (mock or real)
        setHospitalSurveyData({
          newPatients: [120, 150, 170, 140, 180, 200, 220, 210, 230, 250, 270, 300],
          oldPatients: [100, 130, 160, 120, 150, 170, 190, 180, 200, 220, 240, 260],
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    }
    fetchStats();
  }, []);

  const overallRating = stats.rating;
  const websiteTraffic = stats.websiteTraffic;
  const activeDoctors = stats.activeDoctors;
  const activePatients = stats.activePatients;
  const openHealthQuestions = stats.openHealthQuestions;
  const openInvoices = stats.openInvoices;

  const hospitalSurveyLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const hospitalSurveyChartData = {
    labels: hospitalSurveyLabels,
    datasets: [
      {
        label: 'Nuevos Pacientes',
        data: hospitalSurveyData.newPatients,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Pacientes Antiguos',
        data: hospitalSurveyData.oldPatients,
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const overallRatingData = {
    labels: ['Calificación'],
    datasets: [
      {
        label: 'Calificación General',
        data: [overallRating],
        backgroundColor: ['#ffc107'],
      },
    ],
  };

  const websiteTrafficData = {
    labels: ['Tráfico del Sitio Web'],
    datasets: [
      {
        label: 'Visitantes',
        data: [websiteTraffic],
        backgroundColor: ['#007bff'],
      },
    ],
  };

  return (
    <div className="container mt-3">
      <h1>Dashboard Administrador</h1>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5>Calificación General</h5>
            <Doughnut data={overallRatingData} />
            <p>{overallRating} / 5.0</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5>Tráfico del Sitio Web</h5>
            <Bar data={websiteTrafficData} />
            <p>{websiteTraffic} Visitantes Únicos</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5>Médicos Activos</h5>
            <h3>{activeDoctors}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5>Pacientes Activos</h5>
            <h3>{activePatients}</h3>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card p-3">
            <h5>Encuesta del Hospital</h5>
            <Line data={hospitalSurveyChartData} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Preguntas de Salud Abiertas</h5>
            <h3>{openHealthQuestions}</h3>
            <h5>Facturas Abiertas</h5>
            <h3>{openInvoices}</h3>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Pacientes Recientes</h5>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Médico Asignado</th>
                  <th>Fecha de Admisión</th>
                  <th>Enfermedad</th>
                  <th>Número de Habitación</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((patient, idx) => (
                  <tr key={patient._id}>
                    <td>{idx + 1}</td>
                    <td>{patient.nombre}</td>
                    <td>{patient.doctorName || 'N/A'}</td>
                    <td>{new Date(patient.fecha_admision).toLocaleDateString()}</td>
                    <td>{patient.enfermedad || 'N/A'}</td>
                    <td>{patient.numero_habitacion || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <h5>Citas Próximas</h5>
            <ListGroup>
              {upcomingAppointments.map((appt) => (
                <ListGroupItem key={appt._id}>
                  <strong>{appt.pacienteNombre}</strong> - {appt.especialidad} <br />
                  {new Date(appt.fecha).toLocaleString()}
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>

          <div className="card p-3 mt-3">
            <h5>Notificaciones</h5>
            {notifications.length === 0 ? (
              <Alert variant="info">No hay nuevas notificaciones</Alert>
            ) : (
              <ListGroup>
                {notifications.map((note, idx) => (
                  <ListGroupItem key={idx}>{note}</ListGroupItem>
                ))}
              </ListGroup>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
