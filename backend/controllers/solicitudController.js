const Solicitud = require('../models/Solicitud');
const { sendApprovalEmail } = require('../utils/emailUtils'); // Importamos la utilidad de email

// @desc    Crear solicitud (Estado inicial: Pendiente)
// @route   POST /api/solicitudes
// @access  Public
const crearSolicitud = async (req, res) => {
    try {
        const { gatoId, adoptante, aptitud } = req.body;
        
        console.log(`[NUEVA SOLICITUD] Recibida para gato ID: ${gatoId} por ${adoptante.nombre}`);

        const nuevaSolicitud = new Solicitud({
            gato: gatoId,
            adoptante,
            aptitud,
            estado: 'Pendiente' // Siempre inicia en Pendiente
        });

        const solicitudGuardada = await nuevaSolicitud.save();
        await solicitudGuardada.populate('gato', 'nombre imagen');
        
        res.status(201).json(solicitudGuardada);
    } catch (error) {
        console.error('[ERROR CREAR SOLICITUD]:', error);
        res.status(500).json({ message: 'Error al crear solicitud' });
    }
};

// @desc    Obtener todas las solicitudes
// @route   GET /api/solicitudes
// @access  Private (Admin)
const obtenerSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Solicitud.find({})
            .populate('gato', 'nombre imagen')
            .sort({ createdAt: -1 });
        res.json(solicitudes);
    } catch (error) {
        console.error('[ERROR OBTENER SOLICITUDES]:', error);
        res.status(500).json({ message: 'Error al obtener solicitudes' });
    }
};

// @desc    Actualizar estado Y ENVIAR EMAIL AUTOMÁTICO si se aprueba
// @route   PUT /api/solicitudes/:id
// @access  Private (Admin)
const actualizarEstadoSolicitud = async (req, res) => {
    const { estado } = req.body;
    try {
        // Necesitamos popular el gato para obtener su nombre para el correo
        const solicitud = await Solicitud.findById(req.params.id).populate('gato', 'nombre');

        if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

        // LOGICA DE AUTOMATIZACIÓN DE EMAIL:
        // Si el estado nuevo es 'Aprobada' Y antes NO lo era...
        if (estado === 'Aprobada' && solicitud.estado !== 'Aprobada') {
            console.log(`[AUTOMATIZACIÓN] Intentando enviar correo a ${solicitud.adoptante.email}...`);
            
            await sendApprovalEmail(
                solicitud.adoptante.email,
                solicitud.adoptante.nombre,
                solicitud.gato.nombre
            );
        }

        // Actualizar el estado en la base de datos
        solicitud.estado = estado;
        await solicitud.save();
        
        // Devolver datos actualizados al frontend
        await solicitud.populate('gato', 'nombre imagen');
        res.json(solicitud);

    } catch (error) {
        console.error('[ERROR ACTUALIZAR ESTADO]:', error);
        res.status(500).json({ message: 'Error actualizando estado' });
    }
};

module.exports = { crearSolicitud, obtenerSolicitudes, actualizarEstadoSolicitud };