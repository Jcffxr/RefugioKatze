const express = require('express');
const router = express.Router();
const { authUser, registerUser } = require('../controllers/userController');

router.post('/login', authUser);
router.post('/register', registerUser); // Esta ruta la usaremos UNA sola vez y luego la borramos por seguridad

module.exports = router;