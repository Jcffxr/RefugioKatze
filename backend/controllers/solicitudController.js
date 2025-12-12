const Solicitud = require('../models/Solicitud');
const Gato = require('../models/Gato'); // 1. IMPORTANTE: Importamos el modelo Gato

// @desc    Crear solicitud y poner al gato "En Proceso"
const crearSolicitud = async (req, res) => {
    try {
        const { gatoId, adoptante, aptitud } = req.body;
        
        // 2. VERIFICAR: ¿El gato existe y está disponible?
        const gato = await Gato.findById(gatoId);
        if (!gato) {
            return res.status(404).json({ message: 'Gato no encontrado' });
        }
        if (gato.estado !== 'Disponible') {
            return res.status(400).json({ message: 'Este gato ya no está disponible para adopción.' });
        }

        // 3. CREAR LA SOLICITUD
        const nuevaSolicitud = new Solicitud({
            gato: gatoId,
            adoptante,
            aptitud,
            estado: 'Pendiente'
        });
        const solicitudGuardada = await nuevaSolicitud.save();

        // 4. ACTUALIZAR GATO A "En Proceso"
        // Así nadie más lo puede solicitar mientras revisas esta solicitud
        gato.estado = 'En Proceso';
        await gato.save();

        console.log(`[NUEVA SOLICITUD] Gato ${gato.nombre} pasó a estado "En Proceso"`);
        
        await solicitudGuardada.populate('gato', 'nombre imagen');
        res.status(201).json(solicitudGuardada);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear solicitud' });
    }
};

// @desc    Obtener todas las solicitudes
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

// @desc    Actualizar solicitud y cambiar estado del gato (Adoptado/Disponible)
const actualizarEstadoSolicitud = async (req, res) => {
    const { estado } = req.body; // 'Aprobada' o 'Rechazada'
    try {
        const solicitud = await Solicitud.findById(req.params.id);
        if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

        // Guardamos el cambio en la solicitud
        solicitud.estado = estado;
        await solicitud.save();

        // 5. ACTUALIZAR EL GATO SEGÚN LA DECISIÓN
        const gato = await Gato.findById(solicitud.gato);
        if (gato) {
            if (estado === 'Aprobada') {
                // Si aprobamos -> El gato es ADOPTADO (nadie lo puede pedir)
                gato.estado = 'Adoptado';
                console.log(`✅ Gato ${gato.nombre} ha sido ADOPTADO oficialmente.`);
            } else if (estado === 'Rechazada') {
                // Si rechazamos -> El gato vuelve a estar DISPONIBLE (para que otro intente)
                gato.estado = 'Disponible';
                console.log(`↩️ Solicitud rechazada. Gato ${gato.nombre} vuelve a estar DISPONIBLE.`);
            }
            await gato.save();
        }
    await solicitud.populate('gato', 'nombre imagen');
        res.json(solicitud);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando estado' });
    }
};

module.exports = { crearSolicitud, obtenerSolicitudes, actualizarEstadoSolicitud };