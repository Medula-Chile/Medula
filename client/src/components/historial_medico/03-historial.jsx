function Historial() {
    return (
        <div className="d-flex flex-column h-100">
            <div className="d-flex flex-grow-1">
                <div className="overlay" id="sidebarOverlay"/>
                <div className="flex-grow-1 p-3 p-md-4">
                    <div className="row g-3">
                        {/* Timeline historial - 35% en desktop, 100% en móvil */}
                        <div className="col-12 col-lg-5 col-xl-4">
                            <div className="card h-100">
                                <div className="card-header bg-white pb-2">
                                    <h5 className="card-title mb-0">Mi Timeline Médico</h5>
                                </div>
                                <div className="card-body p-0">
                                    <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                                        <div className="consultation-item active">
                                            <div className="d-flex gap-3">
                                                <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0">
                                                    <i className="fas fa-heart text-primary" />
                                                </div>
                                                <div className="flex-grow-1 min-w-0">
                                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                                        <div className="flex-grow-1 min-w-0">
                                                            <h6 className="fw-medium mb-0">Medicina General</h6>
                                                            <p className="text-muted-foreground small mb-0">
                                                                Dr. Ana Silva
                                                            </p>
                                                        </div>
                                                        <span className="text-muted-foreground small fw-medium ms-2">
                                                            15 Ago 2024
                                                        </span>
                                                    </div>
                                                    <p className="text-muted-foreground small mb-1">
                                                        CESFAM Norte
                                                    </p>
                                                    <p className="small line-clamp-2 mb-0">
                                                        Control rutinario anual. Paciente en buen estado
                                                        general.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="consultation-item">
                                            <div className="d-flex gap-3">
                                                <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0">
                                                    <i className="fas fa-heart text-primary" />
                                                </div>
                                                <div className="flex-grow-1 min-w-0">
                                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                                        <div className="flex-grow-1 min-w-0">
                                                            <h6 className="fw-medium mb-0">Ginecología</h6>
                                                            <p className="text-muted-foreground small mb-0">
                                                                Dr. Carlos Mendoza
                                                            </p>
                                                        </div>
                                                        <span className="text-muted-foreground small fw-medium ms-2">
                                                            02 Jul 2024
                                                        </span>
                                                    </div>
                                                    <p className="text-muted-foreground small mb-1">
                                                        Hospital Regional
                                                    </p>
                                                    <p className="small line-clamp-2 mb-0">
                                                        Control ginecológico anual. Papanicolaou normal.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="consultation-item">
                                            <div className="d-flex gap-3">
                                                <div className="bg-primary-10 rounded-circle p-2 flex-shrink-0">
                                                    <i className="fas fa-heart text-primary" />
                                                </div>
                                                <div className="flex-grow-1 min-w-0">
                                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                                        <div className="flex-grow-1 min-w-0">
                                                            <h6 className="fw-medium mb-0">Oftalmología</h6>
                                                            <p className="text-muted-foreground small mb-0">
                                                                Dr. Roberto Sánchez
                                                            </p>
                                                        </div>
                                                        <span className="text-muted-foreground small fw-medium ms-2">
                                                            18 May 2024
                                                        </span>
                                                    </div>
                                                    <p className="text-muted-foreground small mb-1">
                                                        Hospital El Salvador
                                                    </p>
                                                    <p className="small line-clamp-2 mb-0">
                                                        Control vista. Prescripción de lentes correctivos.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Detalle consulta seleccionada - 40% en desktop, 100% en móvil */}
                        <div className="col-12 col-lg-7 col-xl-5">
                            <div className="card">
                                <div className="card-header bg-white">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="card-title mb-0">Consulta del 15 Ago 2024</h5>
                                        <span className="custom-badge border-success text-white bg-success">
                                            Completada
                                        </span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="mb-4">
                                        <h6 className="fw-medium mb-2">Diagnóstico y Observaciones</h6>
                                        <p className="text-muted-foreground small bg-gray-100 p-3 rounded">
                                            Control rutinario anual. Paciente en buen estado general.
                                        </p>
                                    </div>
                                    <div className="row mb-4 small">
                                        <div className="col-6 col-md-6 mb-2">
                                            <p className="text-muted-foreground mb-0">Especialista</p>
                                            <p className="fw-medium mb-0">Dr. Ana Silva</p>
                                        </div>
                                        <div className="col-6 col-md-6 mb-2">
                                            <p className="text-muted-foreground mb-0">Especialidad</p>
                                            <p className="fw-medium mb-0">Medicina General</p>
                                        </div>
                                        <div className="col-6 col-md-6 mb-2">
                                            <p className="text-muted-foreground mb-0">Centro médico</p>
                                            <p className="fw-medium mb-0">CESFAM Norte</p>
                                        </div>
                                        <div className="col-6 col-md-6 mb-2">
                                            <p className="text-muted-foreground mb-0">Próximo control</p>
                                            <p className="fw-medium mb-0">15 Feb 2025</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h6 className="fw-medium mb-2">Medicamentos Prescritos</h6>
                                        <div className="d-flex flex-column gap-2">
                                            <div className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                                                <i className="fas fa-pills text-success" />
                                                <span className="small">Vitaminas B12</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                                                <i className="fas fa-pills text-success" />
                                                <span className="small">Calcio 600mg</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Historial;