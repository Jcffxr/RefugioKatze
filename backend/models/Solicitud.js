const mongoose = require('mongoose');

const solicitudSchema = mongoose.Schema({
    gato: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gato', // Relacionado con el modelo Gato
    },
    adoptante: {
        nombre: {
            type: String,
            required: true,
        },
        telefono: {
            type: String,
            required: true,
        },
        email: { // Opcional, pero útil
            type: String,
        },
        mensaje: {
            type: String,
            required: true,
        },
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Aprobada', 'Rechazada'],
        default: 'Pendiente',
    },
    // Preguntas adicionales de aptitud (¡esto es clave!)
    aptitud: {
        tipoVivienda: { type: String, required: true }, // Ej: Casa, Departamento
        convivenOtrosAnimales: { type: String, required: true }, // Ej: Sí, No
        quienCuidara: { type: String, required: true }, // Ej: Yo, Mi familia
    }
}, {
    timestamps: true, // Para saber cuándo se creó
});

module.exports = mongoose.model('Solicitud', solicitudSchema);