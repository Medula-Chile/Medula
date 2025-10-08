import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    const fetchData = async () => {
      try {
        const [asignacionesRes, pacientesRes, medicosRes, centrosRes] = await Promise.all([
          axios.get('/api/administradores/pacientes-asignados'),
          axios.get('/api/pacientes'),
          axios.get('/api/medicos'),
          axios.get('/api/centros')
        ]);
        setAsignaciones(asignacionesRes.data);
        setPacientes(pacientesRes.data);
        setMedicos(medicosRes.data);
        setCentros(centrosRes.data);
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/administradores/asignar-paciente', form);
      setShowForm(false);
      setForm({ paciente_id: '', medico_id: '', centro_id: '', fecha_hora: '', motivo: '' });
      // Refresh asignaciones
      const res = await axios.get('/api/administradores/pacientes-asignados');
      setAsignaciones(res.data);
    } catch (err) {
      setError('Error al asignar paciente');
    }
  };

  const handleUnassign = async (paciente_id, medico_id) => {
    if (!window.confirm('¿Desasignar este paciente del médico?')) return;
    try {
      await axios.post('/api/administradores/desasignar-paciente', { paciente_id, medico_id });
      // Refresh asignaciones
      const res = await axios.get('/api/administradores/pacientes-asignados');
      setAsignaciones(res.data);
    } catch (err) {
      setError('Error al desasignar paciente');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Gestionar Pacientes</h2>

      <div className="mb-3">
        <label>Filtrar pacientes por médico:</label>
        <select
          className="form-select"
          value={selectedMedicoId}
          onChange={async (e) => {
            const medicoId = e.target.value;
            setSelectedMedicoId(medicoId);
            if (medicoId) {
              try {
                const res = await axios.get(`/api/administradores/pacientes-por-medico/${medicoId}`);
                setPacientesPorMedico(res.data);
              } catch (err) {
                setError('Error al cargar pacientes por médico');
              }
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
        <form onSubmit={handleAssign} className="card p-3 mb-3">
          <div className="row g-2">
            <div className="col-md-6">
              <label>Paciente</label>
              <select className="form-select" value={form.paciente_id} onChange={(e) => setForm({ ...form, paciente_id: e.target.value })} required>
                <option value="">Seleccionar paciente</option>
                {pacientes.map(p => <option key={p._id} value={p._id}>{p.usuario_id.nombre}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label>Médico</label>
              <select className="form-select" value={form.medico_id} onChange={(e) => setForm({ ...form, medico_id: e.target.value })} required>
                <option value="">Seleccionar médico</option>
                {medicos.map(m => <option key={m._id} value={m.usuario_id}>{m.usuario_id.nombre}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label>Centro</label>
              <select className="form-select" value={form.centro_id} onChange={(e) => setForm({ ...form, centro_id: e.target.value })} required>
                <option value="">Seleccionar centro</option>
                {centros.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label>Fecha y Hora</label>
              <input type="datetime-local" className="form-control" value={form.fecha_hora} onChange={(e) => setForm({ ...form, fecha_hora: e.target.value })} required />
            </div>
            <div className="col-12">
              <label>Motivo</label>
              <input type="text" className="form-control" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} placeholder="Motivo de la asignación" />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success">Asignar</button>
            </div>
          </div>
        </form>
      )}

      <h3>Asignaciones Actuales</h3>
      <table className="table table-striped">
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
