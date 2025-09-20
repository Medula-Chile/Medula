import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PacienteShell from './components/paciente/layout/PacienteShell';
import HistorialPage from './components/paciente/historial/HistorialPage';
import MedicamentosPage from './components/paciente/medicamentos/MedicamentosPage';
import RecetasPage from './components/paciente/recetas/RecetasPage';
import PerfilPage from './components/paciente/perfil/PerfilPage';
import ConfiguracionPage from './components/paciente/configuracion/ConfiguracionPage';
import PlaceholderPage from './components/paciente/PlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/paciente/historial" replace />} />

        <Route path="/paciente" element={<PacienteShell />}> 
          <Route index element={<Navigate to="historial" replace />} />
          <Route path="historial" element={<HistorialPage />} />
          <Route path="medicamentos" element={<MedicamentosPage />} />
          <Route path="recetas" element={<RecetasPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
          <Route path="examenes" element={<PlaceholderPage title="Mis Exámenes" description="Vista en desarrollo, será integrada cuando tu compañero la finalice." />} />
          <Route path="centro" element={<PlaceholderPage title="Centro Médico" description="Vista en desarrollo, será integrada cuando tu compañero la finalice." />} />
        </Route>

        <Route path="*" element={<Navigate to="/paciente/historial" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
