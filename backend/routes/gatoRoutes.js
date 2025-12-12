const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { 
    crearGato, 
    obtenerGatos, 
    actualizarGato, 
    eliminarGato 
} = require('../controllers/gatoController');

// Rutas Públicas (Cualquiera puede ver)
router.get('/', obtenerGatos);

// Rutas Privadas (Solo Admin debería poder, pero por ahora lo dejamos abierto al backend 
// porque el frontend ya tiene el candado ProtectedRoute. 
// En un futuro V3 blindaremos esto con JWT también en el backend).
router.post('/', upload.single('imagen'), crearGato);
router.put('/:id', actualizarGato);   // <--- NUEVA RUTA PARA EDITAR
router.delete('/:id', eliminarGato);  // <--- NUEVA RUTA PARA BORRAR

module.exports = router;