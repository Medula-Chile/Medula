import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatDateTime } from '../../utils/datetime';

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
  const [medicos, setMedicos] = useState([]);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        setError(null);
        const res = await api.get('/pacientes');
        const arr = Array.isArray(res.data) ? res.data : (res.data?.pacientes || []);
        setPacientes(arr);
      } catch (err) {
        console.error('[AdminExamenes] pacientes error:', err);
        setError('Error al cargar pacientes');
      }
    };
    const fetchMedicos = async () => {
      try {
        const res = await api.get('/medicos');
        const arr = Array.isArray(res.data) ? res.data : (res.data?.medicos || []);
        setMedicos(arr);
      } catch (err) {
        console.error('[AdminExamenes] medicos error:', err);
      }
    };

    fetchPacientes();
    fetchMedicos();
  }, []);

  useEffect(() => {
    const fetchExamenes = async () => {
      setLoading(true);
      try {
        setError(null);
        // Mostrar SIEMPRE todos los exámenes sin filtro
        const response = await api.get('/examenes');
        const data = Array.isArray(response.data) ? response.data : (response.data?.examenes || []);
        console.log('[AdminExamenes] Exámenes recibidos, cantidad:', data.length);
        console.log('[AdminExamenes] Datos completos:', data);
        if (data.length > 0) {
          console.log('[AdminExamenes] Primer examen completo:', JSON.stringify(data[0], null, 2));
          console.log('[AdminExamenes] medico_solicitante:', data[0]?.medico_solicitante);
          console.log('[AdminExamenes] medico_realizador:', data[0]?.medico_realizador);
        } else {
          console.log('[AdminExamenes] No hay exámenes en la base de datos');
        }
        setExamenes(data);
      } catch (err) {
        const msg = err?.response?.data?.message || 'Error al cargar exámenes';
        console.error('[AdminExamenes] examenes error:', err);
        setError(msg);
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
      observaciones: examen.observaciones || '',
      medico_realizador: (typeof examen?.medico_realizador === 'object') ? (examen?.medico_realizador?._id || examen?.medico_realizador?.id) : (examen?.medico_realizador || '')
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
      const payload = { ...form };
      // Si no se seleccionó realizador pero hay solicitante, no forzamos; el backend mantiene valor actual
      await api.put(`/administradores/examenes/${editId}`, payload);
      alert('Examen actualizado exitosamente');
      closeEdit();
      // Refresh list
      if (selectedPacienteId) {
        const response = await api.get(`/examenes/paciente/${selectedPacienteId}`);
        setExamenes(Array.isArray(response.data) ? response.data : (response.data?.examenes || []));
      } else {
        try {
          const response = await api.get('/administradores/examenes');
          setExamenes(Array.isArray(response.data) ? response.data : (response.data?.examenes || []));
        } catch (err2) {
          const response = await api.get('/examenes');
          setExamenes(Array.isArray(response.data) ? response.data : (response.data?.examenes || []));
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al actualizar examen';
      setError(msg);
    }
  };

  if (loading) return <p>Cargando exámenes...</p>;

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-0">Ver y Editar Exámenes</h2>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12 col-md-6 col-lg-4">
          <label className="form-label">Filtrar exámenes por paciente:</label>
          <select
            className="form-select"
            value={selectedPacienteId}
            onChange={(e) => setSelectedPacienteId(e.target.value)}
          >
            <option value="">Todos los pacientes</option>
            {pacientes.map(p => (
              <option key={p._id} value={p._id}>{p?.usuario_id?.nombre || p?.usuario?.nombre || p?.nombre || p?._id}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover mb-3 table-sm">
          <thead className="table-light">
            <tr>
              <th style={{minWidth: '100px'}}>Paciente</th>
              <th style={{minWidth: '100px'}}>Médico</th>
              <th style={{minWidth: '80px'}}>Tipo</th>
              <th style={{minWidth: '90px'}}>Estado</th>
              <th style={{minWidth: '110px'}}>Solicitado</th>
              <th style={{minWidth: '110px'}}>Realización</th>
              <th className="text-center" style={{minWidth: '70px'}}>Adjunto</th>
              <th className="text-center" style={{minWidth: '80px'}}>Acciones</th>
            </tr>
          </thead>
        <tbody>
          {Array.isArray(examenes) && examenes.length > 0 ? examenes.map((ex, idx) => {
            // Datos del paciente
            const pacienteObj = ex?.paciente_id;
            // Debug: ver qué datos tenemos del paciente
            if (idx === 0) {
              console.log('[Render] pacienteObj completo:', pacienteObj);
              console.log('[Render] pacienteObj.usuario_id:', pacienteObj?.usuario_id);
            }
            const pacienteNombre = pacienteObj?.usuario_id?.nombre || pacienteObj?.usuario?.nombre || pacienteObj?.nombre || '—';
            const pacienteId = pacienteObj?._id || pacienteObj?.id || (typeof ex?.paciente_id === 'string' ? ex.paciente_id : '—');
            
            // Obtener médico solicitante (con fallback a consulta->cita->profesional)
            const medicoObj = ex?.medico_solicitante;
            const profesionalFromConsulta = ex?.consulta_id?.cita_id?.profesional_id;
            const medicoNombre = medicoObj?.usuario_id?.nombre || medicoObj?.nombre || medicoObj?.usuario?.nombre || profesionalFromConsulta?.nombre || '—';
            let medicoId = '—';
            if (typeof ex?.medico_solicitante === 'string') {
              medicoId = ex.medico_solicitante;
            } else if (medicoObj && typeof medicoObj === 'object') {
              medicoId = medicoObj._id || medicoObj.id || '—';
            } else if (profesionalFromConsulta) {
              // Fallback: obtener ID del profesional desde la consulta
              medicoId = profesionalFromConsulta._id || profesionalFromConsulta.id || '—';
            }
            const solicitado = ex?.fecha_solicitud ? formatDateTime(ex.fecha_solicitud) : '—';
            const realizado = ex?.fecha_realizacion ? formatDateTime(ex.fecha_realizacion) : '—';
            return (
              <tr key={ex._id}>
                <td>
                  <div>{pacienteNombre}</div>
                  <div className="text-muted small"><code>{pacienteId}</code></div>
                </td>
                <td>
                  <div>{medicoNombre}</div>
                  <div className="text-muted small"><code>{medicoId}</code></div>
                </td>
                <td><span className="badge bg-info text-dark">{ex.tipo_examen || '—'}</span></td>
                <td><span className={`badge ${ex.estado === 'solicitado' ? 'bg-warning text-dark' : ex.estado === 'realizado' ? 'bg-success' : ex.estado === 'entregado' ? 'bg-primary' : 'bg-secondary'}`}>{ex.estado || '—'}</span></td>
                <td className="small">{solicitado}</td>
                <td className="small">{realizado}</td>
                <td className="text-center">
                  {ex.archivo_adjunto ? (
                    <a href={ex.archivo_adjunto} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary" title="Ver adjunto">
                      <i className="fas fa-file-download"></i>
                    </a>
                  ) : <span className="text-muted">—</span>}
                </td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(ex)} title="Editar examen">
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan="8" className="text-center text-muted py-4">Sin resultados</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>

      {editId && (
        <div className="row mt-4">
          <div className="col-12">
            <form onSubmit={handleSubmit} className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0"><i className="fas fa-edit"></i> Editar Examen</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Tipo de Examen *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.tipo_examen}
                      onChange={(e) => setForm({ ...form, tipo_examen: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Fecha de Realización</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.fecha_realizacion}
                      onChange={(e) => setForm({ ...form, fecha_realizacion: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Estado *</label>
                    <select
                      className="form-select"
                      value={form.estado}
                      onChange={(e) => setForm({ ...form, estado: e.target.value })}
                      required
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="solicitado">Solicitado</option>
                      <option value="realizado">Realizado</option>
                      <option value="analizado">Analizado</option>
                      <option value="entregado">Entregado</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Médico Realizador</label>
                    <select
                      className="form-select"
                      value={form.medico_realizador || ''}
                      onChange={(e)=> setForm({ ...form, medico_realizador: e.target.value })}
                    >
                      <option value="">— Seleccionar médico —</option>
                      {medicos.map(m => (
                        <option key={m._id} value={m._id}>{m.nombre || m?.usuario_id?.nombre || m._id}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Resultado</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={form.resultado}
                      onChange={(e) => setForm({ ...form, resultado: e.target.value })}
                      placeholder="Ingrese los resultados del examen..."
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Archivo Adjunto (URL)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.archivo_adjunto}
                      onChange={(e) => setForm({ ...form, archivo_adjunto: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Observaciones</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={form.observaciones}
                      onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                      placeholder="Observaciones adicionales..."
                    />
                  </div>
                </div>
              </div>
              <div className="card-footer bg-light">
                <div className="d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-secondary" onClick={closeEdit}>
                    <i className="fas fa-times"></i> Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    <i className="fas fa-save"></i> Guardar Cambios
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
