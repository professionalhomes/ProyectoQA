const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Estudiante = require('../models/Estudiante');
const Profesor = require('../models/Profesor');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

// Registro de usuarios
exports.register = [
    // Validaciones para los campos del registro
    body('carnet')
        .isNumeric().withMessage('El carnet debe ser un número')
        .isLength({ min: 10, max: 10 }).withMessage('El carnet debe tener exactamente 10 dígitos'),

    body('nombre')
        .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo debe contener letras y espacios')
        .isLength({ min: 1 }).withMessage('El nombre es obligatorio'),

   // body('password')
       // .isLength({ min: 8, max: 16 }).withMessage('La contraseña debe tener entre 8 y 16 caracteres')
      //  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/).withMessage('La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial'),

    body('role')
        .isIn(['admin', 'estudiante', 'profesor']).withMessage('El rol debe ser admin, estudiante o profesor'),

    // Función para procesar las validaciones
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { carnet, nombre, password, role } = req.body;
            const existingUser = await User.findOne({ where: { carnet } });
            if (existingUser) {
                return res.status(400).json({ error: 'El carnet ya está en uso' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ carnet, nombre, password: hashedPassword, role });

            // Dependiendo del rol, crear una instancia de Estudiante o Profesor
            if (role === 'estudiante') {
                await Estudiante.create({ carnet, nombre, user_id: user.id });
            } else if (role === 'profesor') {
                await Profesor.create({ carnet, nombre, user_id: user.id });
            }

            res.redirect('/login');
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).send('Error al registrar usuario');
        }
    }
];

// Obtener usuario por ID
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
