import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminCitas() {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    paciente_id: '',
    profesional_id: '',
    centro_id: '',
    fecha_hora: '',
    motivo: '',
    notas: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pacientesRes, medicosRes, centrosRes] = await Promise.all([
          axios.get('/api/pacientes'),
          axios.get('/api/medicos'),
          axios.get('/api/centros')
        ]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/administradores/citas', form);
      alert('Cita creada exitosamente');
      setForm({
        paciente_id: '',
        profesional_id: '',
        centro_id: '',
        fecha_hora: '',
        motivo: '',
        notas: ''
      });
    } catch (err) {
      setError('Error al crear cita');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Crear Cita</h2>
      <form onSubmit={handleSubmit} className="card p-3">
        <div className="row g-2">
          <div className="col-md-6">
            <label>Paciente</label>
            <select className="form-select" value={form.paciente_id} onChange={(e) => setForm({ ...form, paciente_id: e.target.value })} required>
              <option value="">Seleccionar paciente</option>
              {pacientes.map(p => <option key={p._id} value={p._id}>{p.usuario_id.nombre}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label>Profesional</label>
            <select className="form-select" value={form.profesional_id} onChange={(e) => setForm({ ...form, profesional_id: e.target.value })} required>
              <option value="">Seleccionar profesional</option>
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
            <input type="text" className="form-control" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} required />
          </div>
          <div className="col-12">
            <label>Notas</label>
            <textarea className="form-control" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} rows="3"></textarea>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-success">Crear Cita</button>
          </div>
        </div>
      </form>
    </div>
  );
}
