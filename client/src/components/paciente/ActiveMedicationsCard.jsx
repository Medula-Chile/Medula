import React from 'react';

export default function ActiveMedicationsCard({ items }) {
  return (
    <div className="card mb-3">
      <div className="card-header bg-white pb-2">
        <h6 className="card-title mb-0">Medicamentos Activos</h6>
      </div>
      <div className="card-body">
        {items.map((txt, idx) => (
          <div key={idx} className="d-flex align-items-center gap-2 small mb-2">
            <i className="fas fa-pills text-success small"></i>
            <span>{txt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
