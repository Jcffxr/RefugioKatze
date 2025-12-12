const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
// IMPORTAR RUTAS DE GATOS
const gatoRoutes = require('./routes/gatoRoutes'); // 
const userRoutes = require('./routes/userRoutes'); // 
const aiRoutes = require('./routes/aiRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes'); // <--- 1. IMPORTAR RUTAS DE SOLICITUDES

// Cargar variables de entorno
dotenv.config();

// Conectar a Base de Datos
connectDB();

const app = express();

// --- SEGURIDAD CORS (MODO FLEXIBLE) ---
// Esto permite que tu Frontend (Vercel/Localhost) se conecte sin peleas.
app.use(cors({
    origin: '*', // En producción lo restringiremos, pero para desarrollo esto evita dolores de cabeza
    credentials: true
}));

app.use(express.json()); // Para poder leer JSON en los formularios

// --- RUTAS DE LA API ---
app.use('/api/gatos', gatoRoutes); // <--- Rutas de gatos
app.use('/api/users', userRoutes); // <--- Rutas de usuario (login/registro)
app.use('/api/ai', aiRoutes); // <--- 2. USAR RUTAS DE IA
app.use('/api/solicitudes', solicitudRoutes); // <--- 3. USAR RUTAS DE SOLICITUDES


// Ruta de prueba para ver si respira
app.get('/', (req, res) => {
    res.send('API del Refugio V2 funcionando 🐱');
});

// Arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});