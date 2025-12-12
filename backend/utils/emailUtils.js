const Solicitud = require('../models/Solicitud');

// 1. COMENTAMOS O BORRAMOS ESTA LÍNEA para "romper" la conexión con el archivo de email
// const { sendApprovalEmail } = require('../utils/emailUtils'); 

// @desc    Crear solicitud
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

// @desc    Actualizar estado (MODO MANUAL - SIN EMAILS)
const actualizarEstadoSolicitud = async (req, res) => {
    const { estado } = req.body;
    try {
        const solicitud = await Solicitud.findById(req.params.id);

        if (!solicitud) return res.status(404).json({ message: 'No encontrado' });

        // --- AQUÍ ESTABA EL CÓDIGO DEL EMAIL, LO QUITAMOS ---
        // Al no llamar a sendApprovalEmail, el servidor nunca intentará conectarse a Gmail
        // y nunca dará error de Timeout. ¡Será instantáneo!
        // ----------------------------------------------------

        solicitud.estado = estado;
        await solicitud.save();
        
        await solicitud.populate('gato', 'nombre imagen');
        
        console.log(`✅ Estado actualizado a: ${estado} (Modo Manual 100%)`);
        res.json(solicitud);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando estado' });
    }
};

module.exports = { crearSolicitud, obtenerSolicitudes, actualizarEstadoSolicitud };