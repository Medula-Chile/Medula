import api from './api';

export async function listSpecialties() {
  const { data } = await api.get('/especialidades');
  return data; // array
}
