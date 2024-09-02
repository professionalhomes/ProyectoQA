
const Estudiante = require('../models/Estudiante');
const CursoEstudiante = require('../models/CursoEstudiante');
const Curso = require('../models/Curso');

exports.getStudents = async (req, res) => {
    try {
        const students = await Estudiante.findAll();
        console.log('A:', students);
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students' });
    }
};
// Create a new student
exports.updateEstrellas = async (req, res) => {
    const { id, estrellas } = req.body; // Obtener id y estrellas del cuerpo de la solicitud
    try {
        // Validar que el id y las estrellas son válidos
        if (!id || typeof estrellas !== 'number' || estrellas < 1 || estrellas > 3) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }
        // Encontrar al estudiante por ID
        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        // Actualizar el campo estrellas
        estudiante.estrellas = estrellas;
        await estudiante.save();
        res.status(200).json(estudiante); // Enviar el estudiante actualizado como respuesta
    } catch (error) {
        console.error('Error al actualizar estrellas:', error);
        res.status(500).json({ error: 'Error al actualizar estrellas', message: error.message });
    }
};
exports.getCursosPorEstudiante = async (req, res) => {
    const estudianteId = req.params.userId;
    console.log('A:', estudianteId);
    try {
        const estudiante = await Estudiante.findOne({
            where: { user_id: estudianteId }
        });
        if (!estudiante) {
            return res.status(404).json({ error: 'Estudiante no encontrado'});
        }
        console.log('B:', estudiante.id);
        // Ahora, encuentra los cursos del estudiante a través de CursoEstudiante
        const cursosEstudiantes = await CursoEstudiante.findAll({
            where: { Estudiante_id: estudiante.id }
        });
        if (cursosEstudiantes.length === 0) {
            return res.status(404).json({ error: 'No se encontraron cursos para este estudiante' });
        }
        // Devuelve los cursos asociados al estudiante
        const cursoIds = cursosEstudiantes.map(cursoEstudiante => cursoEstudiante.Curso_id);
        console.log('C:', cursoIds);
        const cursos = await Curso.findAll({
            where: { id: cursoIds }
        });
        if (cursos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron cursos' });
        }
        // Devuelve los cursos del estudiante
        res.status(200).json(cursos);
    } catch (error) {
        console.error('Error al obtener los cursos del estudiante:', error);
        res.status(500).send('Error al obtener los cursos del estudiante');
    }
};