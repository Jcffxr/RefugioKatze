import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api', // Conexión directa a tu backend local
});

export default api;