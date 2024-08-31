const express = require('express');
const path = require('path');
const authController = require('../controllers/authController'); // Aseg�rate de que esta ruta sea correcta
const cursosController = require('../controllers/cursosController');
const EstudianteController = require('../controllers/estudianteController');
const EstudiantecursoController = require('../controllers/CursoEstudianteController');
const DisponibilidadController = require('../controllers/disponibilidadController');
const router = express.Router();
// P�gina de inicio de sesi�n
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});
// Procesar inicio de sesi�n
router.post('/login', authController.login); // Aseg�rate de que authController.login est� definido
// P�gina de registro
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});
// P�gina de Dashboard
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
});
// Opciones del profesor
router.get('/professor/availability', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'crear-disponibilidad.html'));
});
router.get('/professor/appointments', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'ver-citas.html'));
});
router.get('/professor/students', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'ver-estudiantes.html'));
});
// Opciones del estudiante
router.get('/student/appointments', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'solicitar-cita.html'));
});
// Opciones del administrador
router.get('/admin/courses', async (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'GestiónCursos.html'));
});
router.get('/admin/professors', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'asignar-profesor.html'));
});
router.get('/admin/students', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'AsignarEstudiante.html'));
});
router.get('/admin/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin-settings.html'));
});  // <-- Aqu� estaba el par�ntesis faltante

router.get('/admin/reports', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin-reports.html'));
});
// API para obtener datos 
router.get('/api/user-info', (req, res) => {
    res.json({ id:req.user.id ,name: req.user.nombre, role: req.user.role }); // Env�a datos JSON
});
// Procesar solicitudes POST
router.post('/dashboard', authController.register);
router.post('/crear-curso', cursosController.createCourse);
router.get('/cursos', cursosController.getCourses);
router.get('/profesores', cursosController.getProfessors);
router.get('/estudiantes', EstudianteController.getStudents);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.post('/asignar', EstudiantecursoController.assignStudentsToCourse);
router.get('/cursoprofesor', DisponibilidadController.getCursosPorProfesor);
router.get('/Usuario', DisponibilidadController.getProfesorIdByUserId);
router.post('/disponibilidad', DisponibilidadController.createDisponibilidad);
module.exports = router;