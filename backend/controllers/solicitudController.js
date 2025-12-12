const Solicitud = require('../models/Solicitud');
// const { sendApprovalEmail } = require('../utils/emailUtils'); // <--- 1. COMENTADO (Apagado)

// ... (crearSolicitud y obtenerSolicitudes se quedan IGUAL, no los toques) ...

// Actualizar estado (AHORA MÁS RÁPIDO Y MANUAL)
const actualizarEstadoSolicitud = async (req, res) => {
    const { estado } = req.body;
    try {
        const solicitud = await Solicitud.findById(req.params.id).populate('gato', 'nombre');

        if (!solicitud) return res.status(404).json({ message: 'No encontrado' });

        // --- SECCIÓN DE CORREO DESACTIVADA PARA LA DEMO ---
        /* if (estado === 'Aprobada' && solicitud.estado !== 'Aprobada') {
            await sendApprovalEmail(
                solicitud.adoptante.email,
                solicitud.adoptante.nombre,
                solicitud.gato.nombre
            );
        }
        */
        // --------------------------------------------------

        solicitud.estado = estado;
        await solicitud.save();
        
        // Devolver datos actualizados
        await solicitud.populate('gato', 'nombre imagen');
        
        console.log(`Estado actualizado a: ${estado} (Modo Manual)`);
        res.json(solicitud);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando estado' });
    }
};

module.exports = { crearSolicitud, obtenerSolicitudes, actualizarEstadoSolicitud }; // Asegúrate de exportar las 3}























































// Forzando actualización manual para demo