import React, { useState, useMemo } from 'react';

const CentrosMedicos = () => {
    const [busqueda, setBusqueda] = useState('');
    const [filtroRegion, setFiltroRegion] = useState('');
    const [filtroComuna, setFiltroComuna] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');

    const centrosMedicos = [
        {
            id: 1,
            nombre: "Hospital Clínico Universidad de Chile",
            tipo: "Hospital",
            nivel: "Terciario",
            direccion: "Av. Santos Dumont 999",
            comuna: "Independencia",
            region: "Metropolitana",
            telefono: "+56 2 2978 0000",
            horario: "24/7",
            servicios: ["Urgencia", "Consulta Médica", "Exámenes", "Hospitalización"]
        },
        {
            id: 2,
            nombre: "Hospital San Juan de Dios",
            tipo: "Hospital",
            nivel: "Terciario",
            direccion: "Huérfanos 3255",
            comuna: "Santiago",
            region: "Metropolitana",
            telefono: "+56 2 2575 5000",
            horario: "24/7",
            servicios: ["Urgencia", "Especialidades", "Cirugía"]
        },
        {
            id: 3,
            nombre: "CESFAM Santa Ana",
            tipo: "Centro de Salud Familiar",
            nivel: "Primario",
            direccion: "Santo Domingo 123",
            comuna: "Santiago",
            region: "Metropolitana",
            telefono: "+56 2 2634 5678",
            horario: "L-V 8:00-17:00",
            servicios: ["Medicina General", "Control Niño Sano", "Vacunación"]
        },
        {
            id: 4,
            nombre: "Hospital Gustavo Fricke",
            tipo: "Hospital",
            nivel: "Terciario",
            direccion: "Álvarez 1532",
            comuna: "Viña del Mar",
            region: "Valparaíso",
            telefono: "+56 32 235 2000",
            horario: "24/7",
            servicios: ["Urgencia", "Maternidad", "Pediatría"]
        },
        {
            id: 5,
            nombre: "CESFAM Valparaíso",
            tipo: "Centro de Salud Familiar",
            nivel: "Primario",
            direccion: "Brasil 1450",
            comuna: "Valparaíso",
            region: "Valparaíso",
            telefono: "+56 32 225 6789",
            horario: "L-V 8:00-16:30",
            servicios: ["Atención Primaria", "Dental", "Matronería"]
        },
        {
            id: 6,
            nombre: "Hospital Regional de Concepción",
            tipo: "Hospital",
            nivel: "Terciario",
            direccion: "San Martín 1436",
            comuna: "Concepción",
            region: "Biobío",
            telefono: "+56 41 220 3000",
            horario: "24/7",
            servicios: ["Urgencia", "Traumatología", "Oncología"]
        },
        {
            id: 7,
            nombre: "SAPU La Florida",
            tipo: "SAPU",
            nivel: "Secundario",
            direccion: "Av. La Florida 1234",
            comuna: "La Florida",
            region: "Metropolitana",
            telefono: "+56 2 2789 0123",
            horario: "20:00-08:00",
            servicios: ["Urgencia", "Pediatría", "Traumatología"]
        }
    ];

    // Obtener valores únicos para los filtros
    const regiones = useMemo(() =>
        [...new Set(centrosMedicos.map(centro => centro.region))],
        []
    );

    const comunas = useMemo(() =>
        [...new Set(centrosMedicos.map(centro => centro.comuna))],
        []
    );

    const tipos = useMemo(() =>
        [...new Set(centrosMedicos.map(centro => centro.tipo))],
        []
    );

    // Filtrar centros médicos
    const centrosFiltrados = useMemo(() => {
        return centrosMedicos.filter(centro => {
            const coincideBusqueda = centro.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                centro.direccion.toLowerCase().includes(busqueda.toLowerCase());
            const coincideRegion = !filtroRegion || centro.region === filtroRegion;
            const coincideComuna = !filtroComuna || centro.comuna === filtroComuna;
            const coincideTipo = !filtroTipo || centro.tipo === filtroTipo;

            return coincideBusqueda && coincideRegion && coincideComuna && coincideTipo;
        });
    }, [busqueda, filtroRegion, filtroComuna, filtroTipo]);

    const limpiarFiltros = () => {
        setBusqueda('');
        setFiltroRegion('');
        setFiltroComuna('');
        setFiltroTipo('');
    };

    const llamarCentro = (telefono) => {
        window.open(`tel:${telefono}`);
    };

    const abrirGoogleMaps = (direccion, comuna) => {
        const direccionCompleta = `${direccion}, ${comuna}, Chile`;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="flex-grow-1 p-3 p-md-4">
            <div className="row g-3">
                <div className="col-12 main-content p-4">
                    <div className="content-wrapper">
                        <div className="section-content active">
                            <div className="section-header mb-4">
                                <h1>Centros Médicos Públicos</h1>
                                <p className="text-muted">Encuentra centros de salud públicos cerca de ti</p>
                            </div>

                            {/* Barra de búsqueda y filtros */}
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row g-3">
                                        {/* Barra de búsqueda */}
                                        <div className="col-md-6">
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="fas fa-search"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Buscar por nombre o dirección..."
                                                    value={busqueda}
                                                    onChange={(e) => setBusqueda(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Filtros */}
                                        <div className="col-md-2">
                                            <select
                                                className="form-select"
                                                value={filtroRegion}
                                                onChange={(e) => setFiltroRegion(e.target.value)}
                                            >
                                                <option value="">Todas las regiones</option>
                                                {regiones.map(region => (
                                                    <option key={region} value={region}>{region}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-2">
                                            <select
                                                className="form-select"
                                                value={filtroComuna}
                                                onChange={(e) => setFiltroComuna(e.target.value)}
                                            >
                                                <option value="">Todas las comunas</option>
                                                {comunas.map(comuna => (
                                                    <option key={comuna} value={comuna}>{comuna}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-2">
                                            <select
                                                className="form-select"
                                                value={filtroTipo}
                                                onChange={(e) => setFiltroTipo(e.target.value)}
                                            >
                                                <option value="">Todos los tipos</option>
                                                {tipos.map(tipo => (
                                                    <option key={tipo} value={tipo}>{tipo}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Contador y botón limpiar */}
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <small className="text-muted">
                                                {centrosFiltrados.length} centro(s) encontrado(s)
                                            </small>
                                        </div>
                                        <div className="col-md-6 text-end">
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={limpiarFiltros}
                                            >
                                                <i className="fas fa-times me-1"></i>
                                                Limpiar filtros
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de resultados */}
                            <div className="card">
                                <div className="card-body p-0">
                                    {centrosFiltrados.length === 0 ? (
                                        <div className="text-center p-5">
                                            <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                            <h5>No se encontraron centros médicos</h5>
                                            <p className="text-muted">Intenta ajustar los filtros de búsqueda</p>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-hover mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Centro Médico</th>
                                                        <th>Tipo</th>
                                                        <th>Dirección</th>
                                                        <th>Comuna</th>
                                                        <th>Teléfono</th>
                                                        <th>Horario</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {centrosFiltrados.map(centro => (
                                                        <tr key={centro.id}>
                                                            <td>
                                                                <div>
                                                                    <strong>{centro.nombre}</strong>
                                                                    <div>
                                                                        <small className={`badge ${centro.nivel === 'Terciario' ? 'bg-primary' :
                                                                                centro.nivel === 'Secundario' ? 'bg-warning text-dark' : 'bg-success'
                                                                            }`}>
                                                                            {centro.nivel}
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-light text-dark border">
                                                                    {centro.tipo}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <small className="text-muted">
                                                                    {centro.direccion}
                                                                </small>
                                                            </td>
                                                            <td>
                                                                <span className="text-muted">{centro.comuna}</span>
                                                            </td>
                                                            <td>
                                                                <small>{centro.telefono}</small>
                                                            </td>
                                                            <td>
                                                                <small className="text-muted">{centro.horario}</small>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-1">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => abrirGoogleMaps(centro.direccion, centro.comuna)}
                                                                        title="Cómo llegar"
                                                                    >
                                                                        <i className="fas fa-map-marker-alt"></i>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-primary"
                                                                        onClick={() => llamarCentro(centro.telefono)}
                                                                        title="Llamar"
                                                                    >
                                                                        <i className="fas fa-phone"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Información adicional */}
                            <div className="card mt-4">
                                <div className="card-body">
                                    <h6 className="card-title mb-3">
                                        <i className="fas fa-info-circle text-primary me-2"></i>
                                        Información para pacientes
                                    </h6>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <ul className="list-unstyled small">
                                                <li className="mb-2">
                                                    <i className="fas fa-check text-success me-2"></i>
                                                    Atención gratuita con FONASA
                                                </li>
                                                <li className="mb-2">
                                                    <i className="fas fa-check text-success me-2"></i>
                                                    Presentar cédula y carnet FONASA
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <ul className="list-unstyled small">
                                                <li className="mb-2">
                                                    <i className="fas fa-check text-success me-2"></i>
                                                    Urgencias: 24/7 en hospitales
                                                </li>
                                                <li className="mb-0">
                                                    <i className="fas fa-check text-success me-2"></i>
                                                    SAPU: Atención nocturna
                                                </li>
                                            </ul>
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

export default CentrosMedicos;