import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminExamenes() {
  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    tipo_examen: '',
    fecha_realizacion: '',
    resultado: '',
    archivo_adjunto: '',
    estado: '',
    observaciones: ''
  });
  const [pacientes, setPacientes] = useState([]);
  const [selectedPacienteId, setSelectedPacienteId] = useState('');

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await axios.get('/api/pacientes');
        setPacientes(res.data);
      } catch (err) {
        setError('Error al cargar pacientes');
      }
    };

    fetchPacientes();
  }, []);

  useEffect(() => {
    const fetchExamenes = async () => {
      try {
        if (selectedPacienteId) {
          const response = await axios.get(`/api/examenes/paciente/${selectedPacienteId}`);
          setExamenes(response.data);
        } else {
          const response = await axios.get('/api/administradores/examenes');
          setExamenes(response.data);
        }
      } catch (err) {
        setError('Error al cargar exámenes');
      } finally {
        setLoading(false);
      }
    };

    fetchExamenes();
  }, [selectedPacienteId]);

  const openEdit = (examen) => {
    setEditId(examen._id);
    setForm({
      tipo_examen: examen.tipo_examen || '',
      fecha_realizacion: examen.fecha_realizacion ? examen.fecha_realizacion.substring(0, 10) : '',
      resultado: examen.resultado || '',
      archivo_adjunto: examen.archivo_adjunto || '',
      estado: examen.estado || '',
      observaciones: examen.observaciones || ''
    });
  };

  const closeEdit = () => {
    setEditId(null);
    setForm({
      tipo_examen: '',
      fecha_realizacion: '',
      resultado: '',
      archivo_adjunto: '',
      estado: '',
      observaciones: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/administradores/examenes/${editId}`, form);
      alert('Examen actualizado exitosamente');
      closeEdit();
      // Refresh list
      if (selectedPacienteId) {
        const response = await axios.get(`/api/examenes/paciente/${selectedPacienteId}`);
        setExamenes(response.data);
      } else {
        const response = await axios.get('/api/administradores/examenes');
        setExamenes(response.data);
      }
    } catch (err) {
      setError('Error al actualizar examen');
    }
  };

  if (loading) return <p>Cargando exámenes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Ver y Editar Exámenes</h2>

      <div className="mb-3">
        <label>Filtrar exámenes por paciente:</label>
        <select
          className="form-select"
          value={selectedPacienteId}
          onChange={(e) => setSelectedPacienteId(e.target.value)}
        >
          <option value="">Seleccionar paciente</option>
          {pacientes.map(p => (
            <option key={p._id} value={p._id}>{p.usuario_id.nombre}</option>
          ))}
        </select>
      </div>

      <table className="table table-striped mb-3">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Fecha Realización</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {examenes.map((ex) => (
            <tr key={ex._id}>
              <td>{ex.tipo_examen}</td>
              <td>{ex.fecha_realizacion ? new Date(ex.fecha_realizacion).toLocaleDateString() : '-'}</td>
              <td>{ex.estado}</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => openEdit(ex)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editId && (
        <form onSubmit={handleSubmit} className="card p-3">
          <div className="mb-3">
            <label>Tipo de Examen</label>
            <input type="text" className="form-control" value={form.tipo_examen} onChange={(e) => setForm({ ...form, tipo_examen: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label>Fecha de Realización</label>
            <input type="date" className="form-control" value={form.fecha_realizacion} onChange={(e) => setForm({ ...form, fecha_realizacion: e.target.value })} />
          </div>
          <div className="mb-3">
            <label>Resultado</label>
            <textarea className="form-control" value={form.resultado} onChange={(e) => setForm({ ...form, resultado: e.target.value })} rows="3" />
          </div>
          <div className="mb-3">
            <label>Archivo Adjunto (URL)</label>
            <input type="text" className="form-control" value={form.archivo_adjunto} onChange={(e) => setForm({ ...form, archivo_adjunto: e.target.value })} />
          </div>
          <div className="mb-3">
            <label>Estado</label>
            <select className="form-select" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} required>
              <option value="">Seleccionar estado</option>
              <option value="solicitado">Solicitado</option>
              <option value="realizado">Realizado</option>
              <option value="analizado">Analizado</option>
              <option value="entregado">Entregado</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Observaciones</label>
            <textarea className="form-control" value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} rows="3" />
          </div>
          <button type="submit" className="btn btn-success">Guardar Cambios</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={closeEdit}>Cancelar</button>
        </form>
      )}
    </div>
  );
}
