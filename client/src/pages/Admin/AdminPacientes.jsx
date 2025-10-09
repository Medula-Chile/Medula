import React, { useEffect, useState } from 'react';

const mockAsignaciones = [
  { paciente_id: 'p1', medico_id: 'm1', paciente: 'Juan Perez', medico: 'Dr. Carlos Gomez', fecha: new Date().toISOString(), estado: 'Activo' },
  { paciente_id: 'p2', medico_id: 'm2', paciente: 'Maria Lopez', medico: 'Dra. Ana Torres', fecha: new Date().toISOString(), estado: 'Activo' },
];



const mockPacientes = [
  { _id: 'p1', usuario_id: { nombre: 'Juan Perez', email: 'juan.perez@example.com', Rut: '12.345.678-9' } },
  { _id: 'p2', usuario_id: { nombre: 'Maria Lopez', email: 'maria.lopez@example.com', Rut: '98.765.432-1' } },
];

const mockMedicos = [
  { _id: 'm1', usuario_id: { nombre: 'Dr. Carlos Gomez' } },
  { _id: 'm2', usuario_id: { nombre: 'Dra. Ana Torres' } },
];

const mockCentros = [
  { _id: 'c1', nombre: 'Centro Salud Norte' },
  { _id: 'c2', nombre: 'Clinica Central' },
];




export default function AdminPacientes() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    paciente_id: '',
    medico_id: '',
    centro_id: '',
    fecha_hora: '',
    motivo: ''
  });
  const [selectedMedicoId, setSelectedMedicoId] = useState('');
  const [pacientesPorMedico, setPacientesPorMedico] = useState([]);

  useEffect(() => {
    // Simulate data loading with mock data
    setTimeout(() => {
      setAsignaciones(mockAsignaciones);
      setPacientes(mockPacientes);
      setMedicos(mockMedicos);
      setCentros(mockCentros);
      setLoading(false);
    }, 500);
  }, []);

  const handleAssign = (e) => {
    e.preventDefault();
    // For demo, just add to asignaciones state
    const paciente = pacientes.find(p => p._id === form.paciente_id);
    const medico = medicos.find(m => m._id === form.medico_id);
    const newAsignacion = {
      paciente_id: form.paciente_id,
      medico_id: form.medico_id,
      paciente: paciente ? paciente.usuario_id.nombre : '',
      medico: medico ? medico.usuario_id.nombre : '',
      fecha: form.fecha_hora,
      estado: 'Activo'
    };
    setAsignaciones([...asignaciones, newAsignacion]);
    setShowForm(false);
    setForm({ paciente_id: '', medico_id: '', centro_id: '', fecha_hora: '', motivo: '' });
  };

  const handleUnassign = (paciente_id, medico_id) => {
    if (!window.confirm('¿Desasignar este paciente del médico?')) return;
    setAsignaciones(asignaciones.filter(a => !(a.paciente_id === paciente_id && a.medico_id === medico_id)));
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestionar Pacientes</h2>

      <div className="mb-3">
        <label className="form-label">Filtrar pacientes por médico:</label>
        <select
          className="form-select"
          value={selectedMedicoId}
          onChange={(e) => {
            const medicoId = e.target.value;
            setSelectedMedicoId(medicoId);
            if (medicoId) {
              const pacientesFiltrados = asignaciones
                .filter(a => a.medico_id === medicoId)
                .map(a => pacientes.find(p => p._id === a.paciente_id))
                .filter(Boolean);
              setPacientesPorMedico(pacientesFiltrados);
            } else {
              setPacientesPorMedico([]);
            }
          }}
        >
          <option value="">Seleccionar médico</option>
          {medicos.map(m => (
            <option key={m._id} value={m._id}>{m.usuario_id.nombre}</option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Asignar Paciente'}
      </button>

      {showForm && (
        <form onSubmit={handleAssign} className="card p-3 mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="pacienteSelect" className="form-label">Paciente</label>
              <select
                id="pacienteSelect"
                className="form-select"
                value={form.paciente_id}
                onChange={(e) => setForm({ ...form, paciente_id: e.target.value })}
                required
              >
                <option value="">Seleccionar paciente</option>
                {pacientes.map(p => (
                  <option key={p._id} value={p._id}>{p.usuario_id.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="medicoSelect" className="form-label">Médico</label>
              <select
                id="medicoSelect"
                className="form-select"
                value={form.medico_id}
                onChange={(e) => setForm({ ...form, medico_id: e.target.value })}
                required
              >
                <option value="">Seleccionar médico</option>
                {medicos.map(m => (
                  <option key={m._id} value={m._id}>{m.usuario_id.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="centroSelect" className="form-label">Centro</label>
              <select
                id="centroSelect"
                className="form-select"
                value={form.centro_id}
                onChange={(e) => setForm({ ...form, centro_id: e.target.value })}
                required
              >
                <option value="">Seleccionar centro</option>
                {centros.map(c => (
                  <option key={c._id} value={c._id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="fechaHora" className="form-label">Fecha y Hora</label>
              <input
                type="datetime-local"
                id="fechaHora"
                className="form-control"
                value={form.fecha_hora}
                onChange={(e) => setForm({ ...form, fecha_hora: e.target.value })}
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="motivo" className="form-label">Motivo</label>
              <input
                type="text"
                id="motivo"
                className="form-control"
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                placeholder="Motivo de la asignación"
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Asignando...' : 'Asignar'}
              </button>
            </div>
          </div>
        </form>
      )}
      <h3>Asignaciones Actuales</h3>
      <table className="table table-bordered">
    <thead>
      <tr>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asignaciones.map((a) => (
            <tr key={`${a.paciente_id}-${a.medico_id}`}>
              <td>{a.paciente}</td>
              <td>{a.medico}</td>
              <td>{new Date(a.fecha).toLocaleString()}</td>
              <td>{a.estado}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleUnassign(a.paciente_id, a.medico_id)}>
                  Desasignar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMedicoId && (
        <>
          <h3>Pacientes asignados al médico seleccionado</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>RUT</th>
              </tr>
            </thead>
            <tbody>
              {pacientesPorMedico.map(p => (
                <tr key={p._id}>
                  <td>{p.usuario_id.nombre}</td>
                  <td>{p.usuario_id.email}</td>
                  <td>{p.usuario_id.Rut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
