import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../services/api';

export default function AdminMedicos() {
  const [medicos, setMedicos] = useState([]);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Nuevos estados para las opciones
  const [usuarios, setUsuarios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [centrosSalud, setCentrosSalud] = useState([]);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    usuario_id: '',
    especialidad: '',
    centro_id: '',
    titulo_profesional: '',
    institucion_formacion: '',
    años_experiencia: '',
    disponibilidad_horaria: '',
    contacto_directo: ''
  });

  // Cargar datos al iniciar
  useEffect(() => {
    fetchMedicos();
    fetchUsuariosMedicos();
    fetchEspecialidades();
    fetchCentrosSalud();
  }, []);

  // Obtener todos los médicos
  const fetchMedicos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/medicos');
      setMedicos(res.data.medicos || res.data);
    } catch (err) {
      setError('Error al cargar médicos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener usuarios con rol médico
  const fetchUsuariosMedicos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users?rol=medico');
      setUsuarios(response.data.usuarios || response.data);
    } catch (err) {
      console.error('Error cargando usuarios médicos:', err);
    }
  };

  // Obtener especialidades
  const fetchEspecialidades = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/especialidades');
      setEspecialidades(response.data);
    } catch (err) {
      console.error('Error cargando especialidades:', err);
    }
  };

  // Obtener centros de salud (ruta correcta y usando api con token)
  const fetchCentrosSalud = async () => {
    try {
      const response = await api.get('/centros');
      const data = response.data;
      setCentrosSalud(Array.isArray(data) ? data : (data?.centros || []));
    } catch (err) {
      console.error('Error cargando centros de salud:', err);
    }
  };

  // Buscar médicos
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchMedicos();
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/medicos/buscar?q=${searchTerm}`);
      setMedicos(res.data.medicos || res.data);
    } catch (err) {
      setError('Error al buscar médicos');
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar médico para ver/editar
  const handleSelectMedico = (medico) => {
    setSelectedMedico(medico);
    setShowForm(false);
    setEditing(false);
  };

  // Abrir formulario para crear nuevo médico
  const handleNewMedico = () => {
    setFormData({
      usuario_id: '',
      especialidad: '',
      centro_id: '',
      titulo_profesional: '',
      institucion_formacion: '',
      años_experiencia: '',
      disponibilidad_horaria: '',
      contacto_directo: ''
    });
    setShowForm(true);
    setEditing(false);
    setSelectedMedico(null);
  };

  // Abrir formulario para editar médico
  const handleEditMedico = (medico) => {
    setFormData({
      usuario_id: medico.usuario_id._id,
      especialidad: medico.especialidad,
      centro_id: medico.centro_id._id,
      titulo_profesional: medico.titulo_profesional,
      institucion_formacion: medico.institucion_formacion,
      años_experiencia: medico.años_experiencia,
      disponibilidad_horaria: medico.disponibilidad_horaria,
      contacto_directo: medico.contacto_directo
    });
    setShowForm(true);
    setEditing(true);
    setSelectedMedico(medico);
  };

  // Guardar médico (crear o actualizar)
  const handleSaveMedico = async () => {
    try {
      setError(null);
      
      // Validaciones básicas
      if (!formData.usuario_id || !formData.especialidad || !formData.centro_id) {
        setError('Usuario, especialidad y centro de salud son requeridos');
        return;
      }

      if (editing && selectedMedico) {
        // Actualizar médico existente
        await axios.put(`http://localhost:5000/api/medicos/${selectedMedico._id}`, formData);
        alert('Médico actualizado exitosamente');
      } else {
        // Crear nuevo médico
        await axios.post('http://localhost:5000/api/medicos', formData);
        alert('Médico creado exitosamente');
      }

      // Limpiar y recargar
      setShowForm(false);
      setEditing(false);
      setSelectedMedico(null);
      fetchMedicos();
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar médico');
      console.error('Error:', err);
    }
  };

  // Eliminar médico
  const handleDeleteMedico = async (medicoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este médico?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/medicos/${medicoId}`);
      alert('Médico eliminado exitosamente');
      fetchMedicos();
    } catch (err) {
      setError('Error al eliminar médico');
    }
  };

  // Activar/desactivar médico
  const handleToggleMedico = async (medicoId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/medicos/${medicoId}/toggle`);
      alert(`Médico ${currentStatus ? 'desactivado' : 'activado'} exitosamente`);
      fetchMedicos();
    } catch (err) {
      setError('Error al cambiar estado del médico');
    }
  };

  // Cancelar edición/creación
  const handleCancel = () => {
    setShowForm(false);
    setEditing(false);
    setSelectedMedico(null);
    setError(null);
  };

  // Función auxiliar para obtener nombre seguro del médico
  const getMedicoNombre = (medico) => {
    return medico.usuario_id?.nombre || 'N/A';
  };

  // Función auxiliar para obtener email seguro del médico
  const getMedicoEmail = (medico) => {
    return medico.usuario_id?.email || 'N/A';
  };

  // Función auxiliar para obtener RUT seguro del médico
  const getMedicoRut = (medico) => {
    return medico.usuario_id?.rut || 'N/A';
  };

  if (loading) return <div className="text-center mt-4"><p>Cargando médicos...</p></div>;
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Gestión de Médicos</h2>

          {/* Barra de búsqueda y botones */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre o especialidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-outline-secondary" onClick={handleSearch}>
                  🔍
                </button>
              </div>
            </div>
            <div className="col-md-6 text-end">
              <button className="btn btn-success" onClick={handleNewMedico}>
                + Agregar Médico
              </button>
              <button className="btn btn-outline-secondary ms-2" onClick={fetchMedicos}>
                🔄 Actualizar
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          {/* Formulario de creación/edición */}
          {showForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h5>{editing ? 'Editar Médico' : 'Nuevo Médico'}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Usuario *</label>
                      <select
                        className="form-select"
                        value={formData.usuario_id}
                        onChange={(e) => setFormData({ ...formData, usuario_id: e.target.value })}
                        disabled={editing} // No permitir cambiar usuario en edición
                      >
                        <option value="">Seleccionar usuario</option>
                        {usuarios.map(usuario => (
                          <option key={usuario._id} value={usuario._id}>
                            {usuario.nombre} - {usuario.email} - {usuario.rut}
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">
                        {editing 
                          ? 'No se puede cambiar el usuario asociado' 
                          : 'Selecciona un usuario con rol médico'
                        }
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Especialidad *</label>
                      <select
                        className="form-select"
                        value={formData.especialidad}
                        onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                      >
                        <option value="">Seleccionar especialidad</option>
                        {especialidades.map(especialidad => (
                          <option key={especialidad._id} value={especialidad.nombre}>
                            {especialidad.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Centro de Salud *</label>
                      <select
                        className="form-select"
                        value={formData.centro_id}
                        onChange={(e) => setFormData({ ...formData, centro_id: e.target.value })}
                      >
                        <option value="">Seleccionar centro de salud</option>
                        {centrosSalud.map(centro => (
                          <option key={centro._id} value={centro._id}>
                            {centro.nombre} - {centro.comuna}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Título Profesional</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.titulo_profesional}
                        onChange={(e) => setFormData({ ...formData, titulo_profesional: e.target.value })}
                        placeholder="Ej: Médico Cirujano"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Institución de Formación</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.institucion_formacion}
                        onChange={(e) => setFormData({ ...formData, institucion_formacion: e.target.value })}
                        placeholder="Ej: Universidad de Chile"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Años de Experiencia</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.años_experiencia}
                        onChange={(e) => setFormData({ ...formData, años_experiencia: e.target.value })}
                        placeholder="0-60"
                        min="0"
                        max="60"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Disponibilidad Horaria</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.disponibilidad_horaria}
                        onChange={(e) => setFormData({ ...formData, disponibilidad_horaria: e.target.value })}
                        placeholder="Ej: Lunes a Viernes 8:00-18:00"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Contacto Directo</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.contacto_directo}
                        onChange={(e) => setFormData({ ...formData, contacto_directo: e.target.value })}
                        placeholder="Teléfono o email de contacto"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <button className="btn btn-primary me-2" onClick={handleSaveMedico}>
                    {editing ? 'Actualizar' : 'Crear'} Médico
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de médicos */}
          <div className="card">
            <div className="card-header">
              <h5>Lista de Médicos ({medicos.length})</h5>
            </div>
            <div className="card-body">
              {medicos.length === 0 ? (
                <p className="text-center text-muted">No hay médicos registrados</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>RUT</th>
                        <th>Especialidad</th>
                        <th>Centro</th>
                        <th>Estado</th>
                        <th style={{ width: 180 }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicos.map((medico) => (
                        <tr key={medico._id} className={!medico.activo ? 'table-secondary' : ''}>
                          <td>
                            {getMedicoNombre(medico)}
                            {!medico.activo && <span className="badge bg-warning ms-1">Inactivo</span>}
                          </td>
                          <td>{getMedicoEmail(medico)}</td>
                          <td>{getMedicoRut(medico)}</td>
                          <td>{medico.especialidad}</td>
                          <td>{medico.centro_id?.nombre || 'N/A'}</td>
                          <td>
                            <span className={`badge ${medico.activo ? 'bg-success' : 'bg-danger'}`}>
                              {medico.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEditMedico(medico)}
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-outline-warning"
                                onClick={() => handleToggleMedico(medico._id, medico.activo)}
                                title={medico.activo ? 'Desactivar' : 'Activar'}
                              >
                                {medico.activo ? '⏸️' : '▶️'}
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeleteMedico(medico._id)}
                                title="Eliminar"
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