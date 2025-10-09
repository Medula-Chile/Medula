import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limite, setLimite] = useState(10);
  const [rol, setRol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rut: '',
    rol: 'paciente',
    contraseña: '',
    confirmarContraseña: ''
  });

  // Cargar usuarios
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let url = `http://localhost:5000/api/users?pagina=${pagina}&limite=${limite}`;
      if (rol) url += `&rol=${rol}`;
      
      const response = await axios.get(url);
      const data = response.data;
      
      setUsuarios(data.usuarios || data || []);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (e) {
      setError(e?.response?.data?.message || 'Error al obtener usuarios');
    } finally {
      setLoading(false);
    }
  }, [pagina, limite, rol]);

  useEffect(() => { 
    fetchUsers(); 
  }, [fetchUsers]);

  // Buscar usuarios
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchUsers();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users/buscar?q=${searchTerm}`);
      setUsuarios(response.data.usuarios || response.data);
      setTotalPaginas(1);
      setPagina(1);
    } catch (err) {
      setError('Error al buscar usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Abrir formulario para crear usuario
  const handleNewUser = () => {
    setFormData({
      nombre: '',
      email: '',
      rut: '',
      rol: 'paciente',
      contraseña: '',
      confirmarContraseña: ''
    });
    setShowForm(true);
    setEditing(false);
    setSelectedUser(null);
    setError('');
  };

  // Abrir formulario para editar usuario
  const handleEditUser = (user) => {
    setFormData({
      nombre: user.nombre,
      email: user.email,
      rut: user.rut,
      rol: user.rol,
      contraseña: '',
      confirmarContraseña: ''
    });
    setShowForm(true);
    setEditing(true);
    setSelectedUser(user);
    setError('');
  };

  // Guardar usuario (crear o actualizar)
  const handleSaveUser = async () => {
    try {
      setError('');

      // Validaciones
      if (!formData.nombre || !formData.email || !formData.rut || !formData.rol) {
        setError('Nombre, email, RUT y rol son requeridos');
        return;
      }

      if (!editing && (!formData.contraseña || !formData.confirmarContraseña)) {
        setError('La contraseña es requerida para crear un usuario');
        return;
      }

      if (formData.contraseña !== formData.confirmarContraseña) {
        setError('Las contraseñas no coinciden');
        return;
      }

      if (formData.contraseña && formData.contraseña.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      // Preparar datos para enviar
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        rut: formData.rut,
        rol: formData.rol
      };

      // Solo incluir contraseña si se está creando o cambiando
      if (formData.contraseña) {
        userData.contraseña = formData.contraseña;
      }

      if (editing && selectedUser) {
        // Actualizar usuario existente
        await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, userData);
        alert('Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario
        await axios.post('http://localhost:5000/api/users', userData);
        alert('Usuario creado exitosamente');
      }

      // Limpiar y recargar
      setShowForm(false);
      setEditing(false);
      setSelectedUser(null);
      fetchUsers();
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar usuario');
      console.error('Error:', err);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id, nombre) => {
    const ok = window.confirm(`¿Eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      alert('Usuario eliminado exitosamente');
      
      // Re-cargar la página actual; si la página queda vacía, retrocede una.
      await fetchUsers();
      if (usuarios.length === 1 && pagina > 1) {
        setPagina(pagina - 1);
      }
    } catch (e) {
      alert(e?.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  // Toggle activo/inactivo
  const handleToggleUser = async (userId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${userId}/toggle`);
      alert(`Usuario ${currentStatus ? 'desactivado' : 'activado'} exitosamente`);
      fetchUsers();
    } catch (err) {
      setError('Error al cambiar estado del usuario');
    }
  };

  // Cancelar edición/creación
  const handleCancel = () => {
    setShowForm(false);
    setEditing(false);
    setSelectedUser(null);
    setError('');
  };

  // Formatear RUT automáticamente
  const formatRut = (value) => {
    let rutLimpio = value.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length === 0) return '';
    
    let cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toLowerCase();
    
    if (cuerpo.length > 1) {
      cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    return `${cuerpo}-${dv}`;
  };

  const handleRutChange = (e) => {
    const value = e.target.value;
    const formattedRut = formatRut(value);
    setFormData({ ...formData, rut: formattedRut });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Administración de Usuarios</h2>

          {/* Barra de búsqueda y botones */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre o email..."
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
              <button className="btn btn-success" onClick={handleNewUser}>
                + Agregar Usuario
              </button>
              <button className="btn btn-outline-secondary ms-2" onClick={fetchUsers}>
                🔄 Actualizar
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="d-flex gap-2 align-items-center mb-3">
            <label className="form-label mb-0">Filtrar por rol:</label>
            <select
              className="form-select"
              style={{ maxWidth: 220 }}
              value={rol}
              onChange={(e) => { setPagina(1); setRol(e.target.value); }}
            >
              <option value="">Todos los roles</option>
              <option value="paciente">Paciente</option>
              <option value="medico">Médico</option>
              <option value="administrador">Administrador</option>
            </select>

            <label className="form-label mb-0 ms-3">Mostrar:</label>
            <select
              className="form-select"
              style={{ maxWidth: 120 }}
              value={limite}
              onChange={(e) => { setPagina(1); setLimite(Number(e.target.value)); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
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
                <h5>{editing ? 'Editar Usuario' : 'Nuevo Usuario'}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nombre completo *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ingresa nombre completo"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ejemplo@correo.com"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">RUT *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.rut}
                        onChange={handleRutChange}
                        placeholder="12.345.678-9"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Rol *</label>
                      <select
                        className="form-select"
                        value={formData.rol}
                        onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                      >
                        <option value="paciente">Paciente</option>
                        <option value="medico">Médico</option>
                        <option value="administrador">Administrador</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        {editing ? 'Nueva contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData.contraseña}
                        onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                        placeholder={editing ? "Nueva contraseña..." : "Mínimo 6 caracteres"}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirmar contraseña *</label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData.confirmarContraseña}
                        onChange={(e) => setFormData({ ...formData, confirmarContraseña: e.target.value })}
                        placeholder="Repite la contraseña"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <button className="btn btn-primary me-2" onClick={handleSaveUser}>
                    {editing ? 'Actualizar' : 'Crear'} Usuario
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de usuarios */}
          <div className="card">
            <div className="card-header">
              <h5>Lista de Usuarios ({usuarios.length})</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-2">Cargando usuarios...</p>
                </div>
              ) : usuarios.length === 0 ? (
                <p className="text-center text-muted py-4">No hay usuarios registrados</p>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>RUT</th>
                          <th>Rol</th>
                          <th>Fecha registro</th>
                          <th>Estado</th>
                          <th style={{ width: 180 }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map(user => (
                          <tr key={user._id} className={!user.activo ? 'table-secondary' : ''}>
                            <td>
                              {user.nombre}
                              {!user.activo && <span className="badge bg-warning ms-1">Inactivo</span>}
                            </td>
                            <td>{user.email}</td>
                            <td>{user.rut}</td>
                            <td>
                              <span className={`badge ${
                                user.rol === 'administrador' ? 'bg-danger' :
                                user.rol === 'medico' ? 'bg-primary' : 'bg-success'
                              }`}>
                                {user.rol}
                              </span>
                            </td>
                            <td>{user.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString() : '-'}</td>
                            <td>
                              <span className={`badge ${user.activo ? 'bg-success' : 'bg-danger'}`}>
                                {user.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => handleEditUser(user)}
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-outline-warning"
                                  onClick={() => handleToggleUser(user._id, user.activo)}
                                  title={user.activo ? 'Desactivar' : 'Activar'}
                                >
                                  {user.activo ? '⏸️' : '▶️'}
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDeleteUser(user._id, user.nombre)}
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
                  </div>

                  {/* Paginación */}
                  {totalPaginas > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <button
                        className="btn btn-outline-secondary"
                        disabled={pagina <= 1}
                        onClick={() => setPagina(p => Math.max(1, p - 1))}
                      >
                        ← Anterior
                      </button>
                      <span className="text-muted">
                        Página {pagina} de {totalPaginas}
                      </span>
                      <button
                        className="btn btn-outline-secondary"
                        disabled={pagina >= totalPaginas}
                        onClick={() => setPagina(p => p + 1)}
                      >
                        Siguiente →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;