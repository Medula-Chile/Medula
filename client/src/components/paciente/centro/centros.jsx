import React, { useState } from 'react';

const CentrosMedicos = () => {
    const [regionExpandida, setRegionExpandida] = useState('Metropolitana');

    const datosPorRegion = {
        "Metropolitana": [
            {
                nombre: "Hospital Clínico Universidad de Chile",
                direccion: "Av. Santos Dumont 999, Independencia",
                telefono: "+56 2 2978 0000",
                tipo: "Hospital",
                nivel: "Terciario"
            },
            {
                nombre: "Hospital San Juan de Dios",
                direccion: "Huérfanos 3255, Santiago",
                telefono: "+56 2 2575 5000",
                tipo: "Hospital",
                nivel: "Terciario"
            },
            {
                nombre: "CESFAM Santa Ana",
                direccion: "Santo Domingo 123, Santiago",
                telefono: "+56 2 2634 5678",
                tipo: "Centro de Salud Familiar",
                nivel: "Primario"
            }
        ],
        "Valparaíso": [
            {
                nombre: "Hospital Gustavo Fricke",
                direccion: "Álvarez 1532, Viña del Mar",
                telefono: "+56 32 235 2000",
                tipo: "Hospital",
                nivel: "Terciario"
            },
            {
                nombre: "Hospital Carlos Van Buren",
                direccion: "San Ignacio 725, Valparaíso",
                telefono: "+56 32 220 4000",
                tipo: "Hospital",
                nivel: "Terciario"
            }
        ],
        "Biobío": [
            {
                nombre: "Hospital Regional de Concepción",
                direccion: "San Martín 1436, Concepción",
                telefono: "+56 41 220 3000",
                tipo: "Hospital",
                nivel: "Terciario"
            }
        ]
    };

    const toggleRegion = (region) => {
        setRegionExpandida(regionExpandida === region ? null : region);
    };

    return (
        <div className="flex-grow-1 p-3 p-md-4">
            <div className="row g-3">
                <div className="col-12 main-content p-4">
                    <div className="content-wrapper">
                        <div className="section-content active">
                            <div className="section-header mb-4">
                                <h1>Red de Centros Médicos Públicos</h1>
                                <p className="text-muted">Directorio organizado por región</p>
                            </div>

                            {/* Información general */}
                            <div className="card bg-light mb-4">
                                <div className="card-body">
                                    <div className="row text-center">
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <i className="fas fa-info-circle text-primary me-2"></i>
                                                <div>
                                                    <h5 className="mb-0">Atención Gratuita</h5>
                                                    <small className="text-muted">FONASA</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <i className="fas fa-clock text-primary me-2"></i>
                                                <div>
                                                    <h5 className="mb-0">Horarios Extendidos</h5>
                                                    <small className="text-muted">Urgencias 24/7</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <i className="fas fa-shield-alt text-primary me-2"></i>
                                                <div>
                                                    <h5 className="mb-0">Atención Garantizada</h5>
                                                    <small className="text-muted">Ley GES</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Directorio por región */}
                            <div className="centros-directorio">
                                {Object.entries(datosPorRegion).map(([region, centros]) => (
                                    <div key={region} className="card mb-3">
                                        <div
                                            className="card-header bg-white cursor-pointer"
                                            onClick={() => toggleRegion(region)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0">
                                                    <i className="fas fa-map-marker-alt text-primary me-2"></i>
                                                    Región de {region}
                                                </h5>
                                                <i className={`fas fa-chevron-${regionExpandida === region ? 'up' : 'down'} text-muted`}></i>
                                            </div>
                                        </div>

                                        {regionExpandida === region && (
                                            <div className="card-body">
                                                {centros.map((centro, index) => (
                                                    <div key={index} className="border-bottom pb-3 mb-3 last:border-bottom-0 last:pb-0 last:mb-0">
                                                        <div className="row">
                                                            <div className="col-md-8">
                                                                <h6 className="mb-1">{centro.nombre}</h6>
                                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                                    <span className={`badge ${centro.tipo === 'Hospital' ? 'bg-primary' : 'bg-success'
                                                                        }`}>
                                                                        {centro.tipo}
                                                                    </span>
                                                                    <span className="badge bg-light text-dark border">
                                                                        {centro.nivel}
                                                                    </span>
                                                                </div>
                                                                <p className="text-muted mb-1">
                                                                    <i className="fas fa-map-marker-alt me-2"></i>
                                                                    {centro.direccion}
                                                                </p>
                                                                <p className="text-muted mb-0">
                                                                    <i className="fas fa-phone me-2"></i>
                                                                    {centro.telefono}
                                                                </p>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="d-flex flex-column gap-2 h-100 justify-content-center">
                                                                    <button className="btn btn-sm btn-outline-primary">
                                                                        <i className="fas fa-directions me-1"></i>
                                                                        Direcciones
                                                                    </button>
                                                                    <button className="btn btn-sm btn-primary">
                                                                        <i className="fas fa-phone me-1"></i>
                                                                        Llamar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Información adicional */}
                            <div className="card mt-4">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <i className="fas fa-info-circle text-primary me-2"></i>
                                        Información Importante
                                    </h5>
                                    <ul className="list-unstyled">
                                        <li className="mb-2">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Atención gratuita para beneficiarios FONASA
                                        </li>
                                        <li className="mb-2">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Horario de urgencias: 24 horas, 7 días a la semana
                                        </li>
                                        <li className="mb-2">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Para consultas médicas programadas, solicite hora previa
                                        </li>
                                        <li className="mb-0">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Presentar cédula de identidad y carnet FONASA
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CentrosMedicos;