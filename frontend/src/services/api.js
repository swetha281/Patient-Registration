import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const addPatient    = (data)                            => API.post('/patients', data);
export const getPatients   = (search = '', page = 1, limit = 5) => API.get(`/patients?search=${search}&page=${page}&limit=${limit}`);
export const getPatient    = (id)                              => API.get(`/patients/${id}`);
export const updatePatient = (id, data)                        => API.put(`/patients/${id}`, data);
export const deletePatient = (id)                              => API.delete(`/patients/${id}`);