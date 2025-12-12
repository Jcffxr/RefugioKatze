const mongoose = require('mongoose');

const gatoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    // CAMBIO AQUÍ: De Number a String
    edad: {
        type: String, 
        required: true
    },
    sexo: {
        type: String,
        enum: ['Macho', 'Hembra'], // Solo permite estas dos opciones
        required: true,
        default: 'Macho' // Valor por defecto por si acaso
    },
    imagen: {
        type: String,
        required: true
    },
    imagePublicId: {
        type: String 
    },
    etiquetas: [{
        type: String 
    }],
    descripcion: {
        type: String,
        default: ''
    },
    estado: {
        type: String,
        enum: ['Disponible', 'Adoptado', 'En Proceso'],
        default: 'Disponible'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Gato', gatoSchema);