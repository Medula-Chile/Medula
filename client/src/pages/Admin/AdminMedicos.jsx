import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import api from '../../services/api';

export default function AdminMedicos() {
  const [medicos, setMedicos] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Nuevos estados para las opciones
  const [usuarios, setUsuarios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [centrosSalud, setCentrosSalud] = useState([]);
  // Filtro para dropdown de usuarios
  const [userFilter, setUserFilter] = useState('');

  // Usuarios disponibles = usuarios con rol médico que aún NO tienen perfil en Medicos
  const assignedUsuarioIds = useMemo(() => new Set(
    (Array.isArray(medicos) ? medicos : []).map(m => String(m?.usuario_id?._id || m?.usuario_id || ''))
  ), [medicos]);
  const availableUsers = useMemo(() => {
    const base = Array.isArray(usuarios) ? usuarios : [];
    const onlyUnassigned = base.filter(u => !assignedUsuarioIds.has(String(u?._id || '')));
    const f = (userFilter || '').toLowerCase().trim();
    if (!f) return onlyUnassigned;
    return onlyUnassigned.filter(u =>
      (u?.nombre || '').toLowerCase().includes(f) ||
      (u?.email || '').toLowerCase().includes(f) ||
      (u?.rut || '').toLowerCase().includes(f)
    );
  }, [usuarios, assignedUsuarioIds, userFilter]);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    usuario_id: '',
    especialidad: '',
    centro_id: '',
    titulo_profesional: '',
    institucion_formacion: '',
    años_experiencia: '',
    disponibilidad_horaria: '',
    contacto_directo: ''
  });

  // Cargar datos al iniciar
  useEffect(() => {
    fetchMedicos();
    fetchUsuariosMedicos();
    fetchEspecialidades();
    fetchCentrosSalud();
  }, []);

  // Obtener todos los médicos
  const fetchMedicos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/medicos');
      setMedicos(res.data.medicos || res.data);
      setPage(1);
    } catch (err) {
      setError('Error al cargar médicos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener usuarios (tolerante a variantes del backend) y filtrar por rol médico
  const fetchUsuariosMedicos = async () => {
    try {
      // Intento 1: endpoint con filtro explícito
      const p1 = api.get('/users', { params: { rol: 'medico', limit: 1000 } }).catch(() => null);
      // Intento 2: endpoint sin filtro, traer todo (por si el backend no soporta 'rol')
      const p2 = api.get('/users', { params: { limit: 1000 } }).catch(() => null);
      // Intento 3: alias de endpoint 'usuarios'
      const p3 = api.get('/usuarios', { params: { limit: 1000 } }).catch(() => null);
      // Intento 4: variantes de nombres de parámetros de paginación
      const p4 = api.get('/users', { params: { pageSize: 1000 } }).catch(() => null);
      const p5 = api.get('/users', { params: { perPage: 1000 } }).catch(() => null);
      // Intento 5: endpoints alternativos comunes
      const p6 = api.get('/users/all').catch(() => null);
      const p7 = api.get('/usuarios/all').catch(() => null);
      // Intento 6: nombres en español usados en AdminUsers
      const p8 = api.get('/users', { params: { pagina: 1, limite: 1000, rol: 'medico' } }).catch(() => null);
      const p9 = api.get('/users', { params: { pagina: 1, limite: 1000 } }).catch(() => null);
      const [r1, r2, r3, r4, r5, r6, r7, r8, r9] = await Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9]);

      const arrays = [];
      const pushIfArray = (resp) => {
        if (!resp) return;
        const d = resp.data;
        if (Array.isArray(d)) arrays.push(d);
        else if (Array.isArray(d?.usuarios)) arrays.push(d.usuarios);
        else if (Array.isArray(d?.users)) arrays.push(d.users);
        else if (Array.isArray(d?.data)) arrays.push(d.data);
        else if (Array.isArray(d?.results)) arrays.push(d.results);
      };
      [r1, r2, r3, r4, r5, r6, r7, r8, r9].forEach(pushIfArray);

      // Unir y deduplicar por _id
      const merged = [].concat(...arrays);
      const map = new Map();
      merged.forEach(u => { if (u && u._id) map.set(String(u._id), u); });
      let list = Array.from(map.values());
      // Filtrar por rol médico en el cliente si es necesario
      list = list.filter(u => {
        const r = (u?.rol ?? u?.role ?? '').toString().toLowerCase();
        return r === 'medico' || r === 'doctor' || r.includes('medic');
      });

      setUsuarios(list);
    } catch (err) {
      console.error('Error cargando usuarios médicos:', err);
      setUsuarios([]);
    }
  };

  // Obtener especialidades
  const fetchEspecialidades = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/especialidades');
      setEspecialidades(response.data);
    } catch (err) {
      console.error('Error cargando especialidades:', err);
    }
  };

  // Obtener centros de salud (ruta correcta y usando api con token)
  const fetchCentrosSalud = async () => {
    try {
      const response = await api.get('/centros');
      const data = response.data;
      setCentrosSalud(Array.isArray(data) ? data : (data?.centros || []));
    } catch (err) {
      console.error('Error cargando centros de salud:', err);
    }
  };

  // Buscar médicos
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchMedicos();
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/medicos/buscar?q=${searchTerm}`);
      setMedicos(res.data.medicos || res.data);
      setPage(1);
    } catch (err) {
      setError('Error al buscar médicos');
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar médico para ver/editar
  const handleSelectMedico = (medico) => {
    setSelectedMedico(medico);
    setShowForm(false);
    setEditing(false);
  };

  // Abrir formulario para crear nuevo médico
  const handleNewMedico = () => {
    setFormData({
      usuario_id: '',
      especialidad: '',
      centro_id: '',
      titulo_profesional: '',
      institucion_formacion: '',
      años_experiencia: '',
      disponibilidad_horaria: '',
      contacto_directo: ''
    });
    setShowForm(true);
    setEditing(false);
    setSelectedMedico(null);
  };

  // Abrir formulario para editar médico
  const handleEditMedico = (medico) => {
    setFormData({
      usuario_id: medico.usuario_id._id,
      especialidad: medico.especialidad,
      centro_id: medico.centro_id._id,
      titulo_profesional: medico.titulo_profesional,
      institucion_formacion: medico.institucion_formacion,
      años_experiencia: medico.años_experiencia,
      disponibilidad_horaria: medico.disponibilidad_horaria,
      contacto_directo: medico.contacto_directo
    });
    setShowForm(true);
    setEditing(true);
    setSelectedMedico(medico);
  };

  // Guardar médico (crear o actualizar)
  const handleSaveMedico = async () => {
    try {
      setError(null);
      
      // Validaciones básicas
      if (!formData.usuario_id || !formData.especialidad || !formData.centro_id) {
        setError('Usuario, especialidad y centro de salud son requeridos');
        return;
      }

      if (editing && selectedMedico) {
        // Actualizar médico existente: NO enviar usuario_id
        const { usuario_id, ...partial } = formData;
        await axios.put(`http://localhost:5000/api/medicos/${selectedMedico._id}`, partial);
        alert('Médico actualizado exitosamente');
      } else {
        // Crear nuevo médico
        await axios.post('http://localhost:5000/api/medicos', formData);
        alert('Médico creado exitosamente');
      }

      // Limpiar y recargar
      setShowForm(false);
      setEditing(false);
      setSelectedMedico(null);
      fetchMedicos();
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar médico');
      console.error('Error:', err);
    }
  };

  // Eliminar médico
  const handleDeleteMedico = async (medicoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este médico?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/medicos/${medicoId}`);
      alert('Médico eliminado exitosamente');
      fetchMedicos();
    } catch (err) {
      setError('Error al eliminar médico');
    }
  };

  // Activar/desactivar médico
  const handleToggleMedico = async (medicoId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/medicos/${medicoId}/toggle`);
      alert(`Médico ${currentStatus ? 'desactivado' : 'activado'} exitosamente`);
      fetchMedicos();
    } catch (err) {
      setError('Error al cambiar estado del médico');
    }
  };

  // Cancelar edición/creación
  const handleCancel = () => {
    setShowForm(false);
    setEditing(false);
    setSelectedMedico(null);
    setError(null);
  };

  // Función auxiliar para obtener nombre seguro del médico
  const getMedicoNombre = (medico) => {
    return medico.usuario_id?.nombre || 'N/A';
  };

  // Función auxiliar para obtener email seguro del médico
  const getMedicoEmail = (medico) => {
    return medico.usuario_id?.email || 'N/A';
  };

  // Función auxiliar para obtener RUT seguro del médico
  const getMedicoRut = (medico) => {
    return medico.usuario_id?.rut || 'N/A';
  };

  if (loading) return <div className="text-center mt-4"><p>Cargando médicos...</p></div>;
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Gestión de Médicos</h2>

          {/* Barra de búsqueda y botones */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre o especialidad..."
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
              <button className="btn btn-success" onClick={handleNewMedico}>
                + Agregar Médico
              </button>
              <button className="btn btn-outline-secondary ms-2" onClick={fetchMedicos}>
                🔄 Actualizar
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          {/* Formulario de creación/edición */}
          {showForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h5>{editing ? 'Editar Médico' : 'Nuevo Médico'}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Usuario * <span className="text-muted small">(Médicos: {usuarios.length} · Asignados: {assignedUsuarioIds.size} · Disponibles: {availableUsers.length})</span></label>
                      {editing ? (
                        <input className="form-control" value={selectedMedico?.usuario_id?.nombre || 'Usuario asociado'} disabled />
                      ) : (
                        <div>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar usuario..."
                            value={userFilter}
                            onChange={(e)=>setUserFilter(e.target.value)}
                          />
                          <div className="border rounded mt-1" style={{ maxHeight: 400, overflowY: 'auto' }}>
                            <div className="list-group list-group-flush">
                              {availableUsers.map(u => (
                                  <button
                                    type="button"
                                    key={u._id}
                                    className={`list-group-item list-group-item-action ${formData.usuario_id===u._id?'active':''}`}
                                    onClick={()=>{ setFormData({ ...formData, usuario_id: u._id }); }}
                                  >
                                    <div className="d-flex justify-content-between">
                                      <span><strong>{u.nombre}</strong></span>
                                      <code>{u._id}</code>
                                    </div>
                                    <div className="small text-muted">{u.email} · {u.rut}</div>
                                  </button>
                                ))}
                              {availableUsers.length===0 && (
                                <div className="list-group-item text-muted small">Sin usuarios</div>
                              )}
                            </div>
                          </div>
                          {formData.usuario_id && (
                            <div className="form-text">Seleccionado: <code>{formData.usuario_id}</code></div>
                          )}
                          <small className="text-muted d-block mt-1">Usuarios disponibles sin perfil médico: {availableUsers.length}</small>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Especialidad *</label>
                      <select
                        className="form-select"
                        value={formData.especialidad}
                        onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                      >
                        <option value="">Seleccionar especialidad</option>
                        {especialidades.map(especialidad => (
                          <option key={especialidad._id} value={especialidad.nombre}>
                            {especialidad.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Centro de Salud *</label>
                      <select
                        className="form-select"
                        value={formData.centro_id}
                        onChange={(e) => setFormData({ ...formData, centro_id: e.target.value })}
                      >
                        <option value="">Seleccionar centro de salud</option>
                        {centrosSalud.map(centro => (
                          <option key={centro._id} value={centro._id}>
                            {centro.nombre} - {centro.comuna}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Título Profesional</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.titulo_profesional}
                        onChange={(e) => setFormData({ ...formData, titulo_profesional: e.target.value })}
                        placeholder="Ej: Médico Cirujano"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Institución de Formación</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.institucion_formacion}
                        onChange={(e) => setFormData({ ...formData, institucion_formacion: e.target.value })}
                        placeholder="Ej: Universidad de Chile"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Años de Experiencia</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.años_experiencia}
                        onChange={(e) => setFormData({ ...formData, años_experiencia: e.target.value })}
                        placeholder="0-60"
                        min="0"
                        max="60"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Disponibilidad Horaria</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.disponibilidad_horaria}
                        onChange={(e) => setFormData({ ...formData, disponibilidad_horaria: e.target.value })}
                        placeholder="Ej: Lunes a Viernes 8:00-18:00"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Contacto Directo</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.contacto_directo}
                        onChange={(e) => setFormData({ ...formData, contacto_directo: e.target.value })}
                        placeholder="Teléfono o email de contacto"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <button className="btn btn-primary me-2" onClick={handleSaveMedico}>
                    {editing ? 'Actualizar' : 'Crear'} Médico
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de médicos */}
          <div className="card">
            <div className="card-header">
              <h5>Lista de Médicos ({medicos.length})</h5>
            </div>
            <div className="card-body">
              {medicos.length === 0 ? (
                <p className="text-center text-muted">No hay médicos registrados</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>RUT</th>
                        <th>Especialidad</th>
                        <th>Centro</th>
                        <th>Estado</th>
                        <th style={{ width: 180 }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(medicos.slice((page-1)*pageSize, page*pageSize)).map((medico) => (
                        <tr key={medico._id} className={!medico.activo ? 'table-secondary' : ''}>
                          <td>
                            {getMedicoNombre(medico)}
                            {!medico.activo && <span className="badge bg-warning ms-1">Inactivo</span>}
                          </td>
                          <td>{getMedicoEmail(medico)}</td>
                          <td>{getMedicoRut(medico)}</td>
                          <td>{medico.especialidad}</td>
                          <td>{medico.centro_id?.nombre || 'N/A'}</td>
                          <td>
                            <span className={`badge ${medico.activo ? 'bg-success' : 'bg-danger'}`}>
                              {medico.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEditMedico(medico)}
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-outline-warning"
                                onClick={() => handleToggleMedico(medico._id, medico.activo)}
                                title={medico.activo ? 'Desactivar' : 'Activar'}
                              >
                                {medico.activo ? '⏸️' : '▶️'}
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeleteMedico(medico._id)}
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
                  {/* Paginación */}
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="small text-muted">
                      Mostrando {(Math.min((page-1)*pageSize+1, medicos.length))}-{Math.min(page*pageSize, medicos.length)} de {medicos.length}
                    </div>
                    <nav>
                      <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${page===1?'disabled':''}`}>
                          <button className="page-link" onClick={()=>setPage(1)}>«</button>
                        </li>
                        <li className={`page-item ${page===1?'disabled':''}`}>
                          <button className="page-link" onClick={()=>setPage(p=>Math.max(1,p-1))}>‹</button>
                        </li>
                        {Array.from({length: Math.max(1, Math.ceil(medicos.length/pageSize))}).slice(Math.max(0,page-3), Math.max(0,page-3)+5).map((_,i)=>{
                          const start = Math.max(1, page-2);
                          const num = start + i;
                          const total = Math.ceil(medicos.length/pageSize);
                          if (num>total) return null;
                          return (
                            <li key={num} className={`page-item ${page===num?'active':''}`}>
                              <button className="page-link" onClick={()=>setPage(num)}>{num}</button>
                            </li>
                          );
                        })}
                        <li className={`page-item ${page>=Math.ceil(medicos.length/pageSize)?'disabled':''}`}>
                          <button className="page-link" onClick={()=>setPage(p=>Math.min(Math.ceil(medicos.length/pageSize)||1, p+1))}>›</button>
                        </li>
                        <li className={`page-item ${page>=Math.ceil(medicos.length/pageSize)?'disabled':''}`}>
                          <button className="page-link" onClick={()=>setPage(Math.max(1, Math.ceil(medicos.length/pageSize)||1))}>»</button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}