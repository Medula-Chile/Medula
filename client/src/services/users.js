import api from './api';
 
export async function listUsers({ pagina = 1, limite = 10, rol } = {}) {
  const { data } = await api.get('/users', { params: { pagina, limite, rol } });
  return data; // { usuarios, pagina, totalPaginas, totalUsuarios }
}
 
export async function deleteUser(userId) {
  const { data } = await api.delete(`/users/${userId}`);
  return data; // { message: 'Usuario eliminado exitosamente' }
}

