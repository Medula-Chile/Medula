import React from 'react';
import PacienteLayout from './PacienteLayout';

// Importa estilos globales existentes
import '../../../pages/Paciente/plantilla.css';

export default function PacientePage() {
  // Componente contenedor simple para renderizar el layout concreto del paciente.
  // Mantiene separada la importación de estilos globales asociados a la plantilla
  // y permite, si se requiere, inyectar lógica adicional alrededor de PacienteLayout.
  return <PacienteLayout />;
}
