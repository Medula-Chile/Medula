import React from 'react';

const MisExamenes = () => {
    const solicitarDescargable = () => {
        // Tu función para solicitar descargable
    };

    const verExamen = (tipoExamen) => {
        // Tu función para ver examen
        console.log(`Viendo examen: ${tipoExamen}`);
    };

    return (
        <div className="flex-grow-1 p-3 p-md-4">
            <div className="row g-3">
                <div className="col-md-9 col-lg-10 main-content p-4">
                    <div className="content-wrapper">
                        {/* Historial Exámenes */}
                        <div className="section-content active" id="historial">
                            <div className="section-header mb-4">
                                <h1>Mis Exámenes</h1>
                                <p className="text-muted">Consulta y descarga tus resultados de exámenes médicos</p>
                            </div>

                            <div className="history-list">
                                {/* Examen 1 - Hemograma */}
                                <div className="card history-card mb-3">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="d-flex">
                                                <div className="history-icon me-3">
                                                    <svg className="icon text-primary" viewBox="0 0 24 24" width="40" height="40">
                                                        <path fill="currentColor" d="M12,2C6.5,2,2,6.5,2,12C2,17.5,6.5,22,12,22C17.5,22,22,17.5,22,12C22,6.5,17.5,2,12,2M14,17H10V15H14V14H10V12H14V7H7V17H14Z" />
                                                    </svg>
                                                </div>
                                                <div className="history-details">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h3 className="mb-0">Hemograma Completo</h3>
                                                        <span className="badge bg-success">Completado</span>
                                                    </div>
                                                    <p className="doctor mb-1"><strong>Laboratorio Central</strong></p>
                                                    <p className="diagnosis text-muted">Examen de sangre - Perfil hematológico completo</p>
                                                    <div className="d-flex gap-3 mt-2">
                                                        <span className="text-muted small"><i className="fas fa-calendar me-1"></i>15 Nov 2024</span>
                                                        <span className="text-muted small"><i className="fas fa-file-pdf me-1"></i>PDF - 2.3 MB</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column align-items-end">
                                                <button className="btn btn-primary mb-2" onClick={solicitarDescargable}>
                                                    <svg className="icon me-1" viewBox="0 0 24 24" width="18" height="18">
                                                        <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                                                    </svg>
                                                    Descargar PDF
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary eye-icon-btn"
                                                    onClick={() => verExamen('Hemograma Completo')}
                                                    aria-label="Ver examen de hemograma"
                                                >
                                                    <svg className="icon me-1" viewBox="0 0 24 24" width="18" height="18">
                                                        <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                                                    </svg>
                                                    Ver Examen
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Examen 2 - Perfil Bioquímico */}
                                <div className="card history-card mb-3">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="d-flex">
                                                <div className="history-icon me-3">
                                                    <svg className="icon text-info" viewBox="0 0 24 24" width="40" height="40">
                                                        <path fill="currentColor" d="M12,2C6.5,2,2,6.5,2,12C2,17.5,6.5,22,12,22C17.5,22,22,17.5,22,12C22,6.5,17.5,2,12,2M14,17H10V15H14V14H10V12H14V7H7V17H14Z" />
                                                    </svg>
                                                </div>
                                                <div className="history-details">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h3 className="mb-0">Perfil Bioquímico</h3>
                                                        <span className="badge bg-success">Completado</span>
                                                    </div>
                                                    <p className="doctor mb-1"><strong>Laboratorio Clínico</strong></p>
                                                    <p className="diagnosis text-muted">Glucosa, colesterol, triglicéridos, función hepática y renal</p>
                                                    <div className="d-flex gap-3 mt-2">
                                                        <span className="text-muted small"><i className="fas fa-calendar me-1"></i>10 Nov 2024</span>
                                                        <span className="text-muted small"><i className="fas fa-file-pdf me-1"></i>PDF - 1.8 MB</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column align-items-end">
                                                <button className="btn btn-primary mb-2" onClick={solicitarDescargable}>
                                                    <svg className="icon me-1" viewBox="0 0 24 24" width="18" height="18">
                                                        <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                                                    </svg>
                                                    Descargar PDF
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary eye-icon-btn"
                                                    onClick={() => verExamen('Perfil Bioquímico')}
                                                    aria-label="Ver perfil bioquímico"
                                                >
                                                    <svg className="icon me-1" viewBox="0 0 24 24" width="18" height="18">
                                                        <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                                                    </svg>
                                                    Ver Examen
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Examen 3 - Radiografía */}
                                <div className="card history-card mb-3">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="d-flex">
                                                <div className="history-icon me-3">
                                                    <svg className="icon text-warning" viewBox="0 0 24 24" width="40" height="40">
                                                        <path fill="currentColor" d="M12,2C6.5,2,2,6.5,2,12C2,17.5,6.5,22,12,22C17.5,22,22,17.5,22,12C22,6.5,17.5,2,12,2M14,17H10V15H14V14H10V12H14V7H7V17H14Z" />
                                                    </svg>
                                                </div>
                                                <div className="history-details">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h3 className="mb-0">Radiografía de Tórax</h3>
                                                        <span className="badge bg-success">Completado</span>
                                                    </div>
                                                    <p className="doctor mb-1"><strong>Servicio de Imagenología</strong></p>
                                                    <p className="diagnosis text-muted">Radiografía PA y lateral de tórax</p>
                                                    <div className="d-flex gap-3 mt-2">
                                                        <span className="text-muted small"><i className="fas fa-calendar me-1"></i>05 Nov 2024</span>
                                                        <span className="text-muted small"><i className="fas fa-image me-1"></i>DICOM - 15.2 MB</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column align-items-end">
                                                <button className="btn btn-primary mb-2" onClick={solicitarDescargable}>
                                                    <svg className="icon me-1" viewBox="0 0 24 24" width="18" height="18">
                                                        <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                                                    </svg>
                                                    Descargar Imágenes
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary eye-icon-btn"
                                                    onClick={() => verExamen('Radiografía de Tórax')}
                                                    aria-label="Ver radiografía"
                                                >
                                                    <svg className="icon me-1" viewBox="0 0 24 24" width="18" height="18">
                                                        <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                                                    </svg>
                                                    Ver Imágenes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Examen 4 - Pendiente */}
                                <div className="card history-card mb-3">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="d-flex">
                                                <div className="history-icon me-3">
                                                    <svg className="icon text-secondary" viewBox="0 0 24 24" width="40" height="40">
                                                        <path fill="currentColor" d="M12,2C6.5,2,2,6.5,2,12C2,17.5,6.5,22,12,22C17.5,22,22,17.5,22,12C22,6.5,17.5,2,12,2M14,17H10V15H14V14H10V12H14V7H7V17H14Z" />
                                                    </svg>
                                                </div>
                                                <div className="history-details">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h3 className="mb-0">Ecografía Abdominal</h3>
                                                        <span className="badge bg-warning">Pendiente</span>
                                                    </div>
                                                    <p className="doctor mb-1"><strong>Servicio de Ecografía</strong></p>
                                                    <p className="diagnosis text-muted">Ecografía completa de abdomen y pelvis</p>
                                                    <div className="d-flex gap-3 mt-2">
                                                        <span className="text-muted small"><i className="fas fa-calendar me-1"></i>Agendado: 20 Nov 2024</span>
                                                        <span className="text-muted small"><i className="fas fa-clock me-1"></i>10:30 AM</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column align-items-end">
                                                <button className="btn btn-outline-secondary mb-2" disabled>
                                                    <svg className="icon me-1" viewBox="0 0 24 24" width="18" height="18">
                                                        <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                                                    </svg>
                                                    Pendiente
                                                </button>
                                                <button className="btn btn-outline-secondary eye-icon-btn" disabled>
                                                    <svg className="icon me-1" viewBox="0 0 24 24" width="18" height="18">
                                                        <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                                                    </svg>
                                                    No Disponible
                                                </button>
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
    );
};

export default MisExamenes;