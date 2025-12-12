const express = require('express');
const router = express.Router();
const { generarDescripcion } = require('../controllers/aiController');

router.post('/generar', generarDescripcion);

module.exports = router;