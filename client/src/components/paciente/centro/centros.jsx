import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const CentrosMedicos = () => {
    const [centrosMedicos, setCentrosMedicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [filtroRegion, setFiltroRegion] = useState('');
    const [filtroComuna, setFiltroComuna] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroEspecialidad, setFiltroEspecialidad] = useState('');

    // Cargar centros médicos al montar el componente
    useEffect(() => {
        const fetchCentrosMedicos = async () => {
            try {
                setLoading(true);
                // URL CORREGIDA
                const response = await axios.get('http://localhost:5000/api/centros');
                setCentrosMedicos(response.data);
                setError(null);
            } catch (err) {
                setError('Error al cargar los centros médicos');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCentrosMedicos();
    }, []);

    // Búsqueda en tiempo real con debounce
    useEffect(() => {
        const buscarCentros = async () => {
            if (busqueda.trim()) {
                try {
                    setLoading(true);
                    // URL CORREGIDA
                    const response = await axios.get(`http://localhost:5000/api/centros/buscar?q=${encodeURIComponent(busqueda)}`);
                    setCentrosMedicos(response.data);
                } catch (err) {
                    console.error('Error en búsqueda:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                const fetchAllCentros = async () => {
                    try {
                        setLoading(true);
                        // URL CORREGIDA
                        const response = await axios.get('http://localhost:5000/api/centros');
                        setCentrosMedicos(response.data);
                    } catch (err) {
                        console.error('Error:', err);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchAllCentros();
            }
        };

        const timeoutId = setTimeout(buscarCentros, 500);
        return () => clearTimeout(timeoutId);
    }, [busqueda]);

    // ... el resto de tu código se mantiene igual ...
    // Obtener valores únicos para los filtros desde los datos de la API
    const regiones = useMemo(() =>
        [...new Set(centrosMedicos.map(centro => centro.region))].sort(),
        [centrosMedicos]
    );

    const comunas = useMemo(() =>
        [...new Set(centrosMedicos.map(centro => centro.comuna))].sort(),
        [centrosMedicos]
    );

    const tipos = useMemo(() =>
        [...new Set(centrosMedicos.map(centro => centro.tipo))].sort(),
        [centrosMedicos]
    );

    const especialidadesUnicas = useMemo(() => {
        const todasEspecialidades = centrosMedicos.flatMap(centro =>
            centro.especialidades
                ?.filter(esp => esp.activo !== false)
                ?.map(esp => esp.nombre) || []
        );
        return [...new Set(todasEspecialidades)].sort();
    }, [centrosMedicos]);

    // Filtrar centros médicos localmente
    const centrosFiltrados = useMemo(() => {
        let filtrados = centrosMedicos.filter(centro => centro.activo !== false);

        // Filtro por búsqueda local
        if (busqueda) {
            filtrados = filtrados.filter(centro =>
                centro.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                centro.direccion?.toLowerCase().includes(busqueda.toLowerCase()) ||
                centro.comuna?.toLowerCase().includes(busqueda.toLowerCase()) ||
                centro.region?.toLowerCase().includes(busqueda.toLowerCase()) ||
                centro.telefono?.includes(busqueda) ||
                centro.especialidades?.some(esp =>
                    esp.nombre.toLowerCase().includes(busqueda.toLowerCase())
                )
            );
        }

        // Filtro por región
        if (filtroRegion) {
            filtrados = filtrados.filter(centro =>
                centro.region === filtroRegion
            );
        }

        // Filtro por comuna
        if (filtroComuna) {
            filtrados = filtrados.filter(centro =>
                centro.comuna === filtroComuna
            );
        }

        // Filtro por tipo
        if (filtroTipo) {
            filtrados = filtrados.filter(centro =>
                centro.tipo === filtroTipo
            );
        }

        // Filtro por especialidad
        if (filtroEspecialidad) {
            filtrados = filtrados.filter(centro =>
                centro.especialidades?.some(esp =>
                    esp.activo !== false && esp.nombre === filtroEspecialidad
                )
            );
        }

        return filtrados;
    }, [centrosMedicos, busqueda, filtroRegion, filtroComuna, filtroTipo, filtroEspecialidad]);

    const limpiarFiltros = () => {
        setBusqueda('');
        setFiltroRegion('');
        setFiltroComuna('');
        setFiltroTipo('');
        setFiltroEspecialidad('');
    };

    const llamarCentro = (telefono) => {
        window.open(`tel:${telefono}`);
    };

    const abrirGoogleMaps = (direccion, comuna) => {
        const direccionCompleta = `${direccion}, ${comuna}, Chile`;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta)}`;
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="flex-grow-1 p-3 p-md-4">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p>Cargando centros médicos...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-grow-1 p-3 p-md-4">
                <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow-1 p-3 p-md-4">
            <div className="row g-3">
                <div className="col-12 main-content p-4">
                    <div className="content-wrapper">
                        <div className="section-content active">
                            <div className="section-header mb-4">
                                <h5 className="card-title mb-1">Centros Médicos Públicos</h5>
                                <p className="text-muted small mb-0">
                                    {centrosMedicos.length} centros de salud disponibles
                                </p>
                            </div>

                            {/* Barra de búsqueda y filtros */}
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row g-3">
                                        {/* Barra de búsqueda */}
                                        <div className="col-md-4">
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="fas fa-search"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Buscar por nombre, dirección o especialidad..."
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

                                        <div className="col-md-2">
                                            <select
                                                className="form-select"
                                                value={filtroEspecialidad}
                                                onChange={(e) => setFiltroEspecialidad(e.target.value)}
                                            >
                                                <option value="">Todas las especialidades</option>
                                                {especialidadesUnicas.map(especialidad => (
                                                    <option key={especialidad} value={especialidad}>{especialidad}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Contador y botón limpiar */}
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <small className="text-muted">
                                                {centrosFiltrados.length} centro(s) encontrado(s) de {centrosMedicos.length}
                                                {busqueda && ` para "${busqueda}"`}
                                                {filtroRegion && ` en ${filtroRegion}`}
                                                {filtroEspecialidad && ` con ${filtroEspecialidad}`}
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
                                            <table className="table table-hover mb-0 align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Centro Médico</th>
                                                        <th>Tipo/Nivel</th>
                                                        <th>Especialidades</th>
                                                        <th>Dirección</th>
                                                        <th>Ubicación</th>
                                                        <th>Teléfono</th>
                                                        <th>Horario</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {centrosFiltrados.map(centro => (
                                                        <tr key={centro._id}>
                                                            <td>
                                                                <div className="d-flex flex-column">
                                                                    <span className="fw-medium">{centro.nombre}</span>
                                                                    <div>
                                                                        <span className={`badge ${centro.nivel === 'Terciario' ? 'bg-primary' :
                                                                            centro.nivel === 'Secundario' ? 'bg-warning text-dark' : 'bg-success'
                                                                            }`}>
                                                                            {centro.nivel}
                                                                        </span>
                                                                        {centro.activo === false && (
                                                                            <span className="badge bg-secondary ms-1">Inactivo</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-light text-dark border">
                                                                    {centro.tipo}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {centro.especialidades && centro.especialidades.length > 0 ? (
                                                                    <div className="d-flex flex-wrap gap-1">
                                                                        {centro.especialidades.slice(0, 2).map((especialidad, index) => (
                                                                            <span
                                                                                key={especialidad._id || index}
                                                                                className="badge bg-info text-white small"
                                                                                title={especialidad.descripcion}
                                                                            >
                                                                                {especialidad.nombre}
                                                                            </span>
                                                                        ))}
                                                                        {centro.especialidades.length > 2 && (
                                                                            <span
                                                                                className="badge bg-secondary small"
                                                                                title={centro.especialidades.slice(2).map(esp => esp.nombre).join(', ')}
                                                                            >
                                                                                +{centro.especialidades.length - 2}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <small className="text-muted">Sin especialidades</small>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <small className="text-muted">
                                                                    {centro.direccion}
                                                                </small>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex flex-column">
                                                                    <span className="text-muted">{centro.comuna}</span>
                                                                    <small className="text-muted">{centro.region}</small>
                                                                </div>
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
                                                    Especialidades según nivel de atención
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