import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD 
        ? 'https://refugio-katze.onrender.com/api' // Si está en Vercel (Producción) usa esto
        : 'http://localhost:4000/api',             // Si está en tu PC (Desarrollo) usa esto
});

export default api;