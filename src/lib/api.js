import axios from 'axios';
 
const BASE = 'https://charismatic-recreation-production-236f.up.railway.app';
 
const api = axios.create({ baseURL: BASE });
 
// Attach user ID to every request automatically
api.interceptors.request.use(config => {
  const userId = localStorage.getItem('whoopUserId');
  if (userId) config.headers['x-user-id'] = userId;
  return config;
});
 
export const Auth = {
  loginUrl: () => `${BASE}/api/auth/login`,
  logout: () => localStorage.removeItem('whoopUserId'),
};
 
export const Whoop = {
  today: () => api.get('/api/whoop/today').then(r => r.data),
  history: (days = 30) => api.get(`/api/whoop/history?days=${days}`).then(r => r.data),
};
 
export const Logs = {
  logFood: (data) => api.post('/api/logs/food', data).then(r => r.data),
  getFood: (date) => api.get(`/api/logs/food?date=${date}`).then(r => r.data),
  logBody: (data) => api.post('/api/logs/body', data).then(r => r.data),
  getBody: () => api.get('/api/logs/body').then(r => r.data),
  summary: () => api.get('/api/logs/summary').then(r => r.data),
};
 
export default api;
