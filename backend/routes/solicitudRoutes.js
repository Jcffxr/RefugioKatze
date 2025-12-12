const express = require('express');
const router = express.Router();
const { crearSolicitud, obtenerSolicitudes, actualizarEstadoSolicitud } = require('../controllers/solicitudController');

// Rutas de Solicitudes
router.route('/')
    .post(crearSolicitud)     // POST: Crea nueva solicitud
    .get(obtenerSolicitudes); // GET: Obtiene todas (Admin)

router.route('/:id')
    .put(actualizarEstadoSolicitud); // PUT: Actualiza estado (Admin)

module.exports = router;