const { body, validationResult } = require('express-validator');
const Cita = require('../models/Cita');
const User = require('../models/User').default;
// Asignar cita
exports.asignarCita = [
    // Validaciones para los campos de la cita
    body('estudianteId')
        .isNumeric().withMessage('El ID del estudiante debe ser un número'),
        
    body('curso')
        .isString().withMessage('El curso debe ser una cadena de texto')
        .notEmpty().withMessage('El curso es obligatorio'),
        
    body('profesor')
        .isString().withMessage('El nombre del profesor debe ser una cadena de texto')
        .notEmpty().withMessage('El nombre del profesor es obligatorio'),
        
    body('dia')
        .isDate().withMessage('El día debe ser una fecha válida'),

    body('hora')
        .isString().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('La hora debe estar en formato HH:MM'),

    // Función para procesar las validaciones
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { estudianteId, curso, profesor, dia, hora } = req.body;
        try {
            await Cita.create({ estudianteId, curso, profesor, dia, hora, reservada: true });
            res.redirect('/dashboard');
        } catch (error) {
            console.error('Error al asignar cita:', error);
            res.status(500).send('Error al asignar cita');
        }
    }
];
// Obtener citas
exports.obtenerCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll({
            include: [{ model: User, as: 'estudiante' }]
        });
        res.json(citas);
    } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({ message: 'Error al obtener citas' });
    }
};