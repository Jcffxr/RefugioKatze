const Solicitud = require('../models/Solicitud');

// ---------------------------------------------------
// 1. FUNCIÓN PARA CREAR SOLICITUD
// ---------------------------------------------------
const crearSolicitud = async (req, res) => {
    try {
        const { gatoId, adoptante, aptitud } = req.body;
        
        console.log(`[NUEVA SOLICITUD] Recibida para gato ID: ${gatoId}`);

        const nuevaSolicitud = new Solicitud({
            gato: gatoId,
            adoptante,
            aptitud,
            estado: 'Pendiente'
        });

        const solicitudGuardada = await nuevaSolicitud.save();
        await solicitudGuardada.populate('gato', 'nombre imagen');
        
        res.status(201).json(solicitudGuardada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear solicitud' });
    }
};

// ---------------------------------------------------
// 2. FUNCIÓN PARA OBTENER SOLICITUDES
// ---------------------------------------------------
const obtenerSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Solicitud.find({})
            .populate('gato', 'nombre imagen')
            .sort({ createdAt: -1 });
        res.json(solicitudes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener solicitudes' });
    }
};

// ---------------------------------------------------
// 3. FUNCIÓN PARA ACTUALIZAR ESTADO (SIN CORREO)
// ---------------------------------------------------
const actualizarEstadoSolicitud = async (req, res) => {
    const { estado } = req.body;
    try {
        const solicitud = await Solicitud.findById(req.params.id);

        if (!solicitud) return res.status(404).json({ message: 'No encontrado' });

        // Solo guardamos el estado, sin enviar emails
        solicitud.estado = estado;
        await solicitud.save();
        
        await solicitud.populate('gato', 'nombre imagen');
        
        console.log(`✅ Estado actualizado a: ${estado}`);
        res.json(solicitud);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando estado' });
    }
};

// ---------------------------------------------------
// EXPORTAR LAS 3 FUNCIONES (OBLIGATORIO)
// ---------------------------------------------------
module.exports = { 
    crearSolicitud, 
    obtenerSolicitudes, 
    actualizarEstadoSolicitud 
};