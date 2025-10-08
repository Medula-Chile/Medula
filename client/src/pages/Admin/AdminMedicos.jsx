import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminMedicos() {
  const [medicos, setMedicos] = useState([]);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [pacienteData, setPacienteData] = useState({});
  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const res = await axios.get('/api/medicos');
        setMedicos(res.data);
      } catch (err) {
        setError('Error al cargar médicos');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicos();
  }, []);

  const handleSelectMedico = async (medico) => {
    setSelectedMedico(medico);
    setSelectedPaciente(null);
    try {
      const res = await axios.get(`/api/administradores/pacientes-por-medico/${medico.usuario_id}`);
      setPacientes(res.data);
    } catch (err) {
      setError('Error al cargar pacientes del médico');
    }
  };

  const handleSelectPaciente = async (paciente) => {
    setSelectedPaciente(paciente);
    setPacienteData({ ...paciente.usuario_id });
    setEditing(false);
    try {
      const res = await axios.get(`/api/examenes/paciente/${paciente.usuario_id._id}`);
      setExamenes(res.data);
    } catch (err) {
      setError('Error al cargar exámenes del paciente');
    }
  };

  const handleEditPaciente = () => {
    setEditing(true);
  };

  const handleSavePaciente = async () => {
    try {
      await axios.put(`/api/pacientes/${selectedPaciente.usuario_id._id}`, pacienteData);
      setEditing(false);
      // Refresh paciente data
      const updatedPaciente = { ...selectedPaciente, usuario_id: pacienteData };
      setSelectedPaciente(updatedPaciente);
      alert('Datos del paciente actualizados');
    } catch (err) {
      setError('Error al actualizar paciente');
    }
  };

  const handleCancelEdit = () => {
    setPacienteData({ ...selectedPaciente.usuario_id });
    setEditing(false);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Gestionar Médicos</h2>

      <div className="row">
        <div className="col-md-4">
          <h3>Seleccionar Médico</h3>
          <ul className="list-group">
            {medicos.map((medico) => (
              <li
                key={medico._id}
                className={`list-group-item ${selectedMedico && selectedMedico._id === medico._id ? 'active' : ''}`}
                onClick={() => handleSelectMedico(medico)}
                style={{ cursor: 'pointer' }}
              >
                {medico.usuario_id.nombre}
              </li>
            ))}
          </ul>
        </div>

        {selectedMedico && (
          <div className="col-md-8">
            <h3>Pacientes de {selectedMedico.usuario_id.nombre}</h3>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>RUT</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((paciente) => (
                  <tr key={paciente._id}>
                    <td>{paciente.usuario_id.nombre}</td>
                    <td>{paciente.usuario_id.email}</td>
                    <td>{paciente.usuario_id.Rut}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSelectPaciente(paciente)}
                      >
                        Ver/Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPaciente && (
        <div className="mt-4">
          <h3>Datos del Paciente: {selectedPaciente.usuario_id.nombre}</h3>
          <div className="row">
            <div className="col-md-6">
              <div className="card p-3">
                <h4>Información Personal</h4>
                {editing ? (
                  <form>
                    <div className="mb-2">
                      <label>Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pacienteData.nombre || ''}
                        onChange={(e) => setPacienteData({ ...pacienteData, nombre: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={pacienteData.email || ''}
                        onChange={(e) => setPacienteData({ ...pacienteData, email: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label>RUT</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pacienteData.Rut || ''}
                        onChange={(e) => setPacienteData({ ...pacienteData, Rut: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label>Fecha de Nacimiento</label>
                      <input
                        type="date"
                        className="form-control"
                        value={pacienteData.fecha_nacimiento ? pacienteData.fecha_nacimiento.split('T')[0] : ''}
                        onChange={(e) => setPacienteData({ ...pacienteData, fecha_nacimiento: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label>Teléfono</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pacienteData.telefono || ''}
                        onChange={(e) => setPacienteData({ ...pacienteData, telefono: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label>Dirección</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pacienteData.direccion || ''}
                        onChange={(e) => setPacienteData({ ...pacienteData, direccion: e.target.value })}
                      />
                    </div>
                    <button type="button" className="btn btn-success me-2" onClick={handleSavePaciente}>
                      Guardar
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <div>
                    <p><strong>Nombre:</strong> {pacienteData.nombre}</p>
                    <p><strong>Email:</strong> {pacienteData.email}</p>
                    <p><strong>RUT:</strong> {pacienteData.Rut}</p>
                    <p><strong>Fecha de Nacimiento:</strong> {pacienteData.fecha_nacimiento ? new Date(pacienteData.fecha_nacimiento).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Teléfono:</strong> {pacienteData.telefono}</p>
                    <p><strong>Dirección:</strong> {pacienteData.direccion}</p>
                    <button className="btn btn-warning" onClick={handleEditPaciente}>
                      Editar
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="card p-3">
                <h4>Exámenes del Paciente</h4>
                {examenes.length > 0 ? (
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th>Resultado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examenes.map((examen) => (
                        <tr key={examen._id}>
                          <td>{examen.tipo}</td>
                          <td>{new Date(examen.fecha).toLocaleDateString()}</td>
                          <td>{examen.resultado}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No hay exámenes registrados.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
