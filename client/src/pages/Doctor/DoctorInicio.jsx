import React from 'react';

export default function DoctorInicio() {
  return (
    <div className="container-fluid">
      <div className="row g-3">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Panel del Médico</h5>
              <span className="custom-badge border-success text-success">Beta</span>
            </div>
            <div className="card-body">
              <p className="text-muted-foreground mb-3">
                Bienvenido/a al panel del profesional. Aquí podrás gestionar tu agenda, pacientes y recetas.
              </p>
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <div className="p-3 border rounded bg-gray-100 d-flex align-items-center gap-3">
                    <i className="fas fa-calendar-check text-primary fa-lg" />
                    <div>
                      <p className="mb-0 small text-muted">Citas de hoy</p>
                      <p className="mb-0 fw-semibold">5</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="p-3 border rounded bg-gray-100 d-flex align-items-center gap-3">
                    <i className="fas fa-user-md text-success fa-lg" />
                    <div>
                      <p className="mb-0 small text-muted">Pacientes en sala</p>
                      <p className="mb-0 fw-semibold">2</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="p-3 border rounded bg-gray-100 d-flex align-items-center gap-3">
                    <i className="fas fa-file-prescription text-warning fa-lg" />
                    <div>
                      <p className="mb-0 small text-muted">Recetas pendientes</p>
                      <p className="mb-0 fw-semibold">3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header bg-white">
              <h6 className="mb-0">Agenda Próxima</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0 small">
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span>10:00 - Juan Pérez</span>
                  <span className="text-muted">Consulta General</span>
                </li>
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span>10:30 - María Soto</span>
                  <span className="text-muted">Controles</span>
                </li>
                <li className="d-flex justify-content-between py-2">
                  <span>11:00 - Pedro Díaz</span>
                  <span className="text-muted">Resultados</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header bg-white">
              <h6 className="mb-0">Notificaciones</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0 small">
                <li className="py-2 border-bottom d-flex align-items-center gap-2">
                  <i className="fas fa-info-circle text-primary" /> Nueva derivación recibida para revisión.
                </li>
                <li className="py-2 border-bottom d-flex align-items-center gap-2">
                  <i className="fas fa-shield-alt text-success" /> Sistema conectado de forma segura.
                </li>
                <li className="py-2 d-flex align-items-center gap-2">
                  <i className="fas fa-bell text-warning" /> Tienes 3 recetas por firmar.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
