const Curso = require('../models/Curso'); 
const Estudiante = require('../models/Estudiante');
const CursoEstudiantes = require('../models/CursoEstudiante');

exports.assignStudentsToCourse = async (req, res) => {
    const { Curso_id, estudiante_id } = req.body;
    const curso = parseInt(Curso_id, 10);
    const estudiante = parseInt(estudiante_id, 10);
    try {
        const estudianteRecord = await Estudiante.findByPk(estudiante);
        const cursoRecord = await Curso.findByPk(curso);
        console.log('Semestre del curso:', estudianteRecord);
        console.log('Créditos del curso:', cursoRecord);

        if (!estudianteRecord) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        if (!cursoRecord) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        let assignment = await CursoEstudiantes.findOne({
            where: {
                Curso_id: cursoRecord.id,
                Estudiante_id: estudianteRecord.id
            }
        });
        if (assignment) {
            console.log('A:',  assignment.vecesLlevado);
            // Si ya está registrado, actualizar el campo `vecesLlevado`
            assignment.vecesLlevado = (assignment.vecesLlevado || 0) + 1;
            console.log('D:',  assignment.vecesLlevado);
            await assignment.save();
            res.status(200).json(assignment);
        } else {
            // Si no está registrado, crear una nueva asociación
            assignment = await CursoEstudiantes.create({
                Curso_id: cursoRecord.id,
                Estudiante_id: estudianteRecord.id

            });
            res.status(201).json(assignment);
        }
    } catch (error) {
        console.error('Error al asignar estudiante a curso:', error);
        res.status(500).json({ error: 'Error al asignar estudiante a curso', message: error.message });
    }
};