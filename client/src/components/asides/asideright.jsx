function AsideRight() {
    return (
        <>
            {/* Widgets estado actual - 25% en desktop, 100% en móvil */}
            <div className="col-12 col-xl-3">
                {/* Alergias */}
                <div className="alert border-destructive bg-destructive-5 d-flex align-items-center">
                    <i className="fas fa-exclamation-triangle text-destructive me-3" />
                    <div className="text-destructive small">
                        <strong>ALERGIAS:</strong>
                        <br />
                        Penicilina
                    </div>
                </div>
                {/* Signos vitales */}
                <div className="card mb-3">
                    <div className="card-header bg-white pb-2">
                        <h6 className="card-title mb-0">Signos Vitales</h6>
                    </div>
                    <div className="card-body">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <i className="fas fa-heart text-danger" />
                            <div className="flex-grow-1">
                                <p className="text-muted-foreground small mb-0">Presión</p>
                                <p className="small fw-medium mb-0">120/80</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <i className="fas fa-thermometer-half text-primary" />
                            <div className="flex-grow-1">
                                <p className="text-muted-foreground small mb-0">Temperatura</p>
                                <p className="small fw-medium mb-0">36.5°C</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <i className="fas fa-heartbeat text-success" />
                            <div className="flex-grow-1">
                                <p className="text-muted-foreground small mb-0">Pulso</p>
                                <p className="small fw-medium mb-0">72 bpm</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Medicamentos actuales */}
                <div className="card mb-3">
                    <div className="card-header bg-white pb-2">
                        <h6 className="card-title mb-0">Medicamentos Activos</h6>
                    </div>
                    <div className="card-body">
                        <div className="d-flex align-items-center gap-2 small mb-2">
                            <i className="fas fa-pills text-success small" />
                            <span>Vitaminas prenatales</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 small mb-2">
                            <i className="fas fa-pills text-success small" />
                            <span>Ácido fólico 5mg</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 small">
                            <i className="fas fa-pills text-success small" />
                            <span>Calcio 600mg</span>
                        </div>
                    </div>
                </div>
                {/* Acciones rápidas */}
                <div className="card mb-3">
                    <div className="card-header bg-white pb-2">
                        <h6 className="card-title mb-0">Acciones</h6>
                    </div>
                    <div className="card-body">
                        <button className="btn btn-outline-secondary w-100 btn-sm mb-2 d-flex align-items-center">
                            <i className="fas fa-download small me-2" />
                            <span className="small">Descargar Recetas</span>
                        </button>
                        <button className="btn btn-outline-secondary w-100 btn-sm d-flex align-items-center">
                            <i className="fas fa-phone small me-2" />
                            <span className="small">Telemedicina</span>
                        </button>
                    </div>
                </div>
                {/* Próxima cita */}
                <div className="card bg-gray-100">
                    <div className="card-body p-3">
                        <div className="d-flex flex-column gap-2">
                            <div className="d-flex align-items-center gap-2">
                                <i className="fas fa-calendar text-muted small" />
                                <span className="small fw-medium text-muted">Próxima cita</span>
                            </div>
                            <div className="small text-muted">
                                <p className="mb-0">25 Ago 2024 • 10:30</p>
                                <p className="mb-0">Dr. Juan Pérez</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AsideRight