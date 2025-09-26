import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PacienteShell from './components/paciente/layout/PacienteShell';
import HistorialPage from './components/paciente/historial/HistorialPage';
import MedicamentosPage from './components/paciente/medicamentos/MedicamentosPage';
import RecetasPage from './components/paciente/recetas/RecetasPage';
import PerfilPage from './components/paciente/perfil/PerfilPage';
import ConfiguracionPage from './components/paciente/configuracion/ConfiguracionPage';
import PlaceholderPage from './components/paciente/PlaceholderPage';
import LoginPage from './components/auth/LoginPage.jsx';
import RegisterPage from './components/auth/RegisterPage.jsx';
import DoctorShell from './pages/Doctor/DoctorShell.jsx';
import DoctorInicio from './pages/Doctor/DoctorInicio.jsx';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Rutas de autenticación */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          <Route path="/paciente" element={<PacienteShell />}> 
            <Route index element={<Navigate to="historial" replace />} />
            <Route path="historial" element={<HistorialPage />} />
            <Route path="medicamentos" element={<MedicamentosPage />} />
            <Route path="recetas" element={<RecetasPage />} />
            <Route path="perfil" element={<PerfilPage />} />
            <Route path="configuracion" element={<ConfiguracionPage />} />
            <Route path="examenes" element={<PlaceholderPage title="Mis Exámenes" description="Vista en desarrollo." />} />
            <Route path="centro" element={<PlaceholderPage title="Centro Médico" description="Vista en desarrollo." />} />
          </Route>

          {/* Rutas del Médico */}
          <Route path="/doctor" element={<DoctorShell />}> 
            <Route index element={<Navigate to="inicio" replace />} />
            <Route path="inicio" element={<DoctorInicio />} />
            {/* Rutas futuras del médico: pacientes, agenda, recetas, etc. */}
          </Route>

          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
