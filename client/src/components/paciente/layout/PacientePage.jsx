import React from 'react';
import PacienteLayout from './PacienteLayout';

// Estilos globales ya se cargan en main.jsx (styles.css)

export default function PacientePage() {
  // Componente contenedor simple para renderizar el layout concreto del paciente.
  // Mantiene separada la importación de estilos globales asociados a la plantilla
  // y permite, si se requiere, inyectar lógica adicional alrededor de PacienteLayout.
  return <PacienteLayout />;
}
