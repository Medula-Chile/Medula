import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminCitas() {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [centros, setCentros] = useState([]);
  const [selectedCita, setSelectedCita] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el formulario
  const [formData, setFormData] = useState({
    paciente_id: '',
    profesional_id: '',
    centro_id: '',
    fecha_hora: '',
    motivo: '',
    estado: 'programada',
    notas: ''
  });

  // Cargar datos al iniciar
  useEffect(() => {
    fetchCitas();
    fetchPacientes();
    fetchMedicos();
    fetchCentros();
  }, []);

  // Obtener todas las citas
  const fetchCitas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/citas');
      // Asegurar que sea un array
      setCitas(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Error al cargar citas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener pacientes - CORREGIDO
  const fetchPacientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pacientes');
      // Manejar diferentes formatos de respuesta
      let pacientesData = response.data;
      
      // Si es un objeto con propiedad pacientes
      if (pacientesData && pacientesData.pacientes) {
        pacientesData = pacientesData.pacientes;
      }
      // Si es un objeto con propiedad data
      else if (pacientesData && pacientesData.data) {
        pacientesData = pacientesData.data;
      }
      
      // Asegurar que sea un array
      setPacientes(Array.isArray(pacientesData) ? pacientesData : []);
    } catch (err) {
      console.error('Error cargando pacientes:', err);
      setPacientes([]); // Asegurar que sea array vacío en caso de error
    }
  };

  // Obtener médicos - CORREGIDO
  const fetchMedicos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/medicos');
      // Manejar diferentes formatos de respuesta
      let medicosData = response.data;
      
      // Si es un objeto con propiedad medicos
      if (medicosData && medicosData.medicos) {
        medicosData = medicosData.medicos;
      }
      // Si es un objeto con propiedad data
      else if (medicosData && medicosData.data) {
        medicosData = medicosData.data;
      }
      
      // Asegurar que sea un array
      setMedicos(Array.isArray(medicosData) ? medicosData : []);
    } catch (err) {
      console.error('Error cargando médicos:', err);
      setMedicos([]); // Asegurar que sea array vacío en caso de error
    }
  };

  // Obtener centros de salud - CORREGIDO
  const fetchCentros = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/centros');
      // Manejar diferentes formatos de respuesta
      let centrosData = response.data;
      
      // Si es un objeto con propiedad centros
      if (centrosData && centrosData.centros) {
        centrosData = centrosData.centros;
      }
      // Si es un objeto con propiedad data
      else if (centrosData && centrosData.data) {
        centrosData = centrosData.data;
      }
      
      // Asegurar que sea un array
      setCentros(Array.isArray(centrosData) ? centrosData : []);
    } catch (err) {
      console.error('Error cargando centros:', err);
      setCentros([]); // Asegurar que sea array vacío en caso de error
    }
  };

  // Buscar citas
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCitas();
      return;
    }
    try {
      setLoading(true);
      // Búsqueda en frontend
      const citasFiltradas = citas.filter(cita => 
        (cita.paciente_id?.usuario_id?.nombre && cita.paciente_id.usuario_id.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cita.profesional_id?.nombre && cita.profesional_id.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cita.motivo && cita.motivo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cita.estado && cita.estado.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setCitas(citasFiltradas);
    } catch (err) {
      setError('Error al buscar citas');
    } finally {
      setLoading(false);
    }
  };

  // Abrir formulario para crear cita
  const handleNewCita = () => {
    setFormData({
      paciente_id: '',
      profesional_id: '',
      centro_id: '',
      fecha_hora: '',
      motivo: '',
      estado: 'programada',
      notas: ''
    });
    setShowForm(true);
    setEditing(false);
    setSelectedCita(null);
    setError('');
  };

  // Abrir formulario para editar cita
  const handleEditCita = (cita) => {
    // Formatear fecha para el input datetime-local
    const fechaHora = new Date(cita.fecha_hora);
    const fechaHoraFormateada = fechaHora.toISOString().slice(0, 16);
    
    setFormData({
      paciente_id: cita.paciente_id._id,
      profesional_id: cita.profesional_id._id,
      centro_id: cita.centro_id._id,
      fecha_hora: fechaHoraFormateada,
      motivo: cita.motivo,
      estado: cita.estado,
      notas: cita.notas || ''
    });
    setShowForm(true);
    setEditing(true);
    setSelectedCita(cita);
    setError('');
  };

  // Guardar cita (crear o actualizar)
  const handleSaveCita = async () => {
    try {
      setError('');

      // Validaciones básicas
      if (!formData.paciente_id || !formData.profesional_id || !formData.centro_id || !formData.fecha_hora || !formData.motivo) {
        setError('Paciente, médico, centro, fecha/hora y motivo son requeridos');
        return;
      }

      // Validar que la fecha no sea en el pasado
      const fechaCita = new Date(formData.fecha_hora);
      const ahora = new Date();
      if (fechaCita <= ahora) {
        setError('La fecha y hora de la cita debe ser futura');
        return;
      }

      if (formData.motivo.length > 500) {
        setError('El motivo no puede exceder los 500 caracteres');
        return;
      }

      if (formData.notas.length > 1000) {
        setError('Las notas no pueden exceder los 1000 caracteres');
        return;
      }

      // Preparar datos para enviar
      const citaData = {
        paciente_id: formData.paciente_id,
        profesional_id: formData.profesional_id,
        centro_id: formData.centro_id,
        fecha_hora: formData.fecha_hora,
        motivo: formData.motivo,
        estado: formData.estado,
        notas: formData.notas
      };

      if (editing && selectedCita) {
        // Actualizar cita existente
        const response = await axios.put(`http://localhost:5000/api/citas/${selectedCita._id}`, citaData);
        alert(response.data.message || 'Cita actualizada exitosamente');
      } else {
        // Crear nueva cita
        const response = await axios.post('http://localhost:5000/api/citas', citaData);
        alert(response.data.message || 'Cita creada exitosamente');
      }

      // Limpiar y recargar
      setShowForm(false);
      setEditing(false);
      setSelectedCita(null);
      fetchCitas();
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Error al guardar cita';
      setError(errorMessage);
      console.error('Error:', err);
    }
  };

  // Eliminar cita
  const handleDeleteCita = async (citaId, pacienteNombre) => {
    if (!window.confirm(`¿Eliminar la cita de ${pacienteNombre}? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/citas/${citaId}`);
      alert('Cita eliminada exitosamente');
      fetchCitas();
    } catch (err) {
      setError('Error al eliminar cita');
    }
  };

  // Cambiar estado de la cita
  const handleChangeEstado = async (citaId, nuevoEstado, pacienteNombre) => {
    if (!window.confirm(`¿Cambiar el estado de la cita de ${pacienteNombre} a "${nuevoEstado}"?`)) {
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/citas/${citaId}`, { estado: nuevoEstado });
      alert(`Estado de cita cambiado a "${nuevoEstado}" exitosamente`);
      fetchCitas();
    } catch (err) {
      setError('Error al cambiar estado de la cita');
    }
  };

  // Cancelar edición/creación
  const handleCancel = () => {
    setShowForm(false);
    setEditing(false);
    setSelectedCita(null);
    setError('');
  };

  // Función auxiliar para obtener nombre seguro del paciente
  const getPacienteNombre = (cita) => {
    return cita.paciente_id?.usuario_id?.nombre || 'N/A';
  };

  // Función auxiliar para obtener nombre seguro del médico
  const getMedicoNombre = (cita) => {
    return cita.profesional_id?.nombre || 'N/A';
  };

  // Función auxiliar para obtener nombre seguro del centro
  const getCentroNombre = (cita) => {
    return cita.centro_id?.nombre || 'N/A';
  };

  // Función para formatear fecha
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-CL');
  };

  // Función para obtener badge según estado
  const getEstadoBadge = (estado) => {
    const estados = {
      programada: 'bg-primary',
      confirmada: 'bg-success',
      completada: 'bg-info',
      cancelada: 'bg-danger',
      no_asistio: 'bg-warning'
    };
    return estados[estado] || 'bg-secondary';
  };

  // Función para obtener texto del estado
  const getEstadoTexto = (estado) => {
    const textos = {
      programada: 'Programada',
      confirmada: 'Confirmada',
      completada: 'Completada',
      cancelada: 'Cancelada',
      no_asistio: 'No Asistió'
    };
    return textos[estado] || estado;
  };

  if (loading) return <div className="text-center mt-4"><p>Cargando citas...</p></div>;

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-0">Gestión de Citas Médicas</h2>
          <p className="text-muted">Administrar citas del sistema</p>
        </div>
      </div>

      {/* Barra de búsqueda y botones */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por paciente, médico o motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-outline-secondary" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div className="col-12 col-md-6 text-md-end">
          <button className="btn btn-success me-2" onClick={handleNewCita}>
            <i className="fas fa-plus"></i> Agregar Cita
          </button>
          <button className="btn btn-outline-secondary" onClick={fetchCitas}>
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
          <div className="card-header">
            <h5>{editing ? 'Editar Cita Médica' : 'Nueva Cita Médica'}</h5>
          </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Paciente *</label>
                      <select
                        className="form-select"
                        value={formData.paciente_id}
                        onChange={(e) => setFormData({ ...formData, paciente_id: e.target.value })}
                      >
                        <option value="">Seleccionar paciente</option>
                        {/* CORREGIDO: Verificar que pacientes sea array */}
                        {Array.isArray(pacientes) && pacientes.map(paciente => (
                          <option key={paciente._id} value={paciente._id}>
                            {paciente.usuario_id?.nombre} - {paciente.usuario_id?.rut}
                          </option>
                        ))}
                      </select>
                      {!Array.isArray(pacientes) && (
                        <small className="text-danger">Error al cargar pacientes</small>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Médico *</label>
                      <select
                        className="form-select"
                        value={formData.profesional_id}
                        onChange={(e) => setFormData({ ...formData, profesional_id: e.target.value })}
                      >
                        <option value="">Seleccionar médico</option>
                        {/* CORREGIDO: Verificar que medicos sea array */}
                        {Array.isArray(medicos) && medicos.map(medico => (
                          <option key={medico._id} value={medico.usuario_id?._id}>
                            {medico.usuario_id?.nombre} - {medico.especialidad} - {medico.centro_id?.nombre}
                          </option>
                        ))}
                      </select>
                      {!Array.isArray(medicos) && (
                        <small className="text-danger">Error al cargar médicos</small>
                      )}
                      <small className="text-muted">
                        Se muestran médicos con sus especialidades y centros asignados
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Centro de Salud *</label>
                      <select
                        className="form-select"
                        value={formData.centro_id}
                        onChange={(e) => setFormData({ ...formData, centro_id: e.target.value })}
                      >
                        <option value="">Seleccionar centro</option>
                        {/* CORREGIDO: Verificar que centros sea array */}
                        {Array.isArray(centros) && centros.map(centro => (
                          <option key={centro._id} value={centro._id}>
                            {centro.nombre} - {centro.comuna}
                          </option>
                        ))}
                      </select>
                      {!Array.isArray(centros) && (
                        <small className="text-danger">Error al cargar centros</small>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Fecha y Hora *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formData.fecha_hora}
                        onChange={(e) => setFormData({ ...formData, fecha_hora: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Estado</label>
                      <select
                        className="form-select"
                        value={formData.estado}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      >
                        <option value="programada">Programada</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="no_asistio">No Asistió</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Motivo *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.motivo}
                        onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                        placeholder="Motivo de la consulta"
                        maxLength="500"
                      />
                      <small className="text-muted">
                        {formData.motivo.length}/500 caracteres
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Notas</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.notas}
                        onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                        placeholder="Notas adicionales..."
                        maxLength="1000"
                      />
                      <small className="text-muted">
                        {formData.notas.length}/1000 caracteres
                      </small>
                    </div>
                  </div>
                </div>

          <div className="text-end">
            <button className="btn btn-primary me-2" onClick={handleSaveCita}>
              {editing ? 'Actualizar' : 'Crear'} Cita
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Lista de citas */}
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0"><i className="fas fa-calendar-alt"></i> Lista de Citas Médicas <span className="badge bg-primary">{citas.length}</span></h5>
        </div>
        <div className="card-body">
          {citas.length === 0 ? (
            <p className="text-center text-muted">No hay citas médicas registradas</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-sm">
                <thead className="table-light">
                  <tr>
                    <th style={{minWidth: '120px'}}>Paciente</th>
                    <th style={{minWidth: '120px'}}>Médico</th>
                    <th style={{minWidth: '100px'}}>Centro</th>
                    <th style={{minWidth: '130px'}}>Fecha y Hora</th>
                    <th style={{minWidth: '150px'}}>Motivo</th>
                    <th style={{minWidth: '90px'}}>Estado</th>
                    <th className="text-center" style={{minWidth: '120px'}}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map(cita => {
                    const especialidad = Array.isArray(medicos) && medicos.find(m => m.usuario_id?._id === cita.profesional_id?._id)?.especialidad;
                    return (
                    <tr key={cita._id}>
                      <td>
                        <div>{getPacienteNombre(cita)}</div>
                      </td>
                      <td>
                        <div>{getMedicoNombre(cita)}</div>
                        {especialidad && <small className="text-muted">{especialidad}</small>}
                      </td>
                      <td className="small">{getCentroNombre(cita)}</td>
                      <td className="small">
                        {formatFecha(cita.fecha_hora)}
                      </td>
                      <td className="small text-truncate" style={{maxWidth: '200px'}}>
                        {cita.motivo}
                      </td>
                      <td>
                        <span className={`badge ${getEstadoBadge(cita.estado)}`}>
                          {getEstadoTexto(cita.estado)}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEditCita(cita)}
                            title="Editar"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-outline-success"
                            onClick={() => handleChangeEstado(cita._id, 'confirmada', getPacienteNombre(cita))}
                            title="Confirmar cita"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteCita(cita._id, getPacienteNombre(cita))}
                            title="Eliminar"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}