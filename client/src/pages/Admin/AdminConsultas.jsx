import React, { useEffect, useMemo, useState } from 'react';
import http from '../../api/http';
import { Modal, Button, Form } from 'react-bootstrap';

export default function AdminConsultas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRaw, setShowRaw] = useState(false);

  // filtros
  const [q, setQ] = useState('');
  const [paciente, setPaciente] = useState('');
  const [medico, setMedico] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  // Modal para editar
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingConsulta, setEditingConsulta] = useState(null);
  const [editForm, setEditForm] = useState({
    motivo: '',
    diagnostico: '',
    sintomas: '',
    observaciones: '',
    tratamiento: '',
    examenes: '',
    licencia: { otorga: false, dias: '', nota: '' },
    receta: null
  });

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (q) params.q = q;
      if (paciente) params.paciente = paciente;
      if (medico) params.medico = medico;
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;
      const resp = await http.get('/api/consultas', { params });
      setItems(Array.isArray(resp.data) ? resp.data : []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Error al cargar consultas');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (consulta) => {
    setEditingConsulta(consulta);
    setEditForm({
      motivo: consulta.motivo || '',
      diagnostico: consulta.diagnostico || '',
      sintomas: consulta.sintomas || '',
      observaciones: consulta.observaciones || '',
      tratamiento: consulta.tratamiento || '',
      examenes: consulta.examenes ? consulta.examenes.join(', ') : '',
      licencia: consulta.licencia || { otorga: false, dias: '', nota: '' },
      receta: consulta.receta || null
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const payload = {
        consulta: {
          motivo: editForm.motivo,
          diagnostico: editForm.diagnostico,
          sintomas: editForm.sintomas,
          observaciones: editForm.observaciones,
          tratamiento: editForm.tratamiento,
          examenes: editForm.examenes.split(',').map(e => e.trim()).filter(Boolean),
          licencia: {
            otorga: editForm.licencia.otorga,
            dias: editForm.licencia.otorga ? parseInt(editForm.licencia.dias) || null : null,
            nota: editForm.licencia.otorga ? editForm.licencia.nota : ''
          }
        },
        receta: editForm.receta
      };
      await http.put(`/api/consultas/${editingConsulta._id}`, payload);
      setShowEditModal(false);
      fetchConsultas();
    } catch (e) {
      alert('Error al actualizar consulta: ' + (e?.response?.data?.message || e.message));
    }
  };

  const handleDelete = async (consulta) => {
    if (!confirm('¿Estás seguro de eliminar esta consulta?')) return;
    try {
      await http.delete(`/api/consultas/${consulta._id}`);
      fetchConsultas();
    } catch (e) {
      alert('Error al eliminar consulta: ' + (e?.response?.data?.message || e.message));
    }
  };

  useEffect(() => { fetchConsultas(); }, []);

  const filtered = useMemo(() => items, [items]);

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-0">Consultas Médicas</h2>
          <p className="text-muted">Gestionar consultas del sistema</p>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-auto">
          <span className="badge bg-secondary fs-6">Total: {filtered.length}</span>
        </div>
        <div className="col-auto ms-auto">
          <button className="btn btn-outline-dark btn-sm me-2" onClick={()=>setShowRaw(s=>!s)}>
            <i className="fas fa-code"></i> {showRaw ? 'Ocultar JSON' : 'Ver JSON'}
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchConsultas} disabled={loading}>
            <i className="fas fa-sync-alt"></i> Actualizar
          </button>
        </div>
      </div>

      {/* filtros */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-md-4">
              <label className="form-label small">Buscar (motivo, diagnóstico, observaciones, tratamiento)</label>
              <div className="input-group">
                <input className="form-control" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="texto libre" onKeyDown={(e)=>{ if (e.key==='Enter') fetchConsultas(); }} />
                <button className="btn btn-outline-secondary" onClick={fetchConsultas}><i className="fas fa-search"></i></button>
                {!!q && <button className="btn btn-outline-secondary" onClick={()=>{ setQ(''); fetchConsultas(); }}><i className="fas fa-times"></i></button>}
              </div>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small">Paciente ID</label>
              <input className="form-control" value={paciente} onChange={(e)=>setPaciente(e.target.value)} placeholder="ObjectId" />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small">Médico ID</label>
              <input className="form-control" value={medico} onChange={(e)=>setMedico(e.target.value)} placeholder="ObjectId" />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small">Desde</label>
              <input type="date" className="form-control" value={desde} onChange={(e)=>setDesde(e.target.value)} />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small">Hasta</label>
              <input type="date" className="form-control" value={hasta} onChange={(e)=>setHasta(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}
      {showRaw && (
        <div className="card mb-3">
          <div className="card-header"><strong>Respuesta cruda del API</strong></div>
          <div className="card-body" style={{ maxHeight: 300, overflow: 'auto' }}>
            <pre className="small mb-0">{JSON.stringify(items, null, 2)}</pre>
          </div>
        </div>
      )}
      {loading && <div className="p-3 text-muted small">Cargando...</div>}

      {!loading && (
        <div className="card">
          <div className="card-header bg-light"><h5 className="mb-0"><i className="fas fa-notes-medical"></i> Resultados <span className="badge bg-primary">{filtered.length}</span></h5></div>
          <div className="card-body p-0">
            {filtered.length === 0 ? (
              <div className="p-3 text-muted small">Sin resultados.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover table-sm">
                  <thead className="table-light">
                    <tr>
                      <th style={{minWidth: '130px'}}>Fecha</th>
                      <th style={{minWidth: '120px'}}>Paciente</th>
                      <th style={{minWidth: '120px'}}>Médico</th>
                      <th style={{minWidth: '150px'}}>Motivo</th>
                      <th style={{minWidth: '150px'}}>Diagnóstico</th>
                      <th style={{minWidth: '80px'}}>Receta</th>
                      <th className="text-center" style={{minWidth: '120px'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => {
                      const fecha = new Date(c.createdAt).toLocaleString();
                      const pacienteNombre = c?.receta?.paciente_id?.usuario_id?.nombre || c?.receta?.paciente_id?._id || '-';
                      const medicoNombre = c?.receta?.medico_id?.nombre || c?.receta?.medico_id?.email || c?.receta?.medico_id || '-';
                      const tieneReceta = !!c?.receta;
                      const medsCount = c?.receta?.medicamentos?.length || 0;
                      return (
                        <tr key={c._id}>
                          <td className="small">{fecha}</td>
                          <td>{pacienteNombre}</td>
                          <td>{medicoNombre}</td>
                          <td className="small text-truncate" style={{ maxWidth: 200 }}>{c.motivo}</td>
                          <td className="small text-truncate" style={{ maxWidth: 200 }}>{c.diagnostico}</td>
                          <td className="text-center">{tieneReceta ? <span className="badge bg-primary">{medsCount}</span> : <span className="badge bg-secondary">-</span>}</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(c)} title="Editar">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c)} title="Eliminar">
                              <i className="fas fa-trash"></i>
                            </button>
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
      )}

      {/* Modal para editar */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Consulta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Motivo</Form.Label>
              <Form.Control
                type="text"
                value={editForm.motivo}
                onChange={(e) => setEditForm({ ...editForm, motivo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Diagnóstico</Form.Label>
              <Form.Control
                type="text"
                value={editForm.diagnostico}
                onChange={(e) => setEditForm({ ...editForm, diagnostico: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Síntomas</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editForm.sintomas}
                onChange={(e) => setEditForm({ ...editForm, sintomas: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editForm.observaciones}
                onChange={(e) => setEditForm({ ...editForm, observaciones: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tratamiento</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editForm.tratamiento}
                onChange={(e) => setEditForm({ ...editForm, tratamiento: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Exámenes (separados por coma)</Form.Label>
              <Form.Control
                type="text"
                value={editForm.examenes}
                onChange={(e) => setEditForm({ ...editForm, examenes: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Otorgar Licencia"
                checked={editForm.licencia.otorga}
                onChange={(e) => setEditForm({
                  ...editForm,
                  licencia: { ...editForm.licencia, otorga: e.target.checked }
                })}
              />
              {editForm.licencia.otorga && (
                <>
                  <Form.Control
                    type="number"
                    placeholder="Días"
                    value={editForm.licencia.dias}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      licencia: { ...editForm.licencia, dias: e.target.value }
                    })}
                    className="mt-2"
                  />
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Nota"
                    value={editForm.licencia.nota}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      licencia: { ...editForm.licencia, nota: e.target.value }
                    })}
                    className="mt-2"
                  />
                </>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
