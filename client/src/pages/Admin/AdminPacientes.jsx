import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el formulario
  const [formData, setFormData] = useState({
    usuario_id: '',
    fecha_nacimiento: '',
    sexo: 'masculino',
    direccion: '',
    telefono: '',
    prevision: '',
    alergias: [],
    enfermedades_cronicas: [],
    // Campos de usuario para mostrar/editar
    usuario_nombre: '',
    usuario_email: '',
    usuario_rut: ''
  });

  // Cargar datos al iniciar
  useEffect(() => {
    fetchPacientes();
    fetchUsuariosPacientes();
  }, []);

  // Obtener todos los pacientes
  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/pacientes');
      setPacientes(response.data.pacientes || response.data);
    } catch (err) {
      setError('Error al cargar pacientes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener usuarios con rol paciente para el formulario
  const fetchUsuariosPacientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users?rol=paciente');
      setUsuarios(response.data.usuarios || response.data);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    }
  };

  // Buscar pacientes
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchPacientes();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/pacientes/buscar?q=${searchTerm}`);
      setPacientes(response.data.pacientes || response.data);
    } catch (err) {
      setError('Error al buscar pacientes');
    } finally {
      setLoading(false);
    }
  };

  // Abrir formulario para crear paciente
  const handleNewPaciente = () => {
    setFormData({
      usuario_id: '',
      fecha_nacimiento: '',
      sexo: 'masculino',
      direccion: '',
      telefono: '',
      prevision: '',
      alergias: [],
      enfermedades_cronicas: [],
      usuario_nombre: '',
      usuario_email: '',
      usuario_rut: ''
    });
    setShowForm(true);
    setEditing(false);
    setSelectedPaciente(null);
    setError('');
  };

  // Abrir formulario para editar paciente
  const handleEditPaciente = (paciente) => {
    setFormData({
      usuario_id: paciente.usuario_id._id,
      fecha_nacimiento: paciente.fecha_nacimiento ? paciente.fecha_nacimiento.split('T')[0] : '',
      sexo: paciente.sexo,
      direccion: paciente.direccion,
      telefono: paciente.telefono,
      prevision: paciente.prevision,
      alergias: paciente.alergias || [],
      enfermedades_cronicas: paciente.enfermedades_cronicas || [],
      usuario_nombre: paciente.usuario_id?.nombre || '',
      usuario_email: paciente.usuario_id?.email || '',
      usuario_rut: paciente.usuario_id?.rut || ''
    });
    setShowForm(true);
    setEditing(true);
    setSelectedPaciente(paciente);
    setError('');
  };

  // Cuando se selecciona un usuario en el formulario
  const handleUsuarioChange = (usuarioId) => {
    const usuarioSeleccionado = usuarios.find(u => u._id === usuarioId);
    setFormData({
      ...formData,
      usuario_id: usuarioId,
      usuario_nombre: usuarioSeleccionado?.nombre || '',
      usuario_email: usuarioSeleccionado?.email || '',
      usuario_rut: usuarioSeleccionado?.rut || ''
    });
  };

  // Guardar paciente (crear o actualizar)
  const handleSavePaciente = async () => {
    try {
      setError('');

      // Validaciones básicas
      if (!formData.usuario_id || !formData.fecha_nacimiento || !formData.direccion || !formData.telefono || !formData.prevision) {
        setError('Usuario, fecha de nacimiento, dirección, teléfono y previsión son requeridos');
        return;
      }

      // Preparar datos para enviar (solo los campos del paciente)
      const pacienteData = {
        usuario_id: formData.usuario_id,
        fecha_nacimiento: formData.fecha_nacimiento,
        sexo: formData.sexo,
        direccion: formData.direccion,
        telefono: formData.telefono,
        prevision: formData.prevision,
        alergias: formData.alergias,
        enfermedades_cronicas: formData.enfermedades_cronicas
      };

      if (editing && selectedPaciente) {
        // Actualizar paciente existente
        await axios.put(`http://localhost:5000/api/pacientes/${selectedPaciente._id}`, pacienteData);
        alert('Paciente actualizado exitosamente');
      } else {
        // Crear nuevo paciente
        await axios.post('http://localhost:5000/api/pacientes', pacienteData);
        alert('Paciente creado exitosamente');
      }

      // Limpiar y recargar
      setShowForm(false);
      setEditing(false);
      setSelectedPaciente(null);
      fetchPacientes();
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar paciente');
      console.error('Error:', err);
    }
  };

  // Eliminar paciente
  const handleDeletePaciente = async (pacienteId, nombre) => {
    const nombreMostrar = nombre || 'el paciente';
    if (!window.confirm(`¿Eliminar a ${nombreMostrar}? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/pacientes/${pacienteId}`);
      alert('Paciente eliminado exitosamente');
      fetchPacientes();
    } catch (err) {
      setError('Error al eliminar paciente');
    }
  };

  // Toggle activo/inactivo
  const handleTogglePaciente = async (pacienteId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/pacientes/${pacienteId}/toggle`);
      alert(`Paciente ${currentStatus ? 'desactivado' : 'activado'} exitosamente`);
      fetchPacientes();
    } catch (err) {
      setError('Error al cambiar estado del paciente');
    }
  };

  // Manejar arrays (alergias, enfermedades)
  const handleArrayInput = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: items });
  };

  // Cancelar edición/creación
  const handleCancel = () => {
    setShowForm(false);
    setEditing(false);
    setSelectedPaciente(null);
    setError('');
  };

  // Función auxiliar para obtener nombre seguro del paciente
  const getPacienteNombre = (paciente) => {
    return paciente.usuario_id?.nombre || paciente.usuario_nombre || 'N/A';
  };

  // Función auxiliar para obtener email seguro del paciente
  const getPacienteEmail = (paciente) => {
    return paciente.usuario_id?.email || paciente.usuario_email || 'N/A';
  };

  // Función auxiliar para obtener RUT seguro del paciente
  const getPacienteRut = (paciente) => {
    return paciente.usuario_id?.rut || paciente.usuario_rut || 'N/A';
  };

  if (loading) return <div className="text-center mt-4"><p>Cargando pacientes...</p></div>;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Gestión de Pacientes</h2>

          {/* Barra de búsqueda y botones */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre o RUT..."
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
              <button className="btn btn-success" onClick={handleNewPaciente}>
                + Agregar Paciente
              </button>
              <button className="btn btn-outline-secondary ms-2" onClick={fetchPacientes}>
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
                <h5>{editing ? 'Editar Paciente' : 'Nuevo Paciente'}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Usuario *</label>
                      <select
                        className="form-select"
                        value={formData.usuario_id}
                        onChange={(e) => handleUsuarioChange(e.target.value)}
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
                          : 'Selecciona un usuario con rol paciente'
                        }
                      </small>
                    </div>

                    {formData.usuario_id && (
                      <div className="card bg-light p-3 mb-3">
                        <h6>Información del Usuario Seleccionado:</h6>
                        <p><strong>Nombre:</strong> {formData.usuario_nombre}</p>
                        <p><strong>Email:</strong> {formData.usuario_email}</p>
                        <p><strong>RUT:</strong> {formData.usuario_rut}</p>
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Fecha de Nacimiento *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.fecha_nacimiento}
                        onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Sexo *</label>
                      <select
                        className="form-select"
                        value={formData.sexo}
                        onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                      >
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Dirección *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        placeholder="Dirección completa"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Teléfono *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="+56912345678"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Previsión *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.prevision}
                        onChange={(e) => setFormData({ ...formData, prevision: e.target.value })}
                        placeholder="FONASA, ISAPRE, etc."
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Alergias</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => handleArrayInput('alergias', e.target.value)}
                        placeholder="Separar por comas: Penicilina, Mariscos, etc."
                      />
                      <small className="text-muted">Alergias actuales: {formData.alergias.join(', ') || 'Ninguna'}</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Enfermedades Crónicas</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => handleArrayInput('enfermedades_cronicas', e.target.value)}
                        placeholder="Separar por comas: Diabetes, Hipertensión, etc."
                      />
                      <small className="text-muted">Enfermedades actuales: {formData.enfermedades_cronicas.join(', ') || 'Ninguna'}</small>
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <button className="btn btn-primary me-2" onClick={handleSavePaciente}>
                    {editing ? 'Actualizar' : 'Crear'} Paciente
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de pacientes */}
          <div className="card">
            <div className="card-header">
              <h5>Lista de Pacientes ({pacientes.length})</h5>
            </div>
            <div className="card-body">
              {pacientes.length === 0 ? (
                <p className="text-center text-muted">No hay pacientes registrados</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>RUT</th>
                        <th>Teléfono</th>
                        <th>Previsión</th>
                        <th>Estado</th>
                        <th style={{ width: 180 }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pacientes.map(paciente => (
                        <tr key={paciente._id} className={!paciente.activo ? 'table-secondary' : ''}>
                          <td>
                            {getPacienteNombre(paciente)}
                            {!paciente.activo && <span className="badge bg-warning ms-1">Inactivo</span>}
                          </td>
                          <td>{getPacienteEmail(paciente)}</td>
                          <td>{getPacienteRut(paciente)}</td>
                          <td>{paciente.telefono}</td>
                          <td>{paciente.prevision}</td>
                          <td>
                            <span className={`badge ${paciente.activo ? 'bg-success' : 'bg-danger'}`}>
                              {paciente.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEditPaciente(paciente)}
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-outline-warning"
                                onClick={() => handleTogglePaciente(paciente._id, paciente.activo)}
                                title={paciente.activo ? 'Desactivar' : 'Activar'}
                              >
                                {paciente.activo ? '⏸️' : '▶️'}
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeletePaciente(paciente._id, getPacienteNombre(paciente))}
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