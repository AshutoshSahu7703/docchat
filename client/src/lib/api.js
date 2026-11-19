import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const getToken = () => localStorage.getItem('docchat_token');

const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
export const errMsg = (e) => e.response?.data?.message || e.message || 'Something went wrong';
export default api;
