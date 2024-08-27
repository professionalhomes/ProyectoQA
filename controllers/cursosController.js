// controllers/courseController.js
const Course = require('../models/Curso');
const Profesor = require('../models/Profesor'); // Asegúrate de que la ruta sea correcta

// Crear un nuevo curso
exports.createCourse = async (req, res) => {
    try {
        const { name, description, start_date, credits, profesor_id } = req.body;

        // Validar que el Profesor exista
        const profesor = await Profesor.findByPk(profesor_id);
        if (!profesor) {
            return res.status(400).json({ error: 'Profesor no encontrado' });
        }

        const course = await Course.create({ name, description, start_date, credits, profesor_id });
        res.status(201).json(course);
    } catch (error) {
        console.error('Error al crear curso:', error);
        res.status(500).send('Error al crear curso');
    }
};

// Obtener todos los cursos
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            include: [Profesor], // Incluir información del Profesor
        });
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).send('Error al obtener cursos');
    }
};

// Obtener un curso por ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [Profesor], // Incluir información del Profesor
        });
        if (!course) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error('Error al obtener curso:', error);
        res.status(500).send('Error al obtener curso');
    }
};

// Actualizar un curso
exports.updateCourse = async (req, res) => {
    try {
        const { name, description, start_date, credits, profesor_id } = req.body;
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        // Validar que el Profesor exista
        const profesor = await Profesor.findByPk(profesor_id);
        if (!profesor) {
            return res.status(400).json({ error: 'Profesor no encontrado' });
        }

        await course.update({ name, description, start_date, credits, profesor_id });
        res.status(200).json(course);
    } catch (error) {
        console.error('Error al actualizar curso:', error);
        res.status(500).send('Error al actualizar curso');
    }
};

// Eliminar un curso
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        await course.destroy();
        res.status(200).json({ message: 'Curso eliminado' });
    } catch (error) {
        console.error('Error al eliminar curso:', error);
        res.status(500).send('Error al eliminar curso');
    }
};



// Asignar estudiantes a un curso
exports.assignStudents = async (req, res) => {
    try {
        const { course_id, students } = req.body;

        // Validar que el curso exista
        const curso = await Curso.findByPk(course_id);
        if (!curso) {
            return res.status(400).json({ error: 'Curso no encontrado' });
        }

        // Validar que los estudiantes existan
        for (const student_id of students) {
            const estudiante = await Estudiante.findByPk(student_id);
            if (!estudiante) {
                return res.status(400).json({ error: `Estudiante con ID ${student_id} no encontrado` });
            }
        }

        // Asignar estudiantes al curso
        for (const student_id of students) {
            await CursoEstudiante.create({ Curso_id: course_id, Estudiante_id: student_id });
        }

        res.status(200).json({ message: 'Estudiantes asignados al curso exitosamente' });
    } catch (error) {
        console.error('Error al asignar estudiantes:', error);
        res.status(500).send('Error al asignar estudiantes');
    }
};

// Obtener estudiantes asignados a un curso
exports.getStudentsByCourse = async (req, res) => {
    try {
        const curso = await Curso.findByPk(req.params.id, {
            include: {
                model: Estudiante,
                through: {
                    attributes: []
                }
            }
        });

        if (!curso) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        res.status(200).json(curso.Estudiantes); // O el nombre que hayas usado para la relación
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).send('Error al obtener estudiantes');
    }
};