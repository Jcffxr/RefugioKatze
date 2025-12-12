const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Función para generar el Token (el pase VIP)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Dura 30 días
    });
};

// --- LOGIN ---
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id), // ¡Aquí va el token!
        });
    } else {
        res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
};

// --- REGISTRO (Solo para crear tu primer admin) ---
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await User.create({
        email,
        password
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
};

module.exports = { authUser, registerUser };