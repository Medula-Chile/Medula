import api from './api';

// Crea un registro de médico. El backend valida unicidad por usuario_id.
export async function createDoctor(payload) {
  const { data } = await api.post('/medicos', payload);
  return data; // { message, medico }
}

export async function updateDoctor(id, partial) {
  const { data } = await api.put(`/medicos/${id}`, partial);
  return data; // { message, medico }
}

export async function listDoctors(params = {}) {
  const { data } = await api.get('/medicos', { params });
  return data; // { medicos, pagina, totalPaginas, totalMedicos }
}

export async function getDoctorById(id) {
  const { data } = await api.get(`/medicos/${id}`);
  return data; // medico
}
