import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminEspecialidades() {
    const [especialidades, setEspecialidades] = useState([]);
    const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Estado para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        area_clinica: '',
        codigo_estandar: '',
        activo: true
    });

    // Cargar especialidades al iniciar
    useEffect(() => {
        fetchEspecialidades();
    }, []);

    // Obtener todas las especialidades
    const fetchEspecialidades = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/especialidades');
            setEspecialidades(response.data);
        } catch (err) {
            setError('Error al cargar especialidades');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Buscar especialidades
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchEspecialidades();
            return;
        }
        try {
            setLoading(true);
            // Búsqueda en frontend hasta que tengas el endpoint
            const especialidadesFiltradas = especialidades.filter(esp =>
                esp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (esp.area_clinica && esp.area_clinica.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (esp.codigo_estandar && esp.codigo_estandar.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setEspecialidades(especialidadesFiltradas);
        } catch (err) {
            setError('Error al buscar especialidades');
        } finally {
            setLoading(false);
        }
    };

    // Abrir formulario para crear especialidad
    const handleNewEspecialidad = () => {
        setFormData({
            nombre: '',
            descripcion: '',
            area_clinica: '',
            codigo_estandar: '',
            activo: true
        });
        setShowForm(true);
        setEditing(false);
        setSelectedEspecialidad(null);
        setError('');
    };

    // Abrir formulario para editar especialidad
    const handleEditEspecialidad = (especialidad) => {
        setFormData({
            nombre: especialidad.nombre,
            descripcion: especialidad.descripcion,
            area_clinica: especialidad.area_clinica || '',
            codigo_estandar: especialidad.codigo_estandar || '',
            activo: especialidad.activo
        });
        setShowForm(true);
        setEditing(true);
        setSelectedEspecialidad(especialidad);
        setError('');
    };

    // Guardar especialidad (crear o actualizar)
    const handleSaveEspecialidad = async () => {
        try {
            setError('');

            // Validaciones básicas
            if (!formData.nombre || !formData.descripcion) {
                setError('Nombre y descripción son requeridos');
                return;
            }

            if (formData.nombre.length > 100) {
                setError('El nombre no puede exceder los 100 caracteres');
                return;
            }

            if (editing && selectedEspecialidad) {
                // Actualizar especialidad existente - NO DISPONIBLE POR AHORA
                setError('La funcionalidad de edición no está disponible temporalmente');
                return;
            } else {
                // Crear nueva especialidad
                const response = await axios.post('http://localhost:5000/api/especialidades', formData);
                alert(response.data.message || 'Especialidad creada exitosamente');
            }

            // Limpiar y recargar
            setShowForm(false);
            setEditing(false);
            setSelectedEspecialidad(null);
            fetchEspecialidades();

        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Error al guardar especialidad';
            setError(errorMessage);

            // Manejo específico para errores de duplicado
            if (errorMessage.includes('duplicate')) {
                setError('Ya existe una especialidad con ese nombre');
            }
            console.error('Error:', err);
        }
    };

     // Eliminar especialidad - NO DISPONIBLE (mensaje informativo)
    const eliminarEspecialidad = async (id, nombre) => {
        alert(`La funcionalidad para eliminar especialidades no está disponible temporalmente.\n\nEspecialidad: ${nombre}`);
    };

    // Activar/desactivar especialidad - NO DISPONIBLE (mensaje informativo)
    const toggleEspecialidad = async (id, estadoActual, nombre) => {
        alert(`La funcionalidad para ${estadoActual ? 'desactivar' : 'activar'} especialidades no está disponible temporalmente.\n\nEspecialidad: ${nombre}`);
    };

    // Cancelar edición/creación
    const handleCancel = () => {
        setShowForm(false);
        setEditing(false);
        setSelectedEspecialidad(null);
        setError('');
    };

    if (loading) return <div className="text-center mt-4"><p>Cargando especialidades...</p></div>;

    return (
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col">
                    <h2 className="mb-0">Gestión de Especialidades Médicas</h2>
                    <p className="text-muted">Administrar especialidades del sistema</p>
                </div>
            </div>

            {/* Alertas informativas sobre funcionalidades limitadas */}
            <div className="alert alert-info mb-4">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Funcionalidades disponibles:</strong> Crear y visualizar especialidades.
                <span className="text-warning"> Edición y eliminación no disponibles temporalmente.</span>
            </div>

            {/* Barra de búsqueda y botones */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre o área clínica..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button className="btn btn-outline-secondary" onClick={handleSearch}>
                            <i className="fas fa-search"></i>
                        </button>
                        {searchTerm && (
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                    setSearchTerm('');
                                    fetchEspecialidades();
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>
                <div className="col-12 col-md-6 text-md-end">
                    <button className="btn btn-success me-2" onClick={handleNewEspecialidad}>
                        <i className="fas fa-plus"></i> Agregar Especialidad
                    </button>
                    <button className="btn btn-outline-secondary" onClick={fetchEspecialidades}>
                        <i className="fas fa-sync-alt"></i> Actualizar
                    </button>
                </div>
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            {/* Formulario de creación/edición */}
            {showForm && (
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0"><i className="fas fa-plus-circle"></i> {editing ? 'Editar Especialidad' : 'Nueva Especialidad'}</h5>
                    </div>
                    <div className="card-body">
                        {editing && (
                            <div className="alert alert-warning">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                <strong>Nota:</strong> La funcionalidad de edición no está disponible temporalmente.
                            </div>
                        )}

                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Nombre *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        placeholder="Ej: Cardiología, Pediatría, etc."
                                        maxLength="100"
                                        disabled={editing}
                                    />
                                    <small className="text-muted">
                                        {formData.nombre.length}/100 caracteres
                                    </small>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Descripción *</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        placeholder="Descripción detallada de la especialidad..."
                                        disabled={editing}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Área Clínica</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.area_clinica}
                                        onChange={(e) => setFormData({ ...formData, area_clinica: e.target.value })}
                                        placeholder="Ej: Medicina Interna, Cirugía, etc."
                                        disabled={editing}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Código Estándar</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.codigo_estandar}
                                        onChange={(e) => setFormData({ ...formData, codigo_estandar: e.target.value })}
                                        placeholder="Ej: CIE-10, SNOMED, etc."
                                        disabled={editing}
                                    />
                                </div>
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={formData.activo}
                                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                        disabled={editing}
                                    />
                                    <label className="form-check-label">Especialidad activa</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer bg-light">
                        <div className="d-flex gap-2 justify-content-end">
                            <button className="btn btn-secondary" onClick={handleCancel}>
                                <i className="fas fa-times"></i> {editing ? 'Cerrar' : 'Cancelar'}
                            </button>
                            {!editing && (
                                <button
                                    className="btn btn-success"
                                    onClick={handleSaveEspecialidad}
                                    disabled={!formData.nombre || !formData.descripcion}
                                >
                                    <i className="fas fa-save"></i> Crear Especialidad
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de especialidades */}
            <div className="card">
                <div className="card-header bg-light">
                    <h5 className="mb-0"><i className="fas fa-stethoscope"></i> Lista de Especialidades <span className="badge bg-primary">{especialidades.length}</span></h5>
                </div>
                <div className="card-body">
                    {especialidades.length === 0 ? (
                        <p className="text-center text-muted py-4">No hay especialidades registradas</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover table-sm">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{minWidth: '150px'}}>Nombre</th>
                                        <th style={{minWidth: '200px'}}>Descripción</th>
                                        <th style={{minWidth: '120px'}}>Área Clínica</th>
                                        <th style={{minWidth: '100px'}}>Código</th>
                                        <th style={{minWidth: '80px'}}>Estado</th>
                                        <th className="text-center" style={{minWidth: '120px'}}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {especialidades.map(especialidad => (
                                        <tr key={especialidad._id} className={!especialidad.activo ? 'table-secondary' : ''}>
                                            <td>
                                                <div className="fw-medium">{especialidad.nombre}</div>
                                                {!especialidad.activo && <span className="badge bg-warning text-dark mt-1">Inactiva</span>}
                                            </td>
                                            <td className="small text-truncate" style={{maxWidth: '250px'}}>
                                                {especialidad.descripcion}
                                            </td>
                                            <td className="small">{especialidad.area_clinica || '-'}</td>
                                            <td className="small"><code>{especialidad.codigo_estandar || '-'}</code></td>
                                            <td>
                                                <span className={`badge ${especialidad.activo ? 'bg-success' : 'bg-danger'}`}>
                                                    {especialidad.activo ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => handleEditEspecialidad(especialidad)}
                                                        title="Editar (No disponible)"
                                                        disabled
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-warning"
                                                        onClick={() => toggleEspecialidad(especialidad._id, especialidad.activo, especialidad.nombre)}
                                                        title={especialidad.activo ? 'Desactivar (No disponible)' : 'Activar (No disponible)'}
                                                        disabled
                                                    >
                                                        <i className={`fas ${especialidad.activo ? 'fa-pause' : 'fa-play'}`}></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => eliminarEspecialidad(especialidad._id, especialidad.nombre)}
                                                        title="Eliminar (No disponible)"
                                                        disabled
                                                    >
                                                        <i className="fas fa-trash"></i>
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
        </div>
    );
}