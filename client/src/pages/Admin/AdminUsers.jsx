import { useEffect, useState, useCallback } from 'react';
import { listUsers, deleteUser } from '../../services/users';

function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limite, setLimite] = useState(10);
  const [rol, setRol] = useState(''); // '', 'paciente', 'medico', 'administrador'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listUsers({ pagina, limite, rol: rol || undefined });
      setUsuarios(data.usuarios || []);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (e) {
      setError(e?.response?.data?.message || 'Error al obtener usuarios');
    } finally {
      setLoading(false);
    }
  }, [pagina, limite, rol]);
 
  useEffect(() => { fetchUsers(); }, [fetchUsers]);
 
  const onDelete = async (id, nombre) => {
    const ok = window.confirm(`¿Eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    try {
      await deleteUser(id);
      // Re-cargar la página actual; si la página queda vacía, retrocede una.
      await fetchUsers();
      if (usuarios.length === 1 && pagina > 1) {
        setPagina(pagina - 1);
      }
    } catch (e) {
      alert(e?.response?.data?.message || 'Error al eliminar usuario');
    }
  };
 
  return (
<div className="container py-3">
<h2 className="mb-3">Administración de Usuarios</h2>
 
      <div className="d-flex gap-2 align-items-center mb-3">
<label className="form-label mb-0">Rol:</label>
<select
          className="form-select"
          style={{ maxWidth: 220 }}
          value={rol}
          onChange={(e) => { setPagina(1); setRol(e.target.value); }}
>
<option value="">Todos</option>
<option value="paciente">Paciente</option>
<option value="medico">Médico</option>
<option value="administrador">Administrador</option>
</select>
 
        <label className="form-label mb-0 ms-3">Por página:</label>
<select
          className="form-select"
          style={{ maxWidth: 120 }}
          value={limite}
          onChange={(e) => { setPagina(1); setLimite(Number(e.target.value)); }}
>
<option value={5}>5</option>
<option value={10}>10</option>
<option value={20}>20</option>
</select>
</div>
 
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
<div>Cargando...</div>
      ) : (
<div className="table-responsive">
<table className="table table-striped align-middle">
<thead>
<tr>
<th>Nombre</th>
<th>Email</th>
<th>RUT</th>
<th>Rol</th>
<th>Fecha registro</th>
<th style={{ width: 120 }}>Acciones</th>
</tr>
</thead>
<tbody>
              {usuarios.length === 0 ? (
<tr><td colSpan="6" className="text-center">Sin resultados</td></tr>
              ) : usuarios.map(u => (
<tr key={u._id}>
<td>{u.nombre}</td>
<td>{u.email}</td>
<td>{u.rut}</td>
<td className="text-capitalize">{u.rol}</td>
<td>{u.fecha_registro ? new Date(u.fecha_registro).toLocaleDateString() : '-'}</td>
<td>
<button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(u._id, u.nombre)}>
                      Eliminar
</button>
</td>
</tr>
              ))}
</tbody>
</table>
 
          <div className="d-flex justify-content-between align-items-center mt-2">
<button
              className="btn btn-outline-secondary"
              disabled={pagina <= 1}
              onClick={() => setPagina(p => Math.max(1, p - 1))}
>
              Anterior
</button>
<span>Página {pagina} de {totalPaginas}</span>
<button
              className="btn btn-outline-secondary"
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina(p => p + 1)}
>
              Siguiente
</button>
</div>
</div>
      )}
</div>
  );
}
 
export default AdminUsers;