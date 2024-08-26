const Curso = require('../models/Curso');
const Cita = require('../models/Cita');
const Disponibilidad = require('../models/Disponibilidad'); // Asegúrate de tener este modelo para manejar la disponibilidad de los profesores

// Mostrar cursos y profesores disponibles
exports.mostrarSeleccionarCurso = async (req, res) => {
    try {
        const cursos = await Curso.findAll();
        const profesores = await Profesor.findAll();
        res.render('seleccionar-curso', { cursos, profesores });
    } catch (error) {
        console.error('Error al mostrar cursos y profesores:', error);
        res.status(500).send('Error al cargar datos');
    }
};

// Solicitar cita
exports.solicitarCita = async (req, res) => {
    try {
        const { cursoId, profesorId } = req.query;
        const citas = await Cita.findAll({
            where: { cursoId, profesorId },
            include: [{ model: Profesor }, { model: Curso }]
        });
        res.render('ver-citas', { citas });
    } catch (error) {
        console.error('Error al solicitar cita:', error);
        res.status(500).send('Error al solicitar cita');
    }
};

// Mostrar citas del estudiante
exports.mostrarMisCitas = async (req, res) => {
    try {
        const { carnet } = req.user; // Asegúrate de tener el carnet del estudiante en la sesión
        const estudiante = await Estudiante.findOne({ where: { carnet } });
        const citas = await Cita.findAll({
            where: { estudianteId: estudiante.id },
            include: [{ model: Profesor }, { model: Curso }]
        });
        res.render('mis-citas', { citas });
    } catch (error) {
        console.error('Error al mostrar citas del estudiante:', error);
        res.status(500).send('Error al mostrar citas');
    }
};

// Solicitar una cita específica
exports.confirmarCita = async (req, res) => {
    try {
        const { citaId } = req.body;
        const cita = await Cita.findByPk(citaId);

        if (!cita) {
            return res.status(404).send('Cita no encontrada');
        }

        cita.estado = 'reservada'; // Cambia el estado de la cita a reservada
        await cita.save();

        res.redirect('/student/my-appointments'); // Redirigir al usuario a la página de citas reservadas
    } catch (error) {
        console.error('Error al confirmar cita:', error);
        res.status(500).send('Error al confirmar cita');
    }
};

// Cancelar una cita específica
exports.cancelarCita = async (req, res) => {
    try {
        const { citaId } = req.body;
        const cita = await Cita.findByPk(citaId);

        if (!cita) {
            return res.status(404).send('Cita no encontrada');
        }

        cita.estado = 'disponible'; // Cambia el estado de la cita a disponible
        await cita.save();

        res.redirect('/student/my-appointments'); // Redirigir al usuario a la página de citas reservadas
    } catch (error) {
        console.error('Error al cancelar cita:', error);
        res.status(500).send('Error al cancelar cita');
    }
};
