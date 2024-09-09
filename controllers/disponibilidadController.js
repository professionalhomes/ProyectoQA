const Curso = require('../models/Curso');
const Disponibilidad = require('../models/Disponibilidad');
const Profesor = require('../models/Profesor'); 

exports.getCursosPorProfesor = async (req, res) => {
    try {
        const { userId } = req.query; // Ahora recibimos el userId en lugar del profesorId
        if (!userId) {
            return res.status(400).json({ error: 'Falta el userId' });
        }
        // Primero, obtenemos el profesorId usando el userId
        const profesor = await Profesor.findOne({ where: { user_id: userId } });
        if (!profesor) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }
        const profesorId = profesor.id;
        // Ahora, obtenemos los cursos usando el profesorId
        const cursos = await Curso.findAll({
            where: { Profesor_id: profesorId }
        });
        res.json(cursos);
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.createDisponibilidad = async (req, res) => {
    try {
        const { Userid, cursoId, dia, horaInicio, horaFin, cantidadCitas } = req.body;
        console.log('Datos del formulario:', req.body);
        if (!Userid || !cursoId || !dia || !horaInicio || !horaFin || !cantidadCitas) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }
        const profesorId = Userid ;
        const disponibilidad = await Disponibilidad.create({
            profesorId,
            cursoId,
            dia,
            horaInicio,
            horaFin,
            cantidadCitas
        });
        res.json({ disponibilidad });
    } catch (error) {
        console.error('Error al crear disponibilidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.getProfesorIdByUserId = async (req, res) => {
    try {
        const { userId } = req.query;
        // Validación: verificar si `userId` fue proporcionado
        if (!userId) {
            return res.status(400).json({ error: 'Falta el userId' });
        }
        // Buscar el profesor utilizando `userId`
        const profesor = await Profesor.findOne({ where: { user_id: userId } });

        // Validación: verificar si se encontró un profesor
        if (!profesor) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }
        // Devolver el `profesorId` encontrado
        res.json({ profesorId: profesor.id });
    } catch (error) {
        // Manejo de errores: registrar el error y devolver un mensaje genérico
        console.error('Error al obtener el profesorId:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
// Importa el modelo de Profesor si no lo has hecho aún


exports.getProfesorIdByUserId = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Falta el userId' });
        }

        const profesor = await Profesor.findOne({ where: { user_id: userId } });

        if (!profesor) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }

        res.json({ profesorId: profesor.id });
    } catch (error) {
        console.error('Error al obtener el profesorId:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

