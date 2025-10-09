import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminCentrosSalud() {
    const [centrosSalud, setCentrosSalud] = useState([]);
    const [selectedCentro, setSelectedCentro] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Estado para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        comuna: '',
        telefono: '',
        especialidades: [],
        activo: true
    });

    // Cargar centros de salud al iniciar
    useEffect(() => {
        fetchCentrosSalud();
    }, []);

    // Obtener todos los centros de salud
    const fetchCentrosSalud = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/centros');
            setCentrosSalud(response.data);
        } catch (err) {
            setError('Error al cargar centros de salud');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Buscar centros de salud
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchCentrosSalud();
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/centros/buscar?q=${searchTerm}`);
            setCentrosSalud(response.data);
        } catch (err) {
            setError('Error al buscar centros de salud');
        } finally {
            setLoading(false);
        }
    };

    // Abrir formulario para crear centro de salud
    const handleNewCentro = () => {
        setFormData({
            nombre: '',
            direccion: '',
            comuna: '',
            telefono: '',
            especialidades: [],
            activo: true
        });
        setShowForm(true);
        setEditing(false);
        setSelectedCentro(null);
        setError('');
    };

    // Abrir formulario para editar centro de salud
    const handleEditCentro = (centro) => {
        setFormData({
            nombre: centro.nombre,
            direccion: centro.direccion,
            comuna: centro.comuna,
            telefono: centro.telefono,
            especialidades: centro.especialidades || [],
            activo: centro.activo
        });
        setShowForm(true);
        setEditing(true);
        setSelectedCentro(centro);
        setError('');
    };

    // Manejar array de especialidades
    const handleEspecialidadesChange = (value) => {
        const especialidadesArray = value.split(',').map(item => item.trim()).filter(item => item);
        setFormData({ ...formData, especialidades: especialidadesArray });
    };

    // Guardar centro de salud (crear o actualizar)
    const handleSaveCentro = async () => {
        try {
            setError('');

            // Validaciones
            if (!formData.nombre.trim()) {
                setError('El nombre del centro es obligatorio');
                return;
            }

            if (!formData.direccion.trim()) {
                setError('La dirección es obligatoria');
                return;
            }

            if (!formData.comuna.trim()) {
                setError('La comuna es obligatoria');
                return;
            }

            if (!formData.telefono.trim()) {
                setError('El teléfono es obligatorio');
                return;
            }

            if (formData.nombre.length > 150) {
                setError('El nombre no puede exceder los 150 caracteres');
                return;
            }

            if (formData.direccion.length > 200) {
                setError('La dirección no puede exceder los 200 caracteres');
                return;
            }

            if (editing && selectedCentro) {
                // Actualizar centro existente
                const response = await axios.put(`http://localhost:5000/api/centros/${selectedCentro._id}`, formData);
                alert(response.data.message || 'Centro de salud actualizado exitosamente');
            } else {
                // Crear nuevo centro
                const response = await axios.post('http://localhost:5000/api/centros', formData);
                alert(response.data.message || 'Centro de salud creado exitosamente');
            }

            // Limpiar y recargar
            setShowForm(false);
            setEditing(false);
            setSelectedCentro(null);
            fetchCentrosSalud();

        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Error al guardar centro de salud';
            setError(errorMessage);
            console.error('Error:', err);
        }
    };

    // Eliminar centro de salud
    const handleDeleteCentro = async (centroId, nombre) => {
        if (!window.confirm(`¿Eliminar el centro de salud "${nombre}"? Esta acción no se puede deshacer.`)) {
            return;
        }
        try {
            await axios.delete(`http://localhost:5000/api/centros/${centroId}`);
            alert('Centro de salud eliminado exitosamente');
            fetchCentrosSalud();
        } catch (err) {
            setError('Error al eliminar centro de salud');
        }
    };

    // Activar/desactivar centro de salud
    const handleToggleCentro = async (centroId, currentStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/centros/${centroId}/toggle`);
            alert(`Centro de salud ${currentStatus ? 'desactivado' : 'activado'} exitosamente`);
            fetchCentrosSalud();
        } catch (err) {
            setError('Error al cambiar estado del centro de salud');
        }
    };

    // Cancelar edición/creación
    const handleCancel = () => {
        setShowForm(false);
        setEditing(false);
        setSelectedCentro(null);
        setError('');
    };

    if (loading) return <div className="text-center mt-4"><p>Cargando centros de salud...</p></div>;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Gestión de Centros de Salud</h2>

                    {/* Barra de búsqueda y botones */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por nombre, comuna o dirección..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button className="btn btn-outline-primary" onClick={handleSearch}>
                                    🔍
                                </button>
                                {searchTerm && (
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            setSearchTerm('');
                                            fetchCentrosSalud();
                                        }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 text-end">
                            <button className="btn btn-success" onClick={handleNewCentro}>
                                + Agregar Centro
                            </button>
                            <button className="btn btn-outline-secondary ms-2" onClick={fetchCentrosSalud}>
                                🔄 Actualizar
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
                            <div className="card-header">
                                <h5>{editing ? 'Editar Centro de Salud' : 'Nuevo Centro de Salud'}</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Nombre *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.nombre}
                                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                                placeholder="Ej: Hospital Regional, Clínica San Juan, etc."
                                                maxLength="150"
                                            />
                                            <small className="text-muted">
                                                {formData.nombre.length}/150 caracteres
                                            </small>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Dirección *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.direccion}
                                                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                                placeholder="Dirección completa"
                                                maxLength="200"
                                            />
                                            <small className="text-muted">
                                                {formData.direccion.length}/200 caracteres
                                            </small>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Comuna *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.comuna}
                                                onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                                                placeholder="Ej: Santiago, Providencia, Las Condes, etc."
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Teléfono *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.telefono}
                                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                                placeholder="Ej: +56223456789"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Especialidades</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                onChange={(e) => handleEspecialidadesChange(e.target.value)}
                                                placeholder="Separar por comas: Cardiología, Pediatría, Urgencia, etc."
                                            />
                                            <small className="text-muted">
                                                Especialidades actuales: {formData.especialidades.join(', ') || 'Ninguna'}
                                            </small>
                                        </div>

                                        <div className="mb-3 form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={formData.activo}
                                                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                            />
                                            <label className="form-check-label">Centro activo</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-end">
                                    <button
                                        className="btn btn-primary me-2"
                                        onClick={handleSaveCentro}
                                        disabled={!formData.nombre || !formData.direccion || !formData.comuna || !formData.telefono}
                                    >
                                        {editing ? 'Actualizar' : 'Crear'} Centro
                                    </button>
                                    <button className="btn btn-secondary" onClick={handleCancel}>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lista de centros de salud */}
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Lista de Centros de Salud ({centrosSalud.length})</h5>
                            <div>
                                <span className="badge bg-success me-2">
                                    {centrosSalud.filter(c => c.activo).length} activos
                                </span>
                                <span className="badge bg-secondary">
                                    {centrosSalud.filter(c => !c.activo).length} inactivos
                                </span>
                            </div>
                        </div>
                        <div className="card-body">
                            {centrosSalud.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-building display-1 text-muted"></i>
                                    <p className="text-muted mt-3">No hay centros de salud registrados</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleNewCentro}
                                    >
                                        + Agregar Primer Centro
                                    </button>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Dirección</th>
                                                <th>Comuna</th>
                                                <th>Teléfono</th>
                                                <th>Especialidades</th>
                                                <th>Estado</th>
                                                <th style={{ width: 180 }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {centrosSalud.map(centro => (
                                                <tr key={centro._id} className={!centro.activo ? 'table-secondary' : ''}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-building text-primary me-2"></i>
                                                            <div>
                                                                <strong>{centro.nombre}</strong>
                                                                {!centro.activo && <span className="badge bg-warning ms-2">Inactivo</span>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <small className="text-muted">
                                                            {centro.direccion.length > 50
                                                                ? `${centro.direccion.substring(0, 50)}...`
                                                                : centro.direccion
                                                            }
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-info">{centro.comuna}</span>
                                                    </td>
                                                    <td>{centro.telefono}</td>
                                                    <td>
                                                        {centro.especialidades && centro.especialidades.length > 0 ? (
                                                            <span
                                                                className="badge bg-light text-dark"
                                                                title={centro.especialidades.join(', ')}
                                                            >
                                                                {centro.especialidades.length} especialidad{centro.especialidades.length !== 1 ? 'es' : ''}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted">-</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${centro.activo ? 'bg-success' : 'bg-danger'}`}>
                                                            {centro.activo ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm">
                                                            <button
                                                                className="btn btn-outline-primary"
                                                                onClick={() => handleEditCentro(centro)}
                                                                title="Editar centro"
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-warning"
                                                                onClick={() => handleToggleCentro(centro._id, centro.activo)}
                                                                title={centro.activo ? 'Desactivar centro' : 'Activar centro'}
                                                            >
                                                                {centro.activo ? '⏸️' : '▶️'}
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                onClick={() => handleDeleteCentro(centro._id, centro.nombre)}
                                                                title="Eliminar centro"
                                                            >
                                                                🗑️
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
            </div>
        </div>
    );
}