const Solicitud = require('../models/Solicitud');
const { sendApprovalEmail } = require('../utils/emailUtils'); // Importamos la utilidad

// Crear solicitud (Simple, estado Pendiente)
const crearSolicitud = async (req, res) => {
    try {
        const { gatoId, adoptante, aptitud } = req.body;
        
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
        res.status(500).json({ message: 'Error al obtener solicitudes' });
    }
};

// Actualizar estado Y ENVIAR EMAIL AUTOMÁTICO
const actualizarEstadoSolicitud = async (req, res) => {
    const { estado } = req.body;
    try {
        const solicitud = await Solicitud.findById(req.params.id).populate('gato', 'nombre');

        if (!solicitud) return res.status(404).json({ message: 'No encontrado' });

        // LOGICA DE AUTOMATIZACIÓN:
        // Si cambiamos a 'Aprobada' y antes no lo estaba...
        if (estado === 'Aprobada' && solicitud.estado !== 'Aprobada') {
            console.log("Intentando enviar correo de aprobación...");
            await sendApprovalEmail(
                solicitud.adoptante.email,
                solicitud.adoptante.nombre,
                solicitud.gato.nombre
            );
        }

        solicitud.estado = estado;
        await solicitud.save();
        
        // Devolver datos actualizados
        await solicitud.populate('gato', 'nombre imagen');
        res.json(solicitud);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando estado' });
    }
};

module.exports = { crearSolicitud, obtenerSolicitudes, actualizarEstadoSolicitud };