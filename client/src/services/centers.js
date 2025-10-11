import api from './api';

export async function listCenters(params = {}) {
  const { data } = await api.get('/centros', { params });
  return data; // { centros, ... } o array simple según backend
}

export async function getCenterById(id) {
  const { data } = await api.get(`/centros/${id}`);
  return data;
}
