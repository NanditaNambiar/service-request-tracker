import axios from 'axios';
import { getAuthState } from '../store/authStore';


const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
headers: { 'Content-Type': 'application/json' }
});


api.interceptors.request.use((cfg) => {
const token = getAuthState().token;
if (token) cfg.headers!['Authorization'] = `Bearer ${token}`;
return cfg;
});


export default api;