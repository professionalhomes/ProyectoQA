const Curso = require('../models/Curso');

// Obtener todos los cursos
exports.obtenerCursos = async (req, res) => {
    try {
        const cursos = await Curso.findAll();
        res.json(cursos);
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).json({ message: 'Error al obtener cursos' });
    }
};

// Crear un nuevo curso
exports.crearCurso = async (req, res) => {
    try {
        const { nombreCurso, codigoCurso } = req.body;
        await Curso.create({ nombre: nombreCurso, codigo: codigoCurso });
        res.redirect('/admin/courses');
    } catch (error) {
        console.error('Error al crear curso:', error);
        res.status(500).json({ message: 'Error al crear curso' });
    }
};

