import React from 'react';

export default function PlaceholderPage({ title = 'En construcción', description = 'Esta sección está en desarrollo.' }) {
  // Componente genérico de marcador de posición para secciones aún no implementadas.
  // Recibe un título y una descripción para contextualizar al usuario.
  return (
    <div className="card">
      <div className="card-header bg-white">
        <h5 className="card-title mb-0">{title}</h5>
      </div>
      <div className="card-body">
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
