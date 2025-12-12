const multer = require('multer');

// Configuración de almacenamiento temporal (en la memoria RAM)
// Esto es más rápido que guardarlo en disco antes de subirlo.
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB por foto
});

module.exports = upload;