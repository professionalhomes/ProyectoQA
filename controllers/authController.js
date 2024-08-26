const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');


// Registro de usuarios
exports.register = async (req, res) => {
    try {
        const { carnet, nombre, password, role } = req.body;
        if (!carnet || !nombre || !password || !role) {
            return res.status(400).send('Por favor, rellene todos los campos');
        }
        const existingUser = await User.findOne({ where: { carnet } });
        if (existingUser) {
            return res.status(400).send('El carnet ya está en uso');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ carnet, nombre, password: hashedPassword, role });
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error al registrar usuario');
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { carnet } = req.params;  // Obtener el id o carnet del usuario desde los parámetros de la URL
        const user = await User.findOne({
            where: { carnet },  
            attributes: ['nombre', 'role']  // Solo devuelve nombre y rol
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(user);  // Enviar los datos del usuario al frontend
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};


// Inicio de sesión
exports.login = passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
});

// Cerrar sesión
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
};