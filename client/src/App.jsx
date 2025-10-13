import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
//Página de Inicio
import LandingPage from './pages/landingPage.jsx';
// Páginas de autenticación
import LoginPage from './components/auth/LoginPage.jsx';
import RegisterPage from './components/auth/RegisterPage.jsx';
// Páginas del Paciente
import PacienteShell from './components/paciente/layout/PacienteShell';
import HistorialPage from './components/paciente/historial/HistorialPage';
import MedicamentosPage from './components/paciente/medicamentos/MedicamentosPage';
import RecetasPage from './components/paciente/recetas/RecetasPage';
import PerfilPage from './components/paciente/perfil/PerfilPage';
import ConfiguracionPage from './components/paciente/configuracion/ConfiguracionPage';
import PlaceholderPage from './components/paciente/PlaceholderPage';
import ExamenPage from './components/paciente/examenes/Examenes.jsx';
import CentroPage from './components/paciente/centro/centros.jsx';

// Páginas del Médico
import DoctorShell from './pages/Doctor/DoctorShell.jsx';
import DoctorInicio from './pages/Doctor/DoctorInicio.jsx';
import { AuthProvider } from './contexts/AuthContext';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';
import DoctorSettings from './pages/Doctor/DoctorSettings.jsx';
import DoctorSchedule from './pages/Doctor/DoctorSchedule.jsx';
import DoctorExamen from './pages/Doctor/Doctorexamenes.jsx';
import DoctorPacientes from './pages/Doctor/DoctorPacientes.jsx';
import DoctorRecetas from './pages/Doctor/DoctorRecetas.jsx';

// Importar nuevas páginas y layout para Admin
import AdminShell from './pages/Admin/AdminShell.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminPacientes from './pages/Admin/AdminPacientes.jsx';
import AdminMedicos from './pages/Admin/AdminMedicos.jsx';
import AdminRecetas from './pages/Admin/AdminRecetas.jsx';
import AdminCitas from './pages/Admin/AdminCitas.jsx';
import AdminExamenes from './pages/Admin/AdminExamenes.jsx';
import AdminUsers from './pages/Admin/AdminUsers.jsx';
import AdminEspecialidades from './pages/Admin/AdminEspecialidades.jsx';
import AdminCentrosSalud from './pages/Admin/AdminCentrosSalud.jsx';
import DoctorHistorial from './pages/Doctor/DoctorHistorial.jsx';
import AdminMedicamentos from './pages/Admin/AdminMedicamentos.jsx';
import AdminConsultas from './pages/Admin/AdminConsultas.jsx';
import AdminRecetasList from './pages/Admin/AdminRecetasList.jsx';

function App() {  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Rutas de autenticación */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          {/* Rutas del Paciente */}
          <Route path="/paciente" element={<PacienteShell />}> 
            <Route index element={<Navigate to="historial" replace />} />
            <Route path="historial" element={<HistorialPage />} />
            <Route path="medicamentos" element={<MedicamentosPage />} />
            <Route path="recetas" element={<RecetasPage />} />
            <Route path="perfil" element={<PerfilPage />} />
            <Route path="configuracion" element={<ConfiguracionPage />} />
            <Route path="examenes" element={<ExamenPage />} />
            <Route path="centro" element={<CentroPage/>} />
          </Route>

          {/* Rutas del Médico */}
          <Route path="/doctor" element={<DoctorShell />}> 
            <Route index element={<Navigate to="inicio" replace />} />
            <Route path="inicio" element={<DoctorInicio />} />
            <Route path="pacientes" element={<DoctorPacientes />} />
            <Route path="historial" element={<DoctorHistorial />} />
            <Route path="agenda" element={<DoctorSchedule />} />
            <Route path="recetas" element={<DoctorRecetas />} />
            <Route path="examenes" element={<DoctorExamen />} />
            <Route path="perfil" element={<DoctorProfile />} />
            <Route path="configuracion" element={<DoctorSettings />} />
          </Route>

          {/* Rutas del Administrador */}
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<AdminDashboard />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="pacientes" element={<AdminPacientes />} />
            <Route path="medicos" element={<AdminMedicos />} />
            <Route path="recetas" element={<AdminRecetas />} />
            <Route path="recetas/lista" element={<AdminRecetasList />} />
            <Route path="citas" element={<AdminCitas />} />
            <Route path="examenes" element={<AdminExamenes />} />
            <Route path="especialidades" element={<AdminEspecialidades />} />
            <Route path="centros" element={<AdminCentrosSalud />} />
            <Route path="medicamentos" element={<AdminMedicamentos />} />
            <Route path="consultas" element={<AdminConsultas />} />

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

