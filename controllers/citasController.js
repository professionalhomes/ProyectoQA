const Cita = require('../models/Cita');
const User = require('../models/User').default;

exports.asignarCita = async (req, res) => {
    const { estudianteId, curso, profesor, dia, hora } = req.body;
    await Cita.create({ estudianteId, curso, profesor, dia, hora, reservada: true });
    res.redirect('/dashboard');
};

exports.obtenerCitas = async (req, res) => {
    const citas = await Cita.findAll({
        include: [{ model: User, as: 'estudiante' }]
    });
    res.json(citas);
};
