const Estudiante = require('../models/Estudiante');

// Get all students
exports.getStudents = async (req, res) => {
    try {
        const students = await Estudiante.findAll();
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students' });
    }
};
// Create a new student
exports.createStudent = async (req, res) => {
    const { carnet, nombre, user_id } = req.body;
    try {
        const student = await Estudiante.create({ carnet, nombre, user_id });
        res.status(201).json(student);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Error creating student' });
    }
};
// Update a student
exports.updateStudent = async (req, res) => {
    const { id } = req.params;
    const { carnet, nombre, user_id } = req.body;
    try {
        const student = await Estudiante.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        student.carnet = carnet;
        student.nombre = nombre;
        student.user_id = user_id;
        await student.save();
        res.json(student);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Error updating student' });
    }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Estudiante.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        await student.destroy();
        res.status(204).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Error deleting student' });
    }
};
