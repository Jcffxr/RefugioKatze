const Gato = require('../models/Gato');
const cloudinary = require('../config/cloudinary');

// --- CREAR (Ya lo tenías) ---
const crearGato = async (req, res) => {
    try {
        const { nombre, edad, etiquetas, descripcion, sexo } = req.body;
        if (!req.file) return res.status(400).json({ message: 'La imagen es obligatoria' });

        // Subir a Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'RefugioGatosV2', format: 'jpg' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const nuevoGato = new Gato({
            nombre,
            edad,
            sexo,
            imagen: result.secure_url,
            imagePublicId: result.public_id,
            etiquetas: etiquetas ? JSON.parse(etiquetas) : [],
            descripcion
        });

        const gatoGuardado = await nuevoGato.save();
        res.status(201).json(gatoGuardado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al guardar el gato' });
    }
};

// --- LEER (Ya lo tenías) ---
const obtenerGatos = async (req, res) => {
    try {
        const gatos = await Gato.find().sort({ createdAt: -1 });
        res.json(gatos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener gatos' });
    }
};

// --- ACTUALIZAR (Nuevo!) 🔄 ---
const actualizarGato = async (req, res) => {
    try {
        const gato = await Gato.findById(req.params.id);
        if (!gato) return res.status(404).json({ message: 'Gato no encontrado' });

        // Actualizamos solo los campos que nos envíen
        gato.nombre = req.body.nombre || gato.nombre;
        gato.edad = req.body.edad || gato.edad;
        gato.sexo = req.body.sexo || gato.sexo;
        gato.descripcion = req.body.descripcion || gato.descripcion;
        
        // El estado y las etiquetas tienen un trato especial
        if (req.body.estado) gato.estado = req.body.estado;
        if (req.body.etiquetas) {
             // Si vienen etiquetas nuevas, las parseamos, si no, dejamos las viejas
                try {
                gato.etiquetas = JSON.parse(req.body.etiquetas);
                } catch (e) {
                // Si ya viene como array o texto simple
                gato.etiquetas = req.body.etiquetas; 
                }
        }

        const gatoActualizado = await gato.save();
        res.json(gatoActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar' });
    }
};

// --- BORRAR (Nuevo!) 🗑️ ---
const eliminarGato = async (req, res) => {
    try {
        const gato = await Gato.findById(req.params.id);
        if (!gato) return res.status(404).json({ message: 'Gato no encontrado' });

        // 1. Borrar foto de Cloudinary para no ocupar espacio basura
        if (gato.imagePublicId) {
            await cloudinary.uploader.destroy(gato.imagePublicId);
        }

        // 2. Borrar de MongoDB
        await Gato.deleteOne({ _id: req.params.id });

        res.json({ message: 'Gato eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar' });
    }
};

module.exports = { crearGato, obtenerGatos, actualizarGato, eliminarGato };