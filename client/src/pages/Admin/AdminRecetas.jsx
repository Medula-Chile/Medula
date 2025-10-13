import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminRecetas() {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    paciente_id: '',
    medico_id: '',
    medicamentos: [{ nombre: '', dosis: '', frecuencia: '', duracion: '', instrucciones: '' }],
    indicaciones: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pacientesRes, medicosRes] = await Promise.all([
          api.get('/pacientes'),
          api.get('/medicos')
        ]);
        setPacientes(pacientesRes.data);
        setMedicos(medicosRes.data);
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
      await api.post('/administradores/recetas', form);
      alert('Receta creada exitosamente');
      setForm({
        paciente_id: '',
        medico_id: '',
        medicamentos: [{ nombre: '', dosis: '', frecuencia: '', duracion: '', instrucciones: '' }],
        indicaciones: ''
      });
    } catch (err) {
      setError('Error al crear receta');
    }
  };

  const addMedicamento = () => {
    setForm({
      ...form,
      medicamentos: [...form.medicamentos, { nombre: '', dosis: '', frecuencia: '', duracion: '', instrucciones: '' }]
    });
  };

  const updateMedicamento = (index, field, value) => {
    const newMedicamentos = [...form.medicamentos];
    newMedicamentos[index][field] = value;
    setForm({ ...form, medicamentos: newMedicamentos });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Crear Receta</h2>
      <form onSubmit={handleSubmit} className="card p-3">
        <div className="row g-2 mb-3">
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
              {medicos.map(m => <option key={m._id} value={m._id}>{m.usuario_id?.nombre || m.nombre}</option>)}
            </select>
          </div>
        </div>

        <h4>Medicamentos</h4>
        {form.medicamentos.map((med, index) => (
          <div key={index} className="border p-2 mb-2">
            <div className="row g-2">
              <div className="col-md-6">
                <label>Nombre</label>
                <input type="text" className="form-control" value={med.nombre} onChange={(e) => updateMedicamento(index, 'nombre', e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label>Dosis</label>
                <input type="text" className="form-control" value={med.dosis} onChange={(e) => updateMedicamento(index, 'dosis', e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label>Frecuencia</label>
                <input type="text" className="form-control" value={med.frecuencia} onChange={(e) => updateMedicamento(index, 'frecuencia', e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label>Duración</label>
                <input type="text" className="form-control" value={med.duracion} onChange={(e) => updateMedicamento(index, 'duracion', e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label>Instrucciones</label>
                <input type="text" className="form-control" value={med.instrucciones} onChange={(e) => updateMedicamento(index, 'instrucciones', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addMedicamento}>Agregar Medicamento</button>

        <div className="mb-3">
          <label>Indicaciones</label>
          <textarea className="form-control" value={form.indicaciones} onChange={(e) => setForm({ ...form, indicaciones: e.target.value })} rows="3"></textarea>
        </div>

        <button type="submit" className="btn btn-success">Crear Receta</button>
      </form>
    </div>
  );
}
