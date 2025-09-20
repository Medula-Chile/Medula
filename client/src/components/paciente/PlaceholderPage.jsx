import React from 'react';

export default function PlaceholderPage({ title = 'En construcción', description = 'Esta sección está en desarrollo.' }) {
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
